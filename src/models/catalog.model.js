import mongoose, { Schema } from "mongoose";

const catalogSchema = new Schema(
  {
    organisationName: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    location: {
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
    moq: {
      type: String,
    },
    sustainableMaterial: {
      type: String,
    },
    productType: {
      type: String,
    },
    collaborationModel: {
      type: String,
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
