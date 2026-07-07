import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import CustomDesign from "@/models/customDesign.model";
import { auth } from "@/auth";

export async function PUT(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    await connectDb();
    const updatedRequest = await CustomDesign.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Status updated successfully", request: updatedRequest },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating custom design status:", error);
    return NextResponse.json(
      { error: "Failed to update status." },
      { status: 500 }
    );
  }
}
