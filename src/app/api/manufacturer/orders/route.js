import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Quote from "@/models/quote.model";
import uploadOnCloudinary from "@/lib/cloudinary";
import { requireManufacturerOrAdmin } from "@/lib/manufacturerAuth";
import { sendMail, getSiteUrl, orderStageEmail } from "@/lib/mailer";
import {
  STAGE_INFO,
  MANUFACTURER_LAST_STAGE,
  NOTIFY_STAGES,
  nextStage,
  stageIndex,
  statusForStage,
} from "@/lib/trackingStages";

// Double-blind projection: inclusion-only (MongoDB rejects mixing include/exclude).
// Customer identity, contact details and all prices are never selected.
const WORKSHOP_FIELDS =
  "trackingCode items.productName items.quantity additionalInfo customizationFileUrl currentStage stageHistory targetCompletionDate status createdAt updatedAt";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const scopeFor = (user) =>
  user.role === "admin" ? { assignedManufacturer: { $ne: null } } : { assignedManufacturer: user._id };

export async function GET() {
  try {
    const { user, error, status } = await requireManufacturerOrAdmin();
    if (error) return NextResponse.json({ message: error }, { status });

    const orders = await Quote.find({ ...scopeFor(user), status: { $ne: "Rejected" } })
      .select(WORKSHOP_FIELDS)
      .sort({ updatedAt: -1 })
      .lean();
    await Quote.ensureTrackingCodes(orders);

    return NextResponse.json(
      {
        success: true,
        orders,
        workshop: user.workshopDetails || null,
        supervisor: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        isAdminPreview: user.role === "admin",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Manufacturer orders API error:", err);
    return NextResponse.json({ message: "Failed to retrieve workshop orders." }, { status: 500 });
  }
}

// PATCH: advance an order exactly one stage forward (up to "packed").
// Accepts JSON or multipart/form-data (when a progress photo is attached).
export async function PATCH(req) {
  try {
    const { user, error, status } = await requireManufacturerOrAdmin();
    if (error) return NextResponse.json({ message: error }, { status });

    let quoteId, toStage, note, photo;
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      quoteId = form.get("quoteId");
      toStage = form.get("stage");
      note = form.get("note");
      photo = form.get("photo");
      if (!(photo && typeof photo === "object" && photo.size > 0)) photo = null;
    } else {
      ({ quoteId, stage: toStage, note } = await req.json());
    }

    if (!quoteId || !mongoose.isValidObjectId(quoteId) || typeof toStage !== "string") {
      return NextResponse.json({ message: "Order and target stage are required." }, { status: 400 });
    }

    const order = await Quote.findOne({ _id: quoteId, ...scopeFor(user) }).select("currentStage status");
    if (!order) {
      return NextResponse.json({ message: "Work order not found or not assigned to your workshop." }, { status: 404 });
    }
    if (order.status === "Rejected") {
      return NextResponse.json({ message: "This order has been cancelled." }, { status: 400 });
    }

    const current = order.currentStage || "order_received";
    const expected = nextStage(current);
    if (toStage !== expected) {
      return NextResponse.json(
        { message: "Stages must be completed in order. Please refresh — this order may have been updated." },
        { status: 409 }
      );
    }
    if (stageIndex(toStage) > stageIndex(MANUFACTURER_LAST_STAGE)) {
      return NextResponse.json(
        { message: "Dispatch and delivery are handled by the KrisluxECO team." },
        { status: 403 }
      );
    }

    let photoUrl = "";
    if (photo) {
      if (!photo.type?.startsWith("image/")) {
        return NextResponse.json({ message: "Progress photo must be an image." }, { status: 400 });
      }
      if (photo.size > MAX_PHOTO_BYTES) {
        return NextResponse.json({ message: "Photo must be smaller than 5 MB." }, { status: 400 });
      }
      photoUrl = (await uploadOnCloudinary(photo)) || "";
      if (!photoUrl) {
        return NextResponse.json({ message: "Photo upload failed. Try again or update without a photo." }, { status: 502 });
      }
    }

    const set = { currentStage: toStage };
    const derivedStatus = statusForStage(toStage);
    if (derivedStatus) set.status = derivedStatus;

    // Conditional on the stage we validated against — prevents double-advancing
    // if two people press the button at the same time.
    const updated = await Quote.findOneAndUpdate(
      { _id: quoteId, ...scopeFor(user), currentStage: current },
      {
        $set: set,
        $push: {
          stageHistory: {
            stage: toStage,
            title: STAGE_INFO[toStage].title,
            note: typeof note === "string" ? note.trim().slice(0, 500) : "",
            photoUrl,
            actor: user.role === "admin" ? "admin" : "manufacturer",
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    ).select(`${WORKSHOP_FIELDS} customerDetails.email customerDetails.contactPerson`);

    if (!updated) {
      return NextResponse.json(
        { message: "This order was just updated by someone else. Please refresh." },
        { status: 409 }
      );
    }

    if (NOTIFY_STAGES.includes(toStage) && updated.customerDetails?.email) {
      const { subject, html } = orderStageEmail({
        contactPerson: updated.customerDetails.contactPerson,
        trackingCode: updated.trackingCode,
        stage: toStage,
        trackUrl: `${getSiteUrl(req)}/track?code=${encodeURIComponent(updated.trackingCode)}`,
      });
      await sendMail({ to: updated.customerDetails.email, subject, html });
    }

    // Strip the customer fields we only loaded for the email
    const safe = updated.toObject();
    delete safe.customerDetails;

    return NextResponse.json({ success: true, order: safe }, { status: 200 });
  } catch (err) {
    console.error("Manufacturer stage update error:", err);
    return NextResponse.json({ message: "Failed to update production milestone." }, { status: 500 });
  }
}
