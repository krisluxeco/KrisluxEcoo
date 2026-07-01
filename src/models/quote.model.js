import mongoose from "mongoose";

const quoteItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false, // Could be generic request
    },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    targetBudget: { type: Number },
  },
  { _id: false }
);

const quoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional, could be a guest
    },
    customerDetails: {
      companyName: { type: String, trim: true },
      contactPerson: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      gstNumber: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    items: {
      type: [quoteItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one item is required in a quote",
      },
    },
    additionalInfo: { type: String, trim: true },
    customizationFileUrl: { type: String, trim: true },
    customizationFilePublicId: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Quoted", "Sample Sent", "Approved", "Rejected", "Shipped"],
      default: "Pending",
    },
    // The admin's response to the user
    adminNotes: { type: String, trim: true },
    formalQuoteUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.Quote || mongoose.model("Quote", quoteSchema);
