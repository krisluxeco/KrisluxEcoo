import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { hashToken } from "@/lib/manufacturerAuth";

const findInvitedUser = async (token) => {
  if (!token || typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) return null;
  await connectDb();
  return User.findOne({
    inviteTokenHash: hashToken(token),
    inviteTokenExpires: { $gt: new Date() },
    role: "manufacturer",
    isBlocked: { $ne: true },
  });
};

const INVALID = "This invite link is invalid or has expired. Please ask the KrisluxECO team to resend it.";

// GET: check the link and show who it belongs to
export async function GET(req, { params }) {
  try {
    const { token } = await params;
    const user = await findInvitedUser(token);
    if (!user) return NextResponse.json({ message: INVALID }, { status: 404 });

    return NextResponse.json(
      {
        success: true,
        firstName: user.firstName,
        email: user.email,
        workshopName: user.workshopDetails?.workshopName || "",
        isReset: !!user.password,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Invite lookup error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// POST: set the password and consume the token
export async function POST(req, { params }) {
  try {
    const { token } = await params;
    const { password } = await req.json();

    if (typeof password !== "string" || password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters and contain letters and numbers." },
        { status: 400 }
      );
    }
    if (password.length > 128) {
      return NextResponse.json({ message: "Password is too long." }, { status: 400 });
    }

    const user = await findInvitedUser(token);
    if (!user) return NextResponse.json({ message: INVALID }, { status: 404 });

    // Consume atomically so the same link can't be used twice in parallel
    const consumed = await User.findOneAndUpdate(
      { _id: user._id, inviteTokenHash: user.inviteTokenHash },
      {
        $set: {
          password: await bcrypt.hash(password, 10),
          isVerified: true,
          inviteTokenHash: null,
          inviteTokenExpires: null,
        },
      },
      { new: true }
    );
    if (!consumed) return NextResponse.json({ message: INVALID }, { status: 404 });

    return NextResponse.json({ success: true, email: consumed.email }, { status: 200 });
  } catch (error) {
    console.error("Invite accept error:", error);
    return NextResponse.json({ message: "Failed to set password" }, { status: 500 });
  }
}
