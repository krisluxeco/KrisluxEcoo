import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { seconds } = await req.json();
    if (!seconds || typeof seconds !== "number" || seconds < 0 || seconds > 120) {
      return NextResponse.json({ message: "Invalid time payload" }, { status: 400 });
    }

    await connectDb();
    
    // Increment the user's totalTimeSpent by the heartheat interval (in seconds)
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { totalTimeSpent: seconds }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Tracking error: ${error.message}` }, { status: 500 });
  }
}
