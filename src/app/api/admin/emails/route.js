import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Email from "@/models/Email.model";
import nodemailer from "nodemailer";

export async function GET(req) {
  try {
    await connectDb();

    // Get URL parameters
    const url = new URL(req.url);
    const folder = url.searchParams.get("folder") || "inbox";
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    let query = { folder };
    if (folder === "starred") {
      query = { isStarred: true };
    }

    // Fetch emails
    const emails = await Email.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count total for pagination
    const total = await Email.countDocuments(query);

    // Count unread in inbox
    const unreadCount = await Email.countDocuments({ folder: "inbox", isRead: false });

    return NextResponse.json({
      success: true,
      data: emails,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch emails" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDb();
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || "hello@krisluxeco.com";
    const adminName = "KrisluxECO Admin";

    // 1. Save to database as "sent"
    const newEmail = await Email.create({
      senderName: adminName,
      senderEmail: adminEmail,
      recipientEmail: to,
      subject,
      body,
      folder: "sent",
      isRead: true, // Sent emails are implicitly read by the sender
    });

    // 2. Send via Nodemailer (if SMTP credentials are provided)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${adminName}" <${adminEmail}>`,
        to,
        subject,
        html: body,
      });
    } else {
      console.log("⚠️ SMTP credentials not found in .env.local. Email saved to DB but NOT sent via SMTP.");
      console.log(`Simulating send to: ${to} | Subject: ${subject}`);
    }

    return NextResponse.json({ success: true, data: newEmail });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
