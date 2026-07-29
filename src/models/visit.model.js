import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["instagram", "linkedin", "direct", "other"],
      default: "direct",
    },
    ipAddress: {
      type: String,
      default: "unknown",
    },
  },
  { timestamps: true }
);

const Visit = mongoose.models.Visit || mongoose.model("Visit", visitSchema);
export default Visit;
