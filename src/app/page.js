import Home from '@/components/Home';
import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import { auth } from "@/auth";
import React from 'react';

const page = async () => {
  await connectDb();

  // Fetch session to determine saved products
  const session = await auth();
  let savedProductIds = [];
  
  if (session?.user?.id) {
    const user = await User.findById(session.user.id).select("savedProducts").lean();
    if (user && user.savedProducts) {
      savedProductIds = user.savedProducts.map((id) => id.toString());
    }
  }

  // Fetch active products to show in the featured slider (up to 8 products)
  const products = await Product.find({ status: "active" })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  const serializedProducts = JSON.parse(JSON.stringify(products));

  return (
    <>
      <Home
        featuredProducts={serializedProducts}
        savedProductIds={savedProductIds}
      />
    </>
  );
};

export default page;