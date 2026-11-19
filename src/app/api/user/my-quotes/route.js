import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Quote from "@/models/quote.model";
import User from "@/models/user.model";
import Product from "@/models/product.model"; // Ensure model is registered
import { auth } from "@/auth";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDb();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Workshop identity is never shown to customers (double-blind)
    const quotes = await Quote.find({ userId: user._id })
      .select("-assignedManufacturer -customizationFilePublicId")
      .populate("items.productId")
      .sort({ createdAt: -1 })
      .lean();
    await Quote.ensureTrackingCodes(quotes);
    for (const q of quotes) {
      q.stageHistory = (q.stageHistory || []).map(({ actor, ...h }) => h);
    }
    
    return NextResponse.json({ quotes }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user quotes:", error);
    return NextResponse.json({ message: "Failed to fetch quotes" }, { status: 500 });
  }
}
