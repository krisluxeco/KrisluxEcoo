import mongoose from "mongoose";

const customDesignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    description: { type: String, required: true },
    imageUrl: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

delete mongoose.models.CustomDesign;

export default mongoose.model("CustomDesign", customDesignSchema);
