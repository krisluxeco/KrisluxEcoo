import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import ProductsListClient from "@/components/ProductsListClient";
import { auth } from "@/auth";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shop Water Hyacinth Baskets, Planters, Trays & Eco Décor",
  description:
    "Browse handmade water hyacinth storage baskets, laundry baskets, planters, trays, hotel décor and gift hampers — woven by women artisans in Bihar. Bulk pricing, custom designs and delivery across India.",
  path: "/user/products",
  keywords: ["buy water hyacinth basket online", "water hyacinth storage basket", "water hyacinth planter", "handmade baskets online India"],
});

export const revalidate = 60;

import ProductsLoading from "./loading";

async function ProductListSection() {
  await connectDb();
  const savedProductIds = [];
  const products = await Product.find({ status: { $ne: "draft" } }).sort({ createdAt: -1 }).lean();
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
