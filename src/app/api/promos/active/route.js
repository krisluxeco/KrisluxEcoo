import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Promo from "@/models/promo.model";

export async function GET() {
  await connectDb();
  try {
    // Find the first active promo code
    const promo = await Promo.findOne({ isActive: true }).sort({ createdAt: -1 }).lean();
    if (!promo) {
      return NextResponse.json({ promo: null });
    }
    return NextResponse.json({ promo });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
