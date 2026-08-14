import connectDb from "@/lib/db";
import { Catalog } from "@/models/catalog.model";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDb();
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ message: "Status is required." }, { status: 400 });
    }

    const updatedCatalog = await Catalog.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedCatalog) {
      return NextResponse.json({ message: "Catalog not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Status updated successfully.", catalog: updatedCatalog },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDb();
    const { id } = await params;

    const deletedCatalog = await Catalog.findByIdAndDelete(id);

    if (!deletedCatalog) {
      return NextResponse.json({ message: "Catalog not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Catalog deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
  }
}
