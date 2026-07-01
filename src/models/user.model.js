import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: false,
      default: null,
    },

    mobile: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    image: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    socketId: {
      type: String,
      default: null,
    },

    savedProducts: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },

    // B2B Details
    companyName: {
      type: String,
      trim: true,
      default: "",
    },
    taxId: {
      type: String, // GST or VAT
      trim: true,
      default: "",
    },

    // Analytics & Tracking
    lastLogin: {
      type: Date,
      default: null,
    },
    totalTimeSpent: {
      type: Number, // in seconds
      default: 0,
    },
    quotesRequested: {
      type: Number, // how many times they initiated whatsapp intent
      default: 0,
    },

    // Account Management
    isBlocked: {
      type: Boolean,
      default: false,
    },
    
    // Password Reset OTP
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

if (mongoose.models.User) {
  // If User model is cached but doesn't have the new savedProducts schema path, delete the cached version
  if (!mongoose.models.User.schema.paths.savedProducts) {
    delete mongoose.models.User;
  }
}

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
