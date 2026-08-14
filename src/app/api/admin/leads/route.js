import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Lead from "@/models/Lead.model";

export async function GET(req) {
  try {
    await connectDb();

    const url = new URL(req.url);
    const source = url.searchParams.get("source") || "all";
    const status = url.searchParams.get("status") || "all";
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    if (source !== "all") query.source = source;
    if (status !== "all") query.status = status;

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lead.countDocuments(query);
    const newLeadsCount = await Lead.countDocuments({ status: "new" });

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      newLeadsCount,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch leads" }, { status: 500 });
  }
}
