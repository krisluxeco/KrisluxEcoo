import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import uploadOnCloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    await connectDb();

    const user = await User.findById(session.user.id).lean();
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile || "",
          image: user.image || "",
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error fetching profile: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    await connectDb();

    const formData = await req.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const mobile = formData.get("mobile") || "";
    const imageFile = formData.get("image"); // can be File or String URL

    if (!firstName || !lastName) {
      return NextResponse.json(
        { message: "First name and last name are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.mobile = mobile;

    // Handle image file upload if it's a file
    if (imageFile && typeof imageFile !== "string") {
      try {
        const imageUrl = await uploadOnCloudinary(imageFile);
        if (imageUrl) {
          user.image = imageUrl;
        }
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return NextResponse.json(
          { message: "Image upload failed. Please try again." },
          { status: 500 }
        );
      }
    } else if (typeof imageFile === "string") {
      user.image = imageFile;
    }

    await user.save();

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
          image: user.image,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error updating profile: ${error.message}` },
      { status: 500 }
    );
  }
}
