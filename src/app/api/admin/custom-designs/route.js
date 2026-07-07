import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import CustomDesign from "@/models/customDesign.model";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDb();
    const requests = await CustomDesign.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error("Error fetching custom designs:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom designs." },
      { status: 500 }
    );
  }
}
