import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Visit from "@/models/visit.model";

export async function POST(request) {
  try {
    const { source } = await request.json();

    if (!source) {
      return NextResponse.json({ error: "Source is required" }, { status: 400 });
    }

    // Connect to database
    await connectDb();

    // Optionally capture IP address if available
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    // Validate enum
    const validSources = ["instagram", "linkedin", "direct", "other"];
    const safeSource = validSources.includes(source) ? source : "other";

    // Save visit
    const visit = await Visit.create({
      source: safeSource,
      ipAddress,
    });

    return NextResponse.json({ success: true, visitId: visit._id }, { status: 201 });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 });
  }
}
