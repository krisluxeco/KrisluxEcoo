import Home from '@/components/Home';
import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import { auth } from "@/auth";
import Quote from "@/models/quote.model";
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

  // ─── Calculate Environmental Impact from DB ──────────────────────────────────
  // Fetch all quotes except rejected ones so impact updates immediately upon request
  const quotes = await Quote.find({ status: { $ne: "Rejected" } }).lean();
  
  let totalProductsOrdered = 0;
  quotes.forEach(quote => {
    quote.items.forEach(item => {
      totalProductsOrdered += item.quantity || 0;
    });
  });

  // If there are no orders yet (brand new DB), set a baseline so the UI isn't completely empty.
  // You can remove this baseline once you have a few real orders.
  const baselineOffset = 500; 
  const effectiveProductCount = totalProductsOrdered + baselineOffset;

  // Impact Formula (Example: 1 product = 1.2kg Methane prevented, 0.8kg CO2 offset, 0.1 SQM restored)
  const impactStats = {
    methanePrevented: effectiveProductCount * 1.2,
    co2Offset: effectiveProductCount * 0.8,
    wetlandRestored: effectiveProductCount * 0.1,
  };

  // Detailed Stats
  const detailedStats = {
    hyacinthRemovedTons: (effectiveProductCount * 16.4) / 1000,
    plasticReplacedTons: (effectiveProductCount * 9) / 1000,
    waterBodiesCleaned: Math.floor(effectiveProductCount / 30) + 4, // base +4
    equivalentTrees: Math.floor(effectiveProductCount * 1.3),
    ruralWomenEmployed: Math.floor(effectiveProductCount / 10) + 4, // base +4
  };

  // Recent Impact Feed
  // Sort quotes by createdAt desc to get newest first
  quotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentItems = [];
  for (const quote of quotes) {
    if (recentItems.length >= 3) break;
    for (const item of quote.items) {
      if (recentItems.length >= 3) break;
      recentItems.push({
        name: item.productName,
        co2: (item.quantity * 0.8).toFixed(1)
      });
    }
  }

  // If DB is mostly empty, add placeholder recent items for the UI
  if (recentItems.length === 0) {
    recentItems.push(
      { name: "Basket Sold", co2: "2.1" },
      { name: "Lamp Sold", co2: "1.8" },
      { name: "Tray Sold", co2: "3.2" }
    );
  }

  return (
    <>
      <Home
        featuredProducts={serializedProducts}
        savedProductIds={savedProductIds}
        impactStats={impactStats}
        detailedStats={detailedStats}
        recentItems={recentItems}
      />
    </>
  );
};

export default page;