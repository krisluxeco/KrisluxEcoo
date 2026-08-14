import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    senderEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    recipientEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    messageId: {
      type: String,
      unique: true,
      sparse: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      enum: ["inbox", "sent", "trash"],
      default: "inbox",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.models.Email || mongoose.model("Email", emailSchema);

export default Email;
