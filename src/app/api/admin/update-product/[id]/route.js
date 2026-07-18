import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDb();

    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "You are Not Admin" },
        { status: 400 },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Product id is required" },
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

    // parse JSON arrays
    const tags = formData.get("tags") ? JSON.parse(formData.get("tags")) : [];
    const specs = formData.get("specs") ? JSON.parse(formData.get("specs")) : [];
    const highlights = formData.get("highlights") ? JSON.parse(formData.get("highlights")) : [];
    const existingImages = formData.get("existingImages") ? JSON.parse(formData.get("existingImages")) : [];

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

    // handle newly uploaded files
    const files = formData.getAll("images").filter((f) => f && f.size > 0);

    const totalImagesCount = existingImages.length + files.length;

    if (totalImagesCount === 0) {
      return NextResponse.json(
        { message: "At least one product image is required" },
        { status: 400 },
      );
    }

    if (totalImagesCount > 6) {
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
      uploadedImages.push({ url });
    }

    // merge existing images with new ones
    const finalImages = [
      ...existingImages.map((url) => ({ url })),
      ...uploadedImages,
    ];

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        brand,
        category,
        description,
        images: finalImages,
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
      },
      { new: true },
    );

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Update Product error: ${error.message}` },
      { status: 500 },
    );
  }
}
