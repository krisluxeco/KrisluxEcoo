import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["indiamart", "exportindia", "website", "other"],
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    queryMessage: {
      type: String,
    },
    externalLeadId: {
      type: String,
      unique: true, // Prevents duplicate syncing from APIs
      sparse: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "lost", "converted"],
      default: "new",
    },
    value: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation in Next.js development
const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

export default Lead;
