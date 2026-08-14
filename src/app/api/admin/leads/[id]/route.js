import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Lead from "@/models/Lead.model";

export async function PATCH(req, { params }) {
  try {
    await connectDb();
    
    // In Next.js 16+, params is a Promise so we need to await it
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const updates = await req.json();

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedLead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ success: false, error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDb();
    
    // In Next.js 16+, params is a Promise so we need to await it
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Lead permanently deleted" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json({ success: false, error: "Failed to delete lead" }, { status: 500 });
  }
}
