import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Quote from "@/models/quote.model";
import { auth } from "@/auth";

export async function GET(req) {
  try {
    // Basic admin check
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, status, adminNotes, formalQuoteUrl } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Quote ID required" }, { status: 400 });
    }

    await connectDb();
    const updated = await Quote.findByIdAndUpdate(
      id,
      { $set: { status, adminNotes, formalQuoteUrl } },
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

