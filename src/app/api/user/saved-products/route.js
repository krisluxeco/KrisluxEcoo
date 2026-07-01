import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Product from "@/models/product.model"; // required for population
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

    const user = await User.findById(session.user.id)
      .populate("savedProducts")
      .lean();

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Filter out null products in case any saved product has been deleted from the database
    const validSavedProducts = (user.savedProducts || []).filter((p) => p !== null);

    return NextResponse.json(
      { savedProducts: validSavedProducts },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error fetching saved products: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectDb();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.savedProducts) {
      user.savedProducts = [];
    }

    // Convert ObjectIds to strings to perform a reliable lookup matching standard string productId
    const index = user.savedProducts.findIndex((id) => id.toString() === productId);
    let saved = false;

    if (index > -1) {
      user.savedProducts.splice(index, 1);
      saved = false;
    } else {
      user.savedProducts.push(productId);
      saved = true;
    }

    await user.save();

    return NextResponse.json(
      {
        saved,
        savedProducts: user.savedProducts,
        message: saved ? "Product saved successfully" : "Product removed from saved items",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error toggling saved product: ${error.message}` },
      { status: 500 }
    );
  }
}
