import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "You are Not Admin" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const query = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).sort({ lastLogin: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(query),
    ]);

    // Format metrics
    const stats = {
      totalUsers: await User.countDocuments(),
      totalTimeSpent: await User.aggregate([{ $group: { _id: null, total: { $sum: "$totalTimeSpent" } } }]),
      totalQuotes: await User.aggregate([{ $group: { _id: null, total: { $sum: "$quotesRequested" } } }])
    };

    return NextResponse.json({
      users,
      stats: {
        totalUsers: stats.totalUsers,
        totalTimeSpentHours: (stats.totalTimeSpent[0]?.total || 0) / 3600,
        totalQuotes: stats.totalQuotes[0]?.total || 0
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
  }
}
