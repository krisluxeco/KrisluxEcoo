import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDb from "@/lib/db";
import Quote from "@/models/quote.model";
import User from "@/models/user.model";
import { auth } from "@/auth";
import { inviteManufacturer, manufacturerAccountState } from "@/lib/manufacturerAuth";
import { sendMail, getSiteUrl, orderStageEmail } from "@/lib/mailer";
import {
  STAGE_INFO,
  STAGE_ORDER,
  NOTIFY_STAGES,
  PRODUCTION_STATUSES,
  isValidStage,
  statusForStage,
} from "@/lib/trackingStages";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const requireAdmin = async () => {
  const session = await auth();
  return session?.user?.role === "admin";
};

const populateOrder = (query) =>
  query
    .populate("userId", "firstName lastName email")
    .populate("assignedManufacturer", "firstName lastName email workshopDetails");

// An order belongs on the production board once it is confirmed (Approved or later),
// or if it has already entered the pipeline. Pending/Quoted quotes stay on the Orders page.
const PRODUCTION_SCOPE = {
  status: { $ne: "Rejected" },
  $or: [{ status: { $in: PRODUCTION_STATUSES } }, { currentStage: { $nin: [null, "order_received"] } }],
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const filterForView = (view) => {
  const beforePacked = STAGE_ORDER.slice(0, STAGE_ORDER.indexOf("packed"));
  switch (view) {
    case "unassigned":
      return { assignedManufacturer: null, currentStage: { $nin: ["dispatched", "delivered"] } };
    case "in_production":
      return { currentStage: { $in: ["stem_curing", "weaving", "quality_inspection"] } };
    case "ready":
      return { currentStage: "packed" };
    case "shipped":
      return { currentStage: "dispatched" };
    case "delivered":
      return { currentStage: "delivered" };
    case "overdue":
      return { targetCompletionDate: { $lt: startOfToday() }, currentStage: { $in: beforePacked } };
    case "open":
      return { currentStage: { $ne: "delivered" } };
    default:
      return {};
  }
};

// GET: paginated production board + counts + workshop directory
// Query: ?page=1&limit=10&view=open|all|unassigned|in_production|ready|shipped|delivered|overdue&q=text
export async function GET(req) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }
    await connectDb();

    const sp = new URL(req.url).searchParams;
    const limit = Math.min(50, Math.max(5, parseInt(sp.get("limit"), 10) || 10));
    const view = sp.get("view") || "open";
    const q = (sp.get("q") || "").trim().slice(0, 100);

    // Back-fill tracking codes for any legacy confirmed orders (cheap no-op once done)
    const missing = await Quote.find({ ...PRODUCTION_SCOPE, trackingCode: { $in: [null, ""] } })
      .select("_id currentStage stageHistory")
      .lean();
    if (missing.length) await Quote.ensureTrackingCodes(missing);

    const and = [PRODUCTION_SCOPE, filterForView(view)];
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      and.push({
        $or: [
          { trackingCode: rx },
          { "customerDetails.contactPerson": rx },
          { "customerDetails.companyName": rx },
          { "customerDetails.email": rx },
          { "items.productName": rx },
        ],
      });
    }
    const filter = { $and: and };

    const total = await Quote.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const page = Math.min(totalPages, Math.max(1, parseInt(sp.get("page"), 10) || 1));

    const orders = await populateOrder(
      Quote.find(filter)
        .select("-items.targetBudget -formalQuoteUrl -customizationFilePublicId")
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
    ).lean();

    const views = ["open", "all", "unassigned", "in_production", "ready", "shipped", "delivered", "overdue"];
    const countsArr = await Promise.all(
      views.map((v) => Quote.countDocuments({ $and: [PRODUCTION_SCOPE, filterForView(v)] }))
    );
    const counts = Object.fromEntries(views.map((v, i) => [v, countsArr[i]]));

    const manufacturerDocs = await User.find({ role: "manufacturer" })
      .select("firstName lastName email mobile workshopDetails isBlocked password inviteTokenExpires invitedAt lastLogin createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const activeAgg = await Quote.aggregate([
      { $match: { ...PRODUCTION_SCOPE, assignedManufacturer: { $ne: null }, currentStage: { $nin: ["dispatched", "delivered"] } } },
      { $group: { _id: "$assignedManufacturer", n: { $sum: 1 } } },
    ]);
    const activeCounts = Object.fromEntries(activeAgg.map((a) => [a._id.toString(), a.n]));

    const manufacturers = manufacturerDocs.map((m) => {
      const { password, ...rest } = m;
      return { ...rest, accountState: manufacturerAccountState(m), activeOrders: activeCounts[m._id.toString()] || 0 };
    });

    return NextResponse.json(
      { success: true, orders, manufacturers, counts, pagination: { page, limit, total, totalPages } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin production fetch error:", error);
    return NextResponse.json({ message: "Failed to load production pipeline" }, { status: 500 });
  }
}

