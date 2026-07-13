import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Review from "@/models/review.model";
import { auth } from "@/auth";

export async function DELETE(req, { params }) {
  await connectDb();
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = await params;
    await Review.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
