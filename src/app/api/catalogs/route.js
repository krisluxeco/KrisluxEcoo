import { requireAdmin } from "@/lib/adminAuth";
import connectDb from "@/lib/db";
import { Catalog } from "@/models/catalog.model";
import { NextResponse } from "next/server";
import uploadOnCloudinary from "@/lib/cloudinary";

const MAX_PDF_BYTES = 15 * 1024 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// POST is public on purpose: partners submit their catalog from /share-catalog.
export async function POST(req) {
  try {
    const formData = await req.formData();

    const fields = {
      organisationName: clean(formData.get("organisationName")),
      ownerName: clean(formData.get("ownerName")),
      location: clean(formData.get("location")),
      email: clean(formData.get("email"), 120).toLowerCase(),
      phone: clean(formData.get("phone"), 20),
      moq: clean(formData.get("moq"), 100),
      sustainableMaterial: clean(formData.get("sustainableMaterial")),
      productType: clean(formData.get("productType")),
      collaborationModel: clean(formData.get("collaborationModel")),
    };
    const file = formData.get("file");

    if (!fields.organisationName || !fields.ownerName || !fields.location || !fields.email || !fields.phone || !file || typeof file === "string") {
      return NextResponse.json(
        { message: "Organisation Name, Owner Name, Location, Email, Phone, and File are required." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(fields.email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }
    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json({ message: "The PDF must be smaller than 15 MB." }, { status: 400 });
    }

    // Only real PDFs: check the file signature, not just the name
    const head = Buffer.from(await file.slice(0, 5).arrayBuffer()).toString("latin1");
    if (head !== "%PDF-") {
      return NextResponse.json({ message: "Please upload your catalog as a PDF file." }, { status: 400 });
    }

    // Stored on Cloudinary — files written into /public at runtime are not served by Next.js
    const pdfUrl = await uploadOnCloudinary(
      new File([await file.arrayBuffer()], file.name && file.name !== "blob" ? file.name : "catalog.pdf", { type: "application/pdf" })
    );
    if (!pdfUrl) {
      return NextResponse.json({ message: "Upload failed. Please try again in a moment." }, { status: 502 });
    }

    await connectDb();
    await Catalog.create({ ...fields, pdfUrl });

    return NextResponse.json({ message: "Catalog uploaded successfully." }, { status: 201 });
  } catch (error) {
    console.error("Catalog upload error:", error);
    return NextResponse.json({ message: "Something went wrong. Please try again later." }, { status: 500 });
  }
}

export async function GET(req) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    await connectDb();

    const catalogs = await Catalog.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ catalogs }, { status: 200 });
  } catch (error) {
    console.error("Catalogs error:", error);
    return NextResponse.json({ message: "Failed to load catalogs" }, { status: 500 });
  }
}
