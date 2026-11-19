import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { auth } from "@/auth";
import { inviteManufacturer, manufacturerAccountState } from "@/lib/manufacturerAuth";

const clean = (v, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

// PATCH: resend invite, block / unblock, or edit workshop details
export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid workshop ID" }, { status: 400 });
    }

    await connectDb();
    const mfr = await User.findOne({ _id: id, role: "manufacturer" });
    if (!mfr) return NextResponse.json({ message: "Workshop not found" }, { status: 404 });

    const { action, ...fields } = await req.json();
    let extra = {};

    switch (action) {
      case "resend_invite": {
        if (mfr.isBlocked) {
          return NextResponse.json({ message: "Unblock this workshop before re-inviting it." }, { status: 400 });
        }
        // Works for first-time setup and also as an admin-triggered password reset.
        extra = await inviteManufacturer(mfr, req);
        break;
      }
      case "block": {
        mfr.isBlocked = true;
        mfr.inviteTokenHash = null;
        mfr.inviteTokenExpires = null;
        await mfr.save();
        break;
      }
      case "unblock": {
        mfr.isBlocked = false;
        await mfr.save();
        break;
      }
      case "update": {
        const wd = mfr.workshopDetails || {};
        mfr.firstName = clean(fields.firstName, 60) || mfr.firstName;
        mfr.lastName = clean(fields.lastName, 60) || mfr.lastName;
        if (fields.mobile !== undefined) mfr.mobile = clean(fields.mobile, 20);
        mfr.workshopDetails = {
          workshopName: clean(fields.workshopName) ?? wd.workshopName,
          artisanCluster: clean(fields.artisanCluster) ?? wd.artisanCluster,
          specialization: clean(fields.specialization) ?? wd.specialization,
          activeWeavers:
            fields.activeWeavers !== undefined ? Math.max(0, Number(fields.activeWeavers) || 0) : wd.activeWeavers,
        };
        await mfr.save();
        break;
      }
      default:
        return NextResponse.json({ message: "Unknown action" }, { status: 400 });
    }

    const plain = mfr.toObject();
    const { password, inviteTokenHash, resetOtp, ...safe } = plain;
    return NextResponse.json(
      { success: true, manufacturer: { ...safe, accountState: manufacturerAccountState(plain) }, ...extra },
      { status: 200 }
    );
  } catch (error) {
    console.error("Manufacturer admin action error:", error);
    return NextResponse.json({ message: "Action failed" }, { status: 500 });
  }
}
