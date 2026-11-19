import mongoose from "mongoose";
import crypto from "crypto";
import { STAGE_ORDER } from "../lib/trackingStages";

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
      enum: ["Pending", "Quoted", "Sample Sent", "Approved", "In Production", "Shipped", "Delivered", "Rejected"],
      default: "Pending",
    },
    // The admin's response to the user
    adminNotes: { type: String, trim: true },
    formalQuoteUrl: { type: String, trim: true },

    // Tracking & Production Pipeline (Double-Blind Protected)
    trackingCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    assignedManufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    targetCompletionDate: {
      type: Date,
      default: null,
    },
    currentStage: {
      type: String,
      enum: STAGE_ORDER,
      default: "order_received",
    },
    stageHistory: [
      {
        stage: { type: String, required: true },
        title: { type: String, required: true },
        note: { type: String, default: "" },
        photoUrl: { type: String, default: "" },
        // who made the change — never exposes identity, only the role
        actor: { type: String, enum: ["system", "admin", "manufacturer"], default: "system" },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    carrierDetails: {
      carrierName: { type: String, default: "" },
      trackingNumber: { type: String, default: "" },
      trackingUrl: { type: String, default: "" },
      dispatchDate: { type: Date, default: null },
      estimatedDelivery: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// Unambiguous alphabet (no 0/O, 1/I/L) — easy to read out over the phone.
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export const generateTrackingCode = () => {
  const bytes = crypto.randomBytes(8);
  let code = "";
  for (let i = 0; i < 8; i++) code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return `KLX-${code}`;
};

const initialHistory = () => [
  {
    stage: "order_received",
    title: "Order Received & Verified",
    note: "Your inquiry has been registered with the KrisluxECO concierge.",
    actor: "system",
    updatedAt: new Date(),
  },
];

// Mongoose 9: pre hooks no longer receive `next` — use an async function instead.
quoteSchema.pre("save", async function () {
  if (!this.trackingCode) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generateTrackingCode();
      const taken = await this.constructor.exists({ trackingCode: candidate });
      if (!taken) {
        this.trackingCode = candidate;
        break;
      }
    }
    if (!this.trackingCode) throw new Error("Could not allocate a unique tracking code");
  }
  if (!this.stageHistory || this.stageHistory.length === 0) {
    this.stageHistory = initialHistory();
  }
});

/**
 * Back-fills tracking codes for orders created before tracking existed.
 * Mutates the passed documents/objects so callers can return them directly.
 */
quoteSchema.statics.ensureTrackingCodes = async function (orders) {
  for (const order of orders) {
    if (order.trackingCode) continue;
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generateTrackingCode();
      const res = await this.updateOne(
        { _id: order._id, trackingCode: { $in: [null, ""] } },
        {
          $set: { trackingCode: candidate, currentStage: order.currentStage || "order_received" },
          ...(order.stageHistory?.length ? {} : { $push: { stageHistory: { $each: initialHistory() } } }),
        }
      ).catch((err) => (err.code === 11000 ? null : Promise.reject(err)));
      if (res) {
        const fresh = await this.findById(order._id).select("trackingCode stageHistory currentStage").lean();
        order.trackingCode = fresh?.trackingCode;
        order.stageHistory = fresh?.stageHistory;
        order.currentStage = fresh?.currentStage;
        break;
      }
    }
  }
  return orders;
};

// In dev, hot reload keeps an old compiled model around — rebuild it if the schema changed.
if (mongoose.models.Quote && !mongoose.models.Quote.schema.path("currentStage")?.enumValues?.includes("packed")) {
  delete mongoose.models.Quote;
}

export default mongoose.models.Quote || mongoose.model("Quote", quoteSchema);
