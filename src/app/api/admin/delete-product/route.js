import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectDb();

    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "You are Not Admin" },
        { status: 400 },
      );
    }

    // accept id either from JSON body { id } or as a query param ?id=
    let id;
    try {
      const body = await req.json();
      id = body?.id;
    } catch {
      id = null;
    }
    if (!id) {
      const { searchParams } = new URL(req.url);
      id = searchParams.get("id");
    }

    if (!id) {
      return NextResponse.json(
        { message: "Product id is required" },
        { status: 400 },
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // note: uploadOnCloudinary currently only returns secure_url (no public_id
    // saved), so we can't ask cloudinary to delete the image here. If you want
    // full cleanup on delete, update uploadOnCloudinary to also resolve
    // result?.public_id and store it on each image, then destroy it here with
    // cloudinary.uploader.destroy(publicId).

    await Product.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Delete Product error: ${error}` },
      { status: 500 },
    );
  }
}
