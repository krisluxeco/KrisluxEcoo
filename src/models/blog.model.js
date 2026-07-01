import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    content: { type: String, required: true },
    image: { type: String, default: "" }, // cover image URL
    author: { type: String, default: "KrisluxECO Team" },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
    },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
