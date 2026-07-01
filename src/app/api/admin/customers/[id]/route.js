import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "You are Not Admin" }, { status: 400 });
    }

    const { id } = await params;
    const data = await req.json();

    // Prevent blocking yourself
    if (session.user.id === id) {
        return NextResponse.json({ message: "Cannot block your own account" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
    
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
  }
}
