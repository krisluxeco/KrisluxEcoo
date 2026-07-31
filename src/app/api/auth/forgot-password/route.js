import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectDb();

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // For security reasons, don't reveal if the user exists or not
    if (!user) {
      return NextResponse.json(
        { success: true, message: "If that email exists, an OTP has been sent." },
        { status: 200 }
      );
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to user with 10 minute expiry
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send the email
    const mailOptions = {
      from: process.env.SMTP_USER || '"KrisluxECO Security" <noreply@krisluxeco.com>',
      to: user.email,
      subject: "KrisluxECO - Password Reset Verification Code",
      html: `
        <div style="font-family: var(--font-montserrat), sans-serif; max-w-md; margin: 0 auto; color: #1C1C1A;">
          <h2 style="color: #4A6741; font-family: var(--font-playfair), Georgia, serif; font-size: 28px;">Password Reset</h2>
          <p>Hello ${user.firstName},</p>
          <p>We received a request to reset the password for your KrisluxECO account.</p>
          <p>Your password reset verification code is:</p>
          <div style="background-color: #FAF7F2; border: 1px solid #E8DDD0; padding: 15px 20px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0; border-radius: 8px;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes. If you did not request a password reset, please safely ignore this email.</p>
          <br/>
          <p>Warm regards,<br/>The KrisluxECO Team</p>
        </div>
      `,
    };

    if (process.env.SMTP_USER) {
      await transporter.sendMail(mailOptions);
    } else {
      console.warn("SMTP credentials not configured. OTP generated but email not sent. OTP:", otp);
    }

    return NextResponse.json(
      { success: true, message: "If that email exists, an OTP has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectDb();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ message: "Invalid verification code or email" }, { status: 400 });
    }

    // Verify OTP and check expiration
    if (user.resetOtp !== otp) {
      return NextResponse.json({ message: "Invalid verification code" }, { status: 400 });
    }

    if (user.resetOtpExpires < Date.now()) {
      return NextResponse.json({ message: "Verification code has expired. Please request a new one." }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user and clear OTP fields
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password has been reset successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
