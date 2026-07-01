import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import ProductsDashboardClient from "@/components/admin/ProductsDashboardClient";

export default async function AdminProductsPage() {
  await connectDb();

  // Fetch initial list of products
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  // Serialize Mongoose Documents/Objects for Next.js Server-to-Client boundaries
  const serializedProducts = JSON.parse(JSON.stringify(products));

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8">
      <ProductsDashboardClient initialProducts={serializedProducts} />
    </div>
  );
}
