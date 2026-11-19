import crypto from "crypto";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { sendMail, getSiteUrl, manufacturerInviteEmail } from "@/lib/mailer";

export const INVITE_TTL_HOURS = 48;

export const hashToken = (token) => crypto.createHash("sha256").update(String(token)).digest("hex");

/**
 * Resolves the signed-in user from the database (not just the JWT), so a role
 * change or block by the admin takes effect immediately.
 * Returns { user } or { error, status }.
 */
export const requireManufacturerOrAdmin = async () => {
  const session = await auth();
  if (!session?.user?.email) return { error: "Please sign in to continue.", status: 401 };

  await connectDb();
  const user = await User.findOne({ email: session.user.email.toLowerCase() }).select(
    "role isBlocked firstName lastName workshopDetails email"
  );
  if (!user) return { error: "Account not found.", status: 401 };
  if (user.isBlocked) return { error: "Your account has been suspended. Contact KrisluxECO.", status: 403 };
  if (user.role !== "manufacturer" && user.role !== "admin") {
    return { error: "Access restricted to KrisluxECO artisan partners.", status: 403 };
  }
  return { user };
};

/** Creates a fresh single-use invite token, stores its hash and returns the raw token. */
export const issueInvite = async (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  user.inviteTokenHash = hashToken(token);
  user.inviteTokenExpires = new Date(Date.now() + INVITE_TTL_HOURS * 60 * 60 * 1000);
  user.invitedAt = new Date();
  await user.save();
  return token;
};

/** Issues an invite and emails it. Returns the link so the admin can also share it manually. */
export const inviteManufacturer = async (user, req) => {
  const token = await issueInvite(user);
  const inviteUrl = `${getSiteUrl(req)}/invite/${token}`;
  const { subject, html } = manufacturerInviteEmail({
    firstName: user.firstName,
    workshopName: user.workshopDetails?.workshopName,
    inviteUrl,
    expiresHours: INVITE_TTL_HOURS,
  });
  const mail = await sendMail({ to: user.email, subject, html });
  return { inviteUrl, emailSent: mail.sent, emailError: mail.error };
};

/** Public-facing account state for the admin UI. */
export const manufacturerAccountState = (m) => {
  if (m.isBlocked) return "blocked";
  if (m.password) return "active";
  if (m.inviteTokenExpires && new Date(m.inviteTokenExpires) > new Date()) return "invited";
  return "invite_expired";
};
