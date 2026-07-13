import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Promo from "@/models/promo.model";
import { auth } from "@/auth";

export async function GET() {
  await connectDb();
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const promos = await Promo.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(promos);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDb();
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const promo = await Promo.create(body);
    return NextResponse.json(promo);
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Promo code already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
