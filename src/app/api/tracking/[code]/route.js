import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Quote from "@/models/quote.model";

// Light per-instance rate limit to slow down code guessing.
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;
const hits = new Map();

const rateLimited = (ip) => {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (now - v.start > WINDOW_MS) hits.delete(k);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
};

// Public, double-blind tracking: no customer details, prices or workshop identity.
const PUBLIC_FIELDS =
  "trackingCode status currentStage stageHistory carrierDetails items.productName items.quantity createdAt targetCompletionDate";

export async function GET(req, { params }) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ message: "Too many requests. Please wait a minute and try again." }, { status: 429 });
    }

    const { code } = await params;
    const normalized = typeof code === "string" ? code.trim().toUpperCase() : "";
    if (!/^KLX-[A-Z0-9]{4,12}$/.test(normalized)) {
      return NextResponse.json(
        { message: "Please enter a valid tracking ID, e.g. KLX-7QH4M2XA." },
        { status: 400 }
      );
    }

    await connectDb();
    const order = await Quote.findOne({ trackingCode: normalized }).select(PUBLIC_FIELDS).lean();

    if (!order) {
      return NextResponse.json({ message: "No order found with this tracking ID." }, { status: 404 });
    }

    const tracking = {
      trackingCode: order.trackingCode,
      status: order.status,
      currentStage: order.currentStage || "order_received",
      createdAt: order.createdAt,
      targetCompletionDate: order.targetCompletionDate,
      items: order.items,
      carrierDetails: order.carrierDetails,
      stageHistory: (order.stageHistory || []).map((h) => ({
        stage: h.stage,
        title: h.title,
        note: h.note,
        photoUrl: h.photoUrl,
        updatedAt: h.updatedAt,
      })),
    };

    return NextResponse.json({ success: true, tracking }, { status: 200 });
  } catch (error) {
    console.error("Tracking API error:", error);
    return NextResponse.json({ message: "Unable to retrieve tracking data." }, { status: 500 });
  }
}
