import nodemailer from "nodemailer";
import { STAGE_INFO } from "./trackingStages";

let transporter = null;

const getTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT) || 587;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Public base URL of the site, used to build links inside emails. */
export const getSiteUrl = (req) => {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || process.env.AUTH_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  try {
    return new URL(req.url).origin;
  } catch {
    return "http://localhost:3000";
  }
};

/**
 * Sends an email. Never throws — returns { sent: boolean, error? } so a mail
 * outage can't break the business action that triggered it.
 */
export const sendMail = async ({ to, subject, html }) => {
  const t = getTransporter();
  if (!t) {
    console.warn(`[mailer] SMTP not configured — skipped email "${subject}" to ${to}`);
    return { sent: false, error: "SMTP not configured" };
  }
  try {
    await t.sendMail({
      from: `"KrisluxECO" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return { sent: true };
  } catch (error) {
    console.error(`[mailer] Failed to send "${subject}" to ${to}:`, error);
    return { sent: false, error: error.message };
  }
};

const layout = (inner) => `
  <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 560px; margin: 0 auto; background:#FAF7F2; padding: 36px 32px; border-radius: 10px; color:#1C1C1A;">
    <p style="font-size:22px; font-weight:bold; margin:0 0 24px;">Krislux<span style="color:#C29B5D;">ECO</span></p>
    ${inner}
    <p style="margin-top:32px; font-size:13px; color:#7A7369;">Warm regards,<br/>The KrisluxECO Team</p>
  </div>`;

const button = (href, label) => `
  <a href="${href}" style="display:inline-block; background:#1C1C1A; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:6px; font-family: Arial, sans-serif; font-size:13px; font-weight:bold; letter-spacing:1px;">${label}</a>`;

export const manufacturerInviteEmail = ({ firstName, workshopName, inviteUrl, expiresHours }) => ({
  subject: "You're invited to the KrisluxECO Artisan Workshop Portal",
  html: layout(`
    <h2 style="color:#4A6741; font-size:24px; margin:0 0 16px;">Welcome, ${escapeHtml(firstName)}</h2>
    <p style="font-size:15px; line-height:1.6;">An account has been created for <strong>${escapeHtml(workshopName || "your workshop")}</strong> on the KrisluxECO Artisan Workshop Portal.</p>
    <p style="font-size:15px; line-height:1.6;">From the portal you can see the work orders assigned to you and update their production progress.</p>
    <p style="font-size:15px; line-height:1.6;">Click below to set your password and activate your account:</p>
    <p style="margin:28px 0;">${button(inviteUrl, "SET MY PASSWORD")}</p>
    <p style="font-size:12px; color:#7A7369; line-height:1.6;">This link works once and expires in ${expiresHours} hours. If it expires, ask the KrisluxECO team to resend it.<br/>Link not working? Copy this into your browser:<br/><span style="word-break:break-all;">${inviteUrl}</span></p>
  `),
});

export const orderStageEmail = ({ contactPerson, trackingCode, stage, trackUrl, carrier }) => {
  const info = STAGE_INFO[stage];
  const subjects = {
    stem_curing: `Your order ${trackingCode} is now in production`,
    dispatched: `Your order ${trackingCode} has been dispatched`,
    delivered: `Your order ${trackingCode} has been delivered`,
  };
  const carrierBlock =
    stage === "dispatched" && carrier?.trackingNumber
      ? `<div style="background:#ffffff; border:1px solid #EAE3D6; border-radius:8px; padding:16px; margin:20px 0; font-family: Arial, sans-serif; font-size:14px;">
          <strong>Courier:</strong> ${escapeHtml(carrier.carrierName || "—")}<br/>
          <strong>AWB / Tracking No:</strong> ${escapeHtml(carrier.trackingNumber)}
          ${carrier.estimatedDelivery ? `<br/><strong>Estimated delivery:</strong> ${escapeHtml(carrier.estimatedDelivery)}` : ""}
        </div>`
      : "";
  return {
    subject: subjects[stage] || `Update on your order ${trackingCode}`,
    html: layout(`
      <p style="font-size:15px;">Hello ${escapeHtml(contactPerson || "there")},</p>
      <h2 style="color:#4A6741; font-size:22px; margin:8px 0 12px;">${escapeHtml(info?.title || "Order update")}</h2>
      <p style="font-size:15px; line-height:1.6;">${escapeHtml(info?.desc || "")}</p>
      ${carrierBlock}
      <p style="font-size:14px;">Tracking ID: <strong style="font-family: monospace; letter-spacing:1px;">${escapeHtml(trackingCode)}</strong></p>
      <p style="margin:24px 0;">${button(trackUrl, "TRACK MY ORDER")}</p>
    `),
  };
};
