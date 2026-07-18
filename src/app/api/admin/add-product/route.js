import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "You are Not Admin" },
        { status: 400 },
      );
    }

    const formData = await req.formData();

    const name = formData.get("name");
    const brand = formData.get("brand") || "";
    const category = formData.get("category");
    const description = formData.get("description");
    const price = formData.get("price");
    const discountPrice = formData.get("discountPrice");
    const stock = formData.get("stock");
    const sku = formData.get("sku") || undefined;
    const minOrderQty = formData.get("minOrderQty");
    const weight = formData.get("weight");
    const length = formData.get("length");
    const width = formData.get("width");
    const height = formData.get("height");

    // tags & specs arrive as JSON strings (append them with
    // formData.append("tags", JSON.stringify(tags)) on the client)
    const tags = formData.get("tags") ? JSON.parse(formData.get("tags")) : [];
    const specs = formData.get("specs")
      ? JSON.parse(formData.get("specs"))
      : [];
    const highlights = formData.get("highlights")
      ? JSON.parse(formData.get("highlights"))
      : [];

    if (!name || !category || !description || !price) {
      return NextResponse.json(
        { message: "Name, category, description and price are required" },
        { status: 400 },
      );
    }

    const parsedPrice = parseFloat(price);
    const parsedDiscountPrice = (discountPrice && discountPrice !== "") ? parseFloat(discountPrice) : null;
    const parsedStock = (stock && stock !== "") ? parseInt(stock, 10) : 0;
    const parsedMinOrderQty = (minOrderQty && minOrderQty !== "") ? parseInt(minOrderQty, 10) : 1;
    const parsedWeight = (weight && weight !== "") ? parseFloat(weight) : null;
    const parsedLength = (length && length !== "") ? parseFloat(length) : null;
    const parsedWidth = (width && width !== "") ? parseFloat(width) : null;
    const parsedHeight = (height && height !== "") ? parseFloat(height) : null;

    // client should append every file under the same key: "images"
    const files = formData.getAll("images").filter((f) => f && f.size > 0);

    if (!files.length) {
      return NextResponse.json(
        { message: "At least one product image is required" },
        { status: 400 },
      );
    }

    if (files.length > 6) {
      return NextResponse.json(
        { message: "You can upload a maximum of 6 images" },
        { status: 400 },
      );
    }

    const uploadedImages = [];
    for (const file of files) {
      const url = await uploadOnCloudinary(file);
      if (!url) {
        return NextResponse.json(
          { message: "Image upload failed" },
          { status: 500 },
        );
      }
      // your uploadOnCloudinary only returns secure_url right now, so there's
      // no publicId to store — see note below if you want cloudinary cleanup
      // to work properly on delete
      uploadedImages.push({ url });
    }

    const product = await Product.create({
      name,
      brand,
      category,
      description,
      images: uploadedImages,
      price: parsedPrice,
      discountPrice: parsedDiscountPrice,
      stock: parsedStock,
      sku: sku || undefined,
      minOrderQty: parsedMinOrderQty,
      weight: parsedWeight,
      length: parsedLength,
      width: parsedWidth,
      height: parsedHeight,
      tags,
      specs: specs.filter((s) => s.key?.trim() && s.value?.trim()),
      highlights,
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Add Product error: ${error}` },
      { status: 500 },
    );
  }
}
