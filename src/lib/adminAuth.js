import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Guard for admin-only API routes.
 * Usage:  const denied = await requireAdmin(); if (denied) return denied;
 */
export const requireAdmin = async () => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Please sign in." }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ message: "Admin access required." }, { status: 403 });
  }
  return null;
};
