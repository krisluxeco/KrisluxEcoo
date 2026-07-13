import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Promo from "@/models/promo.model";

export async function POST(req) {
  await connectDb();
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const promo = await Promo.findOne({ code: code.toUpperCase() });
    
    if (!promo) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 404 });
    }
    
    if (!promo.isActive) {
      return NextResponse.json({ error: "This promo code is no longer active" }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      code: promo.code,
      discountPercentage: promo.discountPercentage
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
