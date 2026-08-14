import connectDb from "@/lib/db";
import { Catalog } from "@/models/catalog.model";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    await connectDb();
    const formData = await req.formData();
    
    const shopName = formData.get("shopName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const file = formData.get("file"); // The PDF file

    if (!shopName || !email || !phone || !file) {
      return NextResponse.json(
        { message: "All fields are required (shopName, email, phone, file)." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create unique filename
    const originalName = file.name && file.name !== "blob" ? file.name : "catalog.pdf";
    const ext = originalName.split('.').pop().toLowerCase();
    const baseName = originalName.replace(`.${ext}`, '').replace(/[^a-zA-Z0-9]/g, '_') || 'upload';
    const fileName = `${baseName}_${Date.now()}.${ext}`;

    // Define the upload path (public/uploads/catalogs)
    const uploadDir = path.join(process.cwd(), "public", "uploads", "catalogs");
    const filePath = path.join(uploadDir, fileName);

    // Ensure directory exists and write file
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    const pdfUrl = `/uploads/catalogs/${fileName}`;

    const newCatalog = await Catalog.create({
      shopName,
      email,
      phone,
      pdfUrl,
    });

    return NextResponse.json(
      { message: "Catalog uploaded successfully.", catalog: newCatalog },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDb();

    const catalogs = await Catalog.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ catalogs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
  }
}
