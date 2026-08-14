import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Email from "@/models/Email.model";

export async function PATCH(req, { params }) {
  try {
    await connectDb();
    
    // In Next.js 16+, params is a Promise so we need to await it
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const updates = await req.json();

    const updatedEmail = await Email.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedEmail) {
      return NextResponse.json({ success: false, error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedEmail });
  } catch (error) {
    console.error("Error updating email:", error);
    return NextResponse.json({ success: false, error: "Failed to update email" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDb();
    
    // In Next.js 16+, params is a Promise so we need to await it
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const email = await Email.findById(id);

    if (!email) {
      return NextResponse.json({ success: false, error: "Email not found" }, { status: 404 });
    }

    // If it's already in the trash, permanently delete it
    if (email.folder === "trash") {
      await Email.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: "Email permanently deleted" });
    } else {
      // Otherwise, move to trash
      email.folder = "trash";
      await email.save();
      return NextResponse.json({ success: true, data: email, message: "Email moved to trash" });
    }
  } catch (error) {
    console.error("Error deleting email:", error);
    return NextResponse.json({ success: false, error: "Failed to delete email" }, { status: 500 });
  }
}
