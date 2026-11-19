import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Quote from "@/models/quote.model";
import { auth } from "@/auth";
import { SALES_STATUSES } from "@/lib/trackingStages";

export async function GET(req) {
  try {
    // Basic admin check
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    await connectDb();
    const quotes = await Quote.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("items.productId");
    
    return NextResponse.json({ quotes }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch quotes:", error);
    return NextResponse.json({ message: "Failed to fetch quotes" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const { id, status, adminNotes, formalQuoteUrl } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Quote ID required" }, { status: 400 });
    }

    await connectDb();
    // Sales statuses only — production statuses are driven by the Production board.
    if (status !== undefined && !SALES_STATUSES.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }
    if (status !== undefined) {
      const existing = await Quote.findById(id).select("status currentStage");
      if (!existing) return NextResponse.json({ message: "Quote not found" }, { status: 404 });
      if (existing.currentStage && existing.currentStage !== "order_received") {
        return NextResponse.json(
          { message: "This order is already in production. Manage it from the Production page." },
          { status: 409 }
        );
      }
    }
    const set = {};
    if (status !== undefined) set.status = status;
    if (adminNotes !== undefined) set.adminNotes = adminNotes;
    if (formalQuoteUrl !== undefined) set.formalQuoteUrl = formalQuoteUrl;

    const updated = await Quote.findByIdAndUpdate(
      id,
      { $set: set },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, quote: updated }, { status: 200 });
  } catch (error) {
    console.error("Failed to update quote:", error);
    return NextResponse.json({ message: "Failed to update quote" }, { status: 500 });
  }
}

