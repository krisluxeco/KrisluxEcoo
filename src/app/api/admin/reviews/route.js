import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Review from "@/models/review.model";
import Product from "@/models/product.model"; // to populate
import { auth } from "@/auth";

export async function GET() {
  await connectDb();
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reviews = await Review.find()
      .populate("productId", "name category images")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
