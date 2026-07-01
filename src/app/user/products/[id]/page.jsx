import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import ProductDetailClient from "@/components/ProductDetailClient";
import Link from "next/link";
import { Package, ChevronLeft } from "lucide-react";
import { auth } from "@/auth";

export async function generateMetadata({ params }) {
  await connectDb();
  try {
    const { id } = await params;
    const product = await Product.findById(id).lean();
    if (!product) return { title: "Product Not Found | KrisluxEco" };
    return {
      title: `${product.name} | KrisluxEco`,
      description: product.description.substring(0, 160),
    };
  } catch {
    return { title: "Product | KrisluxEco" };
  }
}

export default async function ProductDetailPage({ params }) {
  await connectDb();

  let product = null;
  let similarProducts = [];
  let savedProductIds = [];
  let isLiked = false;

  try {
    const { id } = await params;
    product = await Product.findById(id).lean();

    if (product) {
      // Find similar products in the same category, excluding current product
      similarProducts = await Product.find({
        category: product.category,
        _id: { $ne: product._id },
      })
        .limit(4)
        .lean();

      // Fallback: If no products in the same category, show any other products
      if (similarProducts.length === 0) {
        similarProducts = await Product.find({
          _id: { $ne: product._id }
        })
          .limit(4)
          .lean();
      }

      // Check if product is saved by the logged-in user
      const session = await auth();
      if (session?.user?.id) {
        const user = await User.findById(session.user.id).select("savedProducts").lean();
        if (user && user.savedProducts) {
          savedProductIds = user.savedProducts.map((id) => id.toString());
          isLiked = savedProductIds.includes(product._id.toString());
        }
      }
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }

  // Gracefully handle if product not found
  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#FAF7F2] flex flex-col items-center justify-center text-center px-6">
        <Package size={48} className="text-[#9E9088] mb-4" />
        <h2
          className="text-3xl font-semibold text-[#1C1C1A]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Product Not Found
        </h2>
        <p className="text-[#9E9088] text-sm mt-1 max-w-sm font-light">
          The product collection you are looking for does not exist or has been removed from our active catalog.
        </p>
        <Link
          href="/user/products"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#4A6741] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#3a5233] transition shadow-sm"
        >
          <ChevronLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  // Serialize Mongoose docs for server-to-client boundary
  const serializedProduct = JSON.parse(JSON.stringify(product));
  const serializedSimilar = JSON.parse(JSON.stringify(similarProducts));

  return (
    <ProductDetailClient
      product={serializedProduct}
      similarProducts={serializedSimilar}
      isLiked={isLiked}
      savedProductIds={savedProductIds}
    />
  );
}
