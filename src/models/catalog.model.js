import mongoose, { Schema } from "mongoose";

const catalogSchema = new Schema(
  {
    shopName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending", // Could be Pending, Reviewed, Approved, etc.
    },
  },
  {
    timestamps: true,
  }
);

export const Catalog = mongoose.models.Catalog || mongoose.model("Catalog", catalogSchema);
