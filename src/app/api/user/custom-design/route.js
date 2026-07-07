import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import CustomDesign from "@/models/customDesign.model";
import uploadOnCloudinary from "@/lib/cloudinary";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await CustomDesign.find({ email: session.user.email }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user custom designs:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDb();
    const formData = await req.formData();
    
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone") || "";
    const description = formData.get("description");
    const imageFile = formData.get("image");

    if (!name || !email || !description) {
      return NextResponse.json(
        { error: "Name, email, and description are required" },
        { status: 400 }
      );
    }

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      console.log("Image file found, uploading to cloudinary...");
      try {
        imageUrl = await uploadOnCloudinary(imageFile);
        console.log("Cloudinary upload successful, URL:", imageUrl);
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
      }
    } else {
      console.log("No image file provided or size is 0");
    }

    const newRequest = await CustomDesign.create({
      name,
      email,
      phone,
      description,
      imageUrl: imageUrl || "",
    });

    return NextResponse.json(
      { message: "Custom design request submitted successfully!", data: newRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating custom design request:", error);
    return NextResponse.json(
      { error: "Failed to submit request." },
      { status: 500 }
    );
  }
}
