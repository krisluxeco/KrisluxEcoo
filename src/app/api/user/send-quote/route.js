import { auth } from "@/auth";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Quote from "@/models/quote.model";
import User from "@/models/user.model";
import Email from "@/models/Email.model";

export async function POST(req) {
  try {
    const session = await auth();
    const data = await req.json();
    
    const { 
      productName, 
      companyName, 
      gstNumber, 
      contactPerson, 
      email, 
      phone, 
      quantity, 
      targetBudget, 
      additionalInfo,
      isMultiProduct,
      items,
      address,
      customizationFileUrl,
      customizationFilePublicId,
      productId
    } = data;

    await connectDb();

    let dbItems = [];
    if (isMultiProduct && items) {
      dbItems = items.map(item => ({
        productId: item.product._id || null,
        productName: item.product.name,
        quantity: item.quantity,
        targetBudget: item.targetBudget || null,
      }));
    } else {
      dbItems = [{
        productId: productId || null,
        productName: productName,
        quantity: quantity,
        targetBudget: targetBudget || null,
      }];
    }

    let userId = null;
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email });
      if (user) userId = user._id;
    }

    const newQuote = new Quote({
      userId,
      customerDetails: {
        companyName,
        contactPerson,
        email,
        phone,
        gstNumber,
        address
      },
      items: dbItems,
      additionalInfo,
      customizationFileUrl,
      customizationFilePublicId
    });

    await newQuote.save();


    // We use environment variables for SMTP configuration. 
    // If they aren't set, this will fail gracefully or we can log it.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #FAF7F2; padding: 40px; border-radius: 8px; color: #1C1C1A;">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; color: #1C1C1A; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">Krislux<span style="color: #4A6741;">ECO</span></h1>
          <p style="margin: 5px 0 0 0; color: #C8A97A; font-size: 12px; letter-spacing: 4px; text-transform: uppercase; font-family: 'Arial', sans-serif;">New Bulk Order Inquiry</p>
        </div>

        <div style="background-color: white; padding: 30px; border-radius: 4px; border: 1px solid #E8DDD0;">
          <h2 style="margin-top: 0; color: #4A6741; font-size: 20px; border-bottom: 2px solid #F4EFE6; padding-bottom: 10px;">Quote Items</h2>
          
          ${data.isMultiProduct ? `
            <table style="width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 14px; margin-bottom: 25px;">
              <tr style="background-color: #FAF7F2; text-align: left;">
                <th style="padding: 10px; border-bottom: 1px solid #E8DDD0; color: #1C1C1A;">Product</th>
                <th style="padding: 10px; border-bottom: 1px solid #E8DDD0; color: #1C1C1A;">Qty</th>
                <th style="padding: 10px; border-bottom: 1px solid #E8DDD0; color: #1C1C1A;">Target Budget</th>
              </tr>
              ${data.items.map(item => `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #F4EFE6; color: #6B6560;"><strong>${item.product.name}</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #F4EFE6; font-weight: bold;">${item.quantity}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #F4EFE6;">${item.targetBudget ? '₹' + item.targetBudget : 'N/A'}</td>
                </tr>
              `).join('')}
            </table>
          ` : `
            <table style="width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 14px; margin-bottom: 25px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; color: #6B6560;"><strong>Item Requested:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; text-align: right; font-weight: bold;">${productName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; color: #6B6560;"><strong>Quantity:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; text-align: right; font-weight: bold;">${quantity} units</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; color: #6B6560;"><strong>Target Budget:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; text-align: right; font-weight: bold;">${targetBudget ? '₹' + targetBudget : 'Not specified'}</td>
              </tr>
            </table>
          `}

          <h2 style="color: #4A6741; font-size: 20px; border-bottom: 2px solid #F4EFE6; padding-bottom: 10px; margin-top: 30px;">Customer Profile</h2>
          <table style="width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 14px; margin-bottom: 25px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; color: #6B6560; width: 40%;"><strong>Company Name:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; text-align: right;">${companyName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; color: #6B6560;"><strong>Contact Person:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; text-align: right;">${contactPerson}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; color: #6B6560;"><strong>Email:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; text-align: right;"><a href="mailto:${email}" style="color: #C8A97A; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; color: #6B6560;"><strong>Phone:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; text-align: right;"><a href="tel:${phone}" style="color: #C8A97A; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; color: #6B6560;"><strong>GST Number:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; text-align: right;">${gstNumber || 'N/A'}</td>
            </tr>
            ${data.address ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; color: #6B6560;"><strong>Address:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; text-align: right;">${data.address}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; color: #6B6560;"><strong>User Account:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #F4EFE6; text-align: right;">${session?.user?.email || "Guest"}</td>
            </tr>
          </table>

          <h2 style="color: #4A6741; font-size: 20px; border-bottom: 2px solid #F4EFE6; padding-bottom: 10px; margin-top: 30px;">Additional Notes</h2>
          <div style="background-color: #FAF7F2; padding: 15px; border-radius: 4px; font-family: 'Arial', sans-serif; font-size: 14px; color: #1C1C1A; line-height: 1.6; font-style: italic;">
            ${additionalInfo ? additionalInfo.replace(/\n/g, '<br/>') : 'No additional requirements specified.'}
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
             <a href="mailto:${email}" style="background-color: #1C1C1A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-family: 'Arial', sans-serif; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">Reply to Buyer</a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-family: 'Arial', sans-serif; font-size: 11px; color: #9E9088; text-transform: uppercase; letter-spacing: 1px;">
          This is an automated message from the KrisluxECO B2B Portal.
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER || '"KrisluxECO Orders" <noreply@krisluxeco.com>',
      to: process.env.ADMIN_EMAIL || "admin@krisluxeco.com", 
      subject: `New Bulk Quote Request: ${productName} from ${companyName}`,
      html: htmlContent,
    };

    // Only attempt to send if SMTP_USER is configured, otherwise just log
    if (process.env.SMTP_USER) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log("Email tracking (simulated - SMTP not configured):", mailOptions.subject);
    }

    // Save to the new Admin Inbox so it appears in the Email Dashboard
    await Email.create({
      senderName: contactPerson || companyName || "Guest",
      senderEmail: email,
      recipientEmail: process.env.ADMIN_EMAIL || "admin@krisluxeco.com",
      subject: mailOptions.subject,
      body: htmlContent,
      folder: "inbox",
      isRead: false,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to send quote email:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}
