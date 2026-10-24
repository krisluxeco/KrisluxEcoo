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

export const revalidate = 60;

import ProductsLoading from "./loading";

async function ProductListSection() {
  await connectDb();
  const savedProductIds = [];
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  const serializedProducts = JSON.parse(JSON.stringify(products));

  return (
    <ProductsListClient
      initialProducts={serializedProducts}
      savedProductIds={savedProductIds}
    />
  );
}

export default function UserProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductListSection />
    </Suspense>
  );
}
