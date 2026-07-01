import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Blog from "@/models/blog.model";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "You are Not Admin" }, { status: 400 });
    }

    const { id } = await params;
    const data = await req.json();

    if (data.title && !data.slug) {
       data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, data, { new: true });
    
    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog updated successfully", blog: updatedBlog }, { status: 200 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "You are Not Admin" }, { status: 400 });
    }

    const { id } = await params;
    
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "You are Not Admin" }, { status: 400 });
    }

    const { id } = await params;
    
    const blog = await Blog.findById(id).lean();
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
  }
}
