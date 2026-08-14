import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load .env.local manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8").split("\n");
  envConfig.forEach(line => {
    if (line.startsWith("MONGODB_URI=")) {
      process.env.MONGODB_URI = line.split("MONGODB_URI=")[1].trim();
    }
  });
}

// Quick local schema definition so we don't need to resolve the alias @/models
const emailSchema = new mongoose.Schema({
  senderName: String,
  senderEmail: String,
  recipientEmail: String,
  subject: String,
  body: String,
  folder: { type: String, default: "inbox" },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Email = mongoose.models.Email || mongoose.model("Email", emailSchema);

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    await Email.deleteMany({});
    console.log("Cleared existing emails.");

    const dummyEmails = [
      {
        senderName: "John Doe",
        senderEmail: "john.doe@example.com",
        recipientEmail: "hello@krisluxeco.com",
        subject: "Bulk Order Inquiry",
        body: "Hello KrisluxECO team,\n\nI am interested in placing a bulk order for your water hyacinth baskets for my retail store. Could you please send me your wholesale catalog?\n\nBest,\nJohn",
        folder: "inbox",
        isRead: false,
      },
      {
        senderName: "Jane Smith",
        senderEmail: "jane@ecostyle.com",
        recipientEmail: "hello@krisluxeco.com",
        subject: "Partnership Opportunity",
        body: "Hi there,\n\nWe love your sustainable mission and would like to feature your products in our upcoming eco-friendly living magazine. Let me know if you are open to a collaboration!\n\nThanks,\nJane",
        folder: "inbox",
        isRead: false,
      },
      {
        senderName: "Spam Bot",
        senderEmail: "no-reply@spammy.com",
        recipientEmail: "hello@krisluxeco.com",
        subject: "Increase your SEO rankings!",
        body: "Click here to buy our SEO package and rank #1 on Google guaranteed!!!",
        folder: "trash",
        isRead: true,
      },
      {
        senderName: "KrisluxECO Admin",
        senderEmail: "hello@krisluxeco.com",
        recipientEmail: "john.doe@example.com",
        subject: "Re: Bulk Order Inquiry",
        body: "Hi John,\n\nThank you for reaching out! I have attached our wholesale catalog to this email. Let me know if you have any questions.\n\nBest,\nKrisluxECO Team",
        folder: "sent",
        isRead: true,
      }
    ];

    await Email.insertMany(dummyEmails);
    console.log("Seeded 4 dummy emails successfully.");

  } catch (error) {
    console.error("Error seeding emails:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
