import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import ProductsListClient from "@/components/ProductsListClient";
import { auth } from "@/auth";
import { Suspense } from "react";

export const metadata = {
  title: "Shop Sustainable Handcrafted Products | KrisluxEco",
  description: "Browse our premium eco-friendly collection, handcrafted by traditional artisan partners using natural, sustainable materials.",
};

export default async function UserProductsPage() {
  await connectDb();

  // Fetch user session to determine saved products
  const session = await auth();
  let savedProductIds = [];
  
  if (session?.user?.id) {
    const user = await User.findById(session.user.id).select("savedProducts").lean();
    if (user && user.savedProducts) {
      savedProductIds = user.savedProducts.map((id) => id.toString());
    }
  }

  // Fetch all listed products
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  // Serialize Mongoose models for dynamic client rendering
  const serializedProducts = JSON.parse(JSON.stringify(products));

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-[#4A6741]">Loading...</div>}>
      <ProductsListClient
        initialProducts={serializedProducts}
        savedProductIds={savedProductIds}
      />
    </Suspense>
  );
}
