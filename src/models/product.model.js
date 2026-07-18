import mongoose from "mongoose";

const specSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String }, // for cloud storage (e.g. Cloudinary) cleanup on delete
  },
  { _id: false }
);

const volumePricingSchema = new mongoose.Schema(
  {
    minQty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true, default: "" },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    images: {
      type: [imageSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one product image is required",
      },
    },

    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: null },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, trim: true, unique: true, sparse: true },
    minOrderQty: { type: Number, min: 1, default: 1 },

    weight: { type: Number, default: null },
    length: { type: Number, default: null },
    width: { type: Number, default: null },
    height: { type: Number, default: null },

    tags: { type: [String], default: [] },
    specs: { type: [specSchema], default: [] },
    highlights: { type: [String], default: [] },
    
    // B2B features
    volumePricing: { type: [volumePricingSchema], default: [] },
    leadTime: { type: String, trim: true, default: "3-4 weeks" },
    downloadableSpecSheetUrl: { type: String, trim: true },

    status: {
      type: String,
      enum: ["draft", "active", "out_of_stock"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);