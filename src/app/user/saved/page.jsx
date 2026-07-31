"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Package, Loader2, ArrowLeft } from "lucide-react";
import { StorefrontProductCard } from "@/components/ProductsListClient";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

export default function SavedProductsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated") {
      fetchSavedProducts();
    }
  }, [status, router]);

  const fetchSavedProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/saved-products");
      const data = await res.json();
      if (res.ok) {
        setSavedProducts(data.savedProducts || []);
      } else {
        setError(data.message || "Failed to load saved products");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred fetching your saved products");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = (productId) => {
    // Instantly remove from UI list when unhearted
    setSavedProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#4A6741] h-8 w-8 stroke-[1.5]" />
          <p className="text-xs text-[#9E9088] uppercase tracking-widest" style={{ fontFamily: sans }}>
            Loading Saved Products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1C1C1A] pb-24 pt-28" style={{ fontFamily: sans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <div className="max-w-7xl mx-auto px-6">
        {/* Back navigation */}
        <Link
          href="/user/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B6560] hover:text-[#4A6741] transition mb-6"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>

        <div className="text-center mb-10">
          <h1
            className="text-4xl font-light text-center mb-2 text-[#1C1C1A]"
            style={{ fontFamily: serif }}
          >
            Saved <span className="italic text-[#4A6741]">Products</span>
          </h1>
          <div className="h-[2px] w-14 bg-[#C8A97A] mx-auto mt-3" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs font-semibold tracking-wide mb-6">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {savedProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl border border-[#ECE6DF] p-16 text-center shadow-[0_4px_24px_rgba(28,28,26,0.02)] max-w-xl mx-auto"
            >
              <Heart size={48} className="mx-auto text-[#9E9088] mb-4 stroke-1 fill-[#FAF7F2]" />
              <h3 className="text-xl font-medium text-[#1C1C1A]" style={{ fontFamily: serif }}>
                Your saved items are empty
              </h3>
              <p className="text-sm text-[#9E9088] mt-2 font-light leading-relaxed">
                Save your favorite sustainable handcrafted products to easily request bulk quotes later.
              </p>
              <Link
                href="/user/products"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#4A6741] text-white px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#3a5233] transition shadow-sm"
              >
                Explore Products
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {savedProducts.map((product) => (
                <StorefrontProductCard
                  key={product._id}
                  product={product}
                  isLiked={true}
                  onToggleSaved={(id, isSaved) => {
                    if (!isSaved) handleRemoveSaved(id);
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
