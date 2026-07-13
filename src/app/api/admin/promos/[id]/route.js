import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Promo from "@/models/promo.model";
import { auth } from "@/auth";

export async function PUT(req, { params }) {
  await connectDb();
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const promo = await Promo.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(promo);
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Promo code already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDb();
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await Promo.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
