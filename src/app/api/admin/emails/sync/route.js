import { NextResponse } from "next/server";
import imaps from "imap-simple";
import { simpleParser } from "mailparser";
import connectDb from "@/lib/db";
import Email from "@/models/Email.model";

export async function POST(req) {
  try {
    await connectDb();
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json({ success: false, error: "SMTP/IMAP credentials not configured" }, { status: 400 });
    }

    const config = {
      imap: {
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASS,
        host: "imap.gmail.com",
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 10000
      }
    };

    const connection = await imaps.connect(config);
    await connection.openBox("INBOX");

    // Fetch emails from the last 7 days
    const delay = 7 * 24 * 3600 * 1000;
    const since = new Date(Date.now() - delay).toISOString();

    const searchCriteria = ["UNSEEN", ["SINCE", since]];
    const fetchOptions = {
      bodies: [""],
      markSeen: true
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    let syncedCount = 0;

    for (const item of messages) {
      const all = item.parts.find(part => part.which === "");
      if (all) {
        const parsed = await simpleParser(all.body);
        
        // Ensure we don't save duplicates
        const existing = await Email.findOne({ messageId: parsed.messageId });
        if (!existing) {
          await Email.create({
            senderName: parsed.from.value[0].name || parsed.from.value[0].address,
            senderEmail: parsed.from.value[0].address,
            recipientEmail: process.env.SMTP_USER,
            subject: parsed.subject || "No Subject",
            body: parsed.html || parsed.textAsHtml || parsed.text || "No Content",
            folder: "inbox",
            isRead: false,
            messageId: parsed.messageId,
          });
          syncedCount++;
        }
      }
    }

    connection.end();

    return NextResponse.json({ success: true, message: `Synced ${syncedCount} new emails.` });
  } catch (error) {
    console.error("IMAP Sync error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
