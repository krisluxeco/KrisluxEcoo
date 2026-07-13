import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Review from "@/models/review.model";
import { auth } from "@/auth";

// Fetch reviews for a specific product
export async function GET(req) {
  await connectDb();
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const reviews = await Review.find({ productId, status: "approved" }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create a new review
export async function POST(req) {
  await connectDb();
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "You must be logged in to leave a review." }, { status: 401 });
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: "Please provide a rating and comment." }, { status: 400 });
    }

    const newReview = await Review.create({
      productId,
      userId: session.user.id,
      userName: session.user.name || "Krislux Customer",
      rating: Number(rating),
      comment,
      status: "approved", 
    });

    return NextResponse.json(newReview);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