// PATCH: assign workshop, move stage, set courier, target date, notes
export async function PATCH(req) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }
    await connectDb();

    const body = await req.json();
    const { quoteId, assignedManufacturer, currentStage, status, carrierDetails, targetCompletionDate, adminNotes, note } =
      body;

    if (!quoteId || !mongoose.isValidObjectId(quoteId)) {
      return NextResponse.json({ message: "Valid order ID required" }, { status: 400 });
    }

    const order = await Quote.findById(quoteId);
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    const confirmed = PRODUCTION_STATUSES.includes(order.status) || (order.currentStage && order.currentStage !== "order_received");
    if (!confirmed && (currentStage !== undefined || assignedManufacturer)) {
      return NextResponse.json(
        { message: "Approve this quote on the Orders page before sending it to production." },
        { status: 400 }
      );
    }
    if (order.status === "Rejected" && (currentStage !== undefined || assignedManufacturer)) {
      return NextResponse.json({ message: "This order was rejected." }, { status: 400 });
    }

    // Make sure legacy orders have a tracking code before any update
    if (!order.trackingCode) await Quote.ensureTrackingCodes([order]);

    const set = {};
    const push = [];

    if (assignedManufacturer !== undefined) {
      if (assignedManufacturer) {
        if (!mongoose.isValidObjectId(assignedManufacturer)) {
          return NextResponse.json({ message: "Invalid workshop" }, { status: 400 });
        }
        const mfr = await User.findOne({ _id: assignedManufacturer, role: "manufacturer" }).select("isBlocked");
        if (!mfr) return NextResponse.json({ message: "Workshop not found" }, { status: 404 });
        if (mfr.isBlocked) {
          return NextResponse.json({ message: "This workshop is blocked. Unblock it before assigning orders." }, { status: 400 });
        }
        set.assignedManufacturer = mfr._id;
      } else {
        set.assignedManufacturer = null;
      }
    }

    if (status !== undefined) {
      if (!Quote.schema.path("status").enumValues.includes(status)) {
        return NextResponse.json({ message: "Invalid status" }, { status: 400 });
      }
      set.status = status;
    }

    if (targetCompletionDate !== undefined) {
      if (targetCompletionDate) {
        const d = new Date(targetCompletionDate);
        if (Number.isNaN(d.getTime())) return NextResponse.json({ message: "Invalid target date" }, { status: 400 });
        set.targetCompletionDate = d;
      } else {
        set.targetCompletionDate = null;
      }
    }

    if (adminNotes !== undefined) set.adminNotes = clean(adminNotes, 2000);

    if (carrierDetails) {
      const trackingUrl = clean(carrierDetails.trackingUrl, 500);
      if (trackingUrl && !/^https?:\/\//i.test(trackingUrl)) {
        return NextResponse.json({ message: "Courier tracking URL must start with http:// or https://" }, { status: 400 });
      }
      set["carrierDetails.carrierName"] = clean(carrierDetails.carrierName, 100);
      set["carrierDetails.trackingNumber"] = clean(carrierDetails.trackingNumber, 100);
      set["carrierDetails.trackingUrl"] = trackingUrl;
      set["carrierDetails.estimatedDelivery"] = clean(carrierDetails.estimatedDelivery, 50);
    }

    let stageChanged = false;
    if (currentStage !== undefined) {
      if (!isValidStage(currentStage)) {
        return NextResponse.json({ message: "Invalid stage" }, { status: 400 });
      }
      if (currentStage !== order.currentStage) {
        stageChanged = true;
        set.currentStage = currentStage;
        const derived = statusForStage(currentStage);
        if (derived && status === undefined) set.status = derived;
        if (currentStage === "dispatched" && !order.carrierDetails?.dispatchDate) {
          set["carrierDetails.dispatchDate"] = new Date();
        }
        push.push({
          stage: currentStage,
          title: STAGE_INFO[currentStage].title,
          note: clean(note, 500),
          actor: "admin",
          updatedAt: new Date(),
        });
      }
    }

    const update = { $set: set };
    if (push.length) update.$push = { stageHistory: { $each: push } };

    const updated = await populateOrder(
      Quote.findByIdAndUpdate(quoteId, update, { new: true, runValidators: true }).select(
        "-items.targetBudget -formalQuoteUrl -customizationFilePublicId"
      )
    );

    // Customer notification on key milestones (never blocks the response on failure)
    let notified = false;
    if (stageChanged && NOTIFY_STAGES.includes(currentStage) && updated.customerDetails?.email) {
      const { subject, html } = orderStageEmail({
        contactPerson: updated.customerDetails.contactPerson,
        trackingCode: updated.trackingCode,
        stage: currentStage,
        trackUrl: `${getSiteUrl(req)}/track?code=${encodeURIComponent(updated.trackingCode)}`,
        carrier: updated.carrierDetails,
      });
      notified = (await sendMail({ to: updated.customerDetails.email, subject, html })).sent;
    }

    return NextResponse.json({ success: true, order: updated, notified }, { status: 200 });
  } catch (error) {
    console.error("Admin production update error:", error);
    return NextResponse.json({ message: "Failed to update order pipeline" }, { status: 500 });
  }
}

