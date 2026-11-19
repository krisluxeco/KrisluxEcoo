import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import ProductDetailClient from "@/components/ProductDetailClient";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import Review from "@/models/review.model";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd, absoluteUrl, SITE_URL } from "@/lib/seo";

const loadProduct = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  await connectDb();
  const p = await Product.findById(id).lean();
  return p && p.status !== "draft" ? p : null; // drafts are never public
};

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const product = await loadProduct(id);
    if (!product) return { title: "Product not found", robots: { index: false } };
    const desc = (product.description || "").replace(/\s+/g, " ").trim();
    return pageMetadata({
      title: `${product.name} — Handmade ${product.category}`,
      description:
        desc.length > 40
          ? desc.slice(0, 155)
          : `${product.name}: handmade water hyacinth ${product.category?.toLowerCase()} by women artisans in Bihar. Bulk orders and delivery across India.`,
      path: `/user/products/${id}`,
      keywords: [product.name, product.category, ...(product.tags || [])],
      image: product.images?.[0]?.url,
    });
  } catch {
    return { title: "Product" };
  }
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }) {
  await connectDb();

  let product = null;
  let similarProducts = [];
  let savedProductIds = [];
  let isLiked = false;

  try {
    const { id } = await params;
    product = await loadProduct(id);

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
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }

  // Real 404 status (not a "soft 404") so search engines drop removed products
  if (!product) notFound();

  // Serialize Mongoose docs for server-to-client boundary
  const serializedProduct = JSON.parse(JSON.stringify(product));
  const serializedSimilar = JSON.parse(JSON.stringify(similarProducts));

  // Structured data — must match what is visible on the page
  let rating = null;
  try {
    const agg = await Review.aggregate([
      { $match: { productId: product._id, status: "approved" } },
      { $group: { _id: null, avg: { $avg: "$rating" }, n: { $sum: 1 } } },
    ]);
    if (agg[0]?.n) rating = { avg: Math.round(agg[0].avg * 10) / 10, n: agg[0].n };
  } catch {
    /* rating is optional */
  }
  const url = absoluteUrl(`/user/products/${product._id}`);
  const price = product.discountPrice ?? product.price;
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    image: (product.images || []).map((im) => (im.url?.startsWith("http") ? im.url : absoluteUrl(im.url))),
    sku: product.sku || String(product._id),
    category: product.category,
    material: "Water hyacinth",
    brand: { "@type": "Brand", name: product.brand || "KrisluxECO" },
    manufacturer: { "@id": `${SITE_URL}/#organization` },
    countryOfOrigin: "IN",
    ...(product.tags?.length ? { keywords: product.tags.join(", ") } : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: Number(price).toFixed(2),
      availability:
        product.status === "out_of_stock" || product.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}/#organization` },
      eligibleQuantity: { "@type": "QuantitativeValue", minValue: product.minOrderQty || 1 },
      areaServed: { "@type": "Country", name: "India" },
    },
    ...(rating
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: rating.avg, reviewCount: rating.n, bestRating: 5, worstRating: 1 } }
      : {}),
  };

  return (
    <>
    <JsonLd
      data={[
        productLd,
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/user/products" },
          { name: product.name, path: `/user/products/${product._id}` },
        ]),
      ]}
    />
    <ProductDetailClient
      product={serializedProduct}
      similarProducts={serializedSimilar}
      isLiked={isLiked}
      savedProductIds={savedProductIds}
    />
    </>
  );
}