// POST: create a manufacturer account and send them an invite link
export async function POST(req) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }
    await connectDb();

    const body = await req.json();
    const firstName = clean(body.firstName, 60);
    const lastName = clean(body.lastName, 60);
    const email = clean(body.email, 120).toLowerCase();

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ message: "First name, last name and email are required" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      const msg =
        existing.role === "manufacturer"
          ? "A workshop with this email already exists. Use “Resend invite” from the workshop list."
          : "This email already belongs to a customer or admin account. Please use a different email for the workshop.";
      return NextResponse.json({ message: msg }, { status: 409 });
    }

    const manufacturer = await User.create({
      firstName,
      lastName,
      email,
      mobile: clean(body.mobile, 20),
      role: "manufacturer",
      isVerified: true,
      password: null,
      workshopDetails: {
        workshopName: clean(body.workshopName, 120) || `${firstName}'s Workshop`,
        artisanCluster: clean(body.artisanCluster, 120) || "Begusarai, Bihar",
        specialization: clean(body.specialization, 120) || "Water Hyacinth Crafting",
        activeWeavers: Math.max(0, Number(body.activeWeavers) || 0),
      },
    });

    const invite = await inviteManufacturer(manufacturer, req);

    return NextResponse.json(
      {
        success: true,
        manufacturer: {
          _id: manufacturer._id,
          firstName,
          lastName,
          email,
          workshopDetails: manufacturer.workshopDetails,
          accountState: "invited",
        },
        ...invite,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create manufacturer error:", error);
    return NextResponse.json({ message: "Failed to create workshop account" }, { status: 500 });
  }
}
