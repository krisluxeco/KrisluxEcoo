"use client";
import Image from "next/image";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Filter,
  ArrowUpDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Package,
  Eye,
  AlertTriangle,
} from "lucide-react";
import ProductForm from "./ProductForm";

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

export default function ProductsDashboardClient({ initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [activeTab, setActiveTab] = useState("list"); // "list" | "add"
  const [editingProduct, setEditingProduct] = useState(null);

  const dynamicCategories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(cats);
  }, [products]);

  const filterCategories = ["All Categories", ...dynamicCategories];

  // Search & Filter States
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("all"); // "all" | "in_stock" | "low_stock" | "out_of_stock"
  const [sortKey, setSortKey] = useState("newest"); // "newest" | "price_asc" | "price_desc" | "stock_asc" | "stock_desc"

  // Action feedback states
  const [submittingId, setSubmittingId] = useState(null); // for tracking delete loadings
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const showFeedback = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  // Add / Edit callbacks
  const handleAddSuccess = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setActiveTab("list");
    showFeedback("Product added successfully!");
  };

  const handleUpdateSuccess = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    setEditingProduct(null);
    showFeedback("Product updated successfully!");
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setSubmittingId(id);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/admin/delete-product?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p._id !== id));
      showFeedback("Product deleted successfully!");
    } catch (err) {
      showFeedback(err.message || "Failed to delete product", true);
    } finally {
      setSubmittingId(null);
    }
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand?.toLowerCase().includes(search.toLowerCase()) ||
          p.sku?.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          categoryFilter === "All Categories" || p.category === categoryFilter;

        const matchesStock =
          stockFilter === "all" ||
          (stockFilter === "in_stock" && p.stock > 10) ||
          (stockFilter === "low_stock" && p.stock > 0 && p.stock <= 10) ||
          (stockFilter === "out_of_stock" && p.stock === 0);

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortKey === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortKey === "price_asc") {
          const pA = a.discountPrice ?? a.price;
          const pB = b.discountPrice ?? b.price;
          return pA - pB;
        }
        if (sortKey === "price_desc") {
          const pA = a.discountPrice ?? a.price;
          const pB = b.discountPrice ?? b.price;
          return pB - pA;
        }
        if (sortKey === "stock_asc") {
          return a.stock - b.stock;
        }
        if (sortKey === "stock_desc") {
          return b.stock - a.stock;
        }
        return 0;
      });
  }, [products, search, categoryFilter, stockFilter, sortKey]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header and Toggle Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-semibold text-[#1C1C1A]"
            style={{ fontFamily: serif }}
          >
            {editingProduct
              ? "Edit Product"
              : activeTab === "add"
              ? "Add Product"
              : "Products Inventory"}
          </h1>
          <p className="text-sm text-[#9E9088]">
            {editingProduct
              ? `Modify details for ${editingProduct.name}`
              : activeTab === "add"
              ? "Create and publish a new product collection"
              : "Manage and update your active sustainable catalog"}
          </p>
        </div>

        <div className="flex gap-2">
          {editingProduct ? (
            <button
              onClick={() => setEditingProduct(null)}
              className="inline-flex items-center gap-2 rounded-full border border-[#E8DDD0] bg-white px-5 py-2.5 text-sm font-medium text-[#1C1C1A] hover:bg-[#FAF7F2] transition"
            >
              Back to Catalog
            </button>
          ) : (
            <button
              onClick={() => {
                setActiveTab(activeTab === "list" ? "add" : "list");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#4A6741] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#3a5233] transition shadow-sm"
            >
              {activeTab === "list" ? (
                <>
                  <Plus size={16} /> Add Product
                </>
              ) : (
                "View Catalog"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 rounded-xl border border-[#8FBD84]/40 bg-[#8FBD84]/10 px-4 py-3 text-sm text-[#2F4A28]"
          >
            <CheckCircle2 className="h-4 w-4 text-[#4A6741]" />
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error banner */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="h-4 w-4" />
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div>
        {editingProduct ? (
          <div className="bg-white rounded-2xl border border-[#ECE6DF] p-6 shadow-sm">
            <ProductForm
              mode="edit"
              initialData={editingProduct}
              existingCategories={dynamicCategories}
              onCancel={() => setEditingProduct(null)}
              onSuccess={handleUpdateSuccess}
            />
          </div>
        ) : activeTab === "add" ? (
          <div className="bg-white rounded-2xl border border-[#ECE6DF] p-6 shadow-sm">
            <ProductForm
              mode="add"
              existingCategories={dynamicCategories}
              onCancel={() => setActiveTab("list")}
              onSuccess={handleAddSuccess}
            />
          </div>
        ) : (
          /* Product Catalog View */
          <div className="space-y-4">
            {/* Search and Filter Panel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-[#ECE6DF] shadow-sm">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E9088]"
                />
                <input
                  type="text"
                  placeholder="Search by product name, brand or SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition text-[#1C1C1A]"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition text-[#1C1C1A] font-medium"
                >
                  {filterCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sorting Filter */}
              <div>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition text-[#1C1C1A] font-medium"
                >
                  <option value="newest">Newest Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="stock_desc">Stock: High to Low</option>
                  <option value="stock_asc">Stock: Low to High</option>
                </select>
              </div>
            </div>

            {/* Quick Stock Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All Stock Statuses", value: "all" },
                { label: "Healthy Stock (> 10)", value: "in_stock" },
                { label: "Low Stock (1 - 10)", value: "low_stock" },
                { label: "Out of Stock (0)", value: "out_of_stock" },
              ].map((pill) => {
                const active = stockFilter === pill.value;
                return (
                  <button
                    key={pill.value}
                    onClick={() => setStockFilter(pill.value)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium border transition ${
                      active
                        ? "bg-[#4A6741] text-white border-[#4A6741]"
                        : "bg-white border-[#E8DDD0] text-[#6B6560] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Products Table/Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#ECE6DF] p-12 text-center shadow-sm">
                <Package size={48} className="mx-auto text-[#9E9088] mb-3" />
                <h3
                  className="text-lg font-medium text-[#1C1C1A]"
                  style={{ fontFamily: serif }}
                >
                  No products found
                </h3>
                <p className="text-sm text-[#9E9088] mt-1 max-w-sm mx-auto">
                  Try adjusting your search query, selecting another category, or list a new product.
                </p>
                {(search || categoryFilter !== "All Categories" || stockFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategoryFilter("All Categories");
                      setStockFilter("all");
                    }}
                    className="mt-4 text-xs font-medium text-[#4A6741] hover:underline"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#ECE6DF] overflow-hidden shadow-sm">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#ECE6DF] bg-[#FAF7F2]/60 text-xs font-semibold uppercase tracking-wider text-[#6B6560]">
                        <th className="py-4 px-6 w-[80px]">Image</th>
                        <th className="py-4 px-6">Product Details</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Price</th>
                        <th className="py-4 px-6">Stock Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ECE6DF] text-sm text-[#1C1C1A]">
                      {filteredProducts.map((product) => {
                        const hasDiscount = product.discountPrice !== null;
                        const coverImg = product.images?.[0]?.url || "";
                        const isLowStock = product.stock > 0 && product.stock <= 10;
                        const isOutOfStock = product.stock === 0;

                        return (
                          <tr
                            key={product._id}
                            className="hover:bg-[#FAF7F2]/30 transition-colors"
                          >
                            {/* Image */}
                            <td className="py-4 px-6">
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#ECE6DF] bg-[#FAF7F2]">
                                {coverImg ? (
                                  <Image width={800} height={800}
                                    src={coverImg}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#9E9088]">
                                    <Package size={18} />
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Details */}
                            <td className="py-4 px-6">
                              <div>
                                <h4
                                  className="font-medium text-[#1C1C1A] text-base"
                                  style={{ fontFamily: serif }}
                                >
                                  {product.name}
                                </h4>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-[#9E9088]">
                                  {product.brand && (
                                    <span>Brand: {product.brand}</span>
                                  )}
                                  {product.sku && (
                                    <span className="font-mono">
                                      SKU: {product.sku}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center rounded-full bg-[#4A6741]/8 text-[#4A6741] text-xs px-2.5 py-1 font-medium">
                                {product.category}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-4 px-6">
                              {hasDiscount ? (
                                <div className="flex flex-col">
                                  <span className="font-semibold text-[#1C1C1A]">
                                    ₹{product.discountPrice.toLocaleString()}
                                  </span>
                                  <span className="text-xs text-[#9E9088] line-through">
                                    ₹{product.price.toLocaleString()}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-semibold text-[#1C1C1A]">
                                  ₹{product.price.toLocaleString()}
                                </span>
                              )}
                            </td>

                            {/* Stock */}
                            <td className="py-4 px-6">
                              {isOutOfStock ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 text-xs px-2.5 py-1 font-medium border border-red-200">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                                  Out of Stock (0)
                                </span>
                              ) : isLowStock ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 text-xs px-2.5 py-1 font-medium border border-amber-200 animate-pulse">
                                  <AlertTriangle size={12} className="text-amber-600" />
                                  Low Stock ({product.stock})
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 font-medium border border-emerald-200">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                  Active ({product.stock})
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingProduct(product)}
                                  className="p-2 rounded-lg border border-[#E8DDD0] hover:bg-[#FAF7F2] text-[#6B6560] hover:text-[#4A6741] transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button
                                  disabled={submittingId === product._id}
                                  onClick={() => handleDelete(product._id)}
                                  className="p-2 rounded-lg border border-[#E8DDD0] hover:border-red-200 hover:bg-red-50 text-[#6B6560] hover:text-red-600 transition-colors disabled:opacity-50"
                                  title="Delete Product"
                                >
                                  {submittingId === product._id ? (
                                    <Loader2 size={15} className="animate-spin" />
                                  ) : (
                                    <Trash2 size={15} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Catalog Cards Grid */}
                <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                  {filteredProducts.map((product) => {
                    const hasDiscount = product.discountPrice !== null;
                    const coverImg = product.images?.[0]?.url || "";
                    const isLowStock = product.stock > 0 && product.stock <= 10;
                    const isOutOfStock = product.stock === 0;

                    return (
                      <div
                        key={product._id}
                        className="rounded-xl border border-[#ECE6DF] bg-[#FAF7F2]/20 p-4 space-y-4 hover:border-[#4A6741]/40 transition"
                      >
                        <div className="flex gap-3">
                          <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-[#ECE6DF] bg-[#FAF7F2]">
                            {coverImg ? (
                              <Image width={800} height={800}
                                src={coverImg}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#9E9088]">
                                <Package size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] uppercase font-semibold text-[#4A6741]">
                              {product.category}
                            </span>
                            <h4
                              className="font-medium text-[#1C1C1A] text-base truncate"
                              style={{ fontFamily: serif }}
                            >
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {hasDiscount ? (
                                <>
                                  <span className="font-semibold text-sm text-[#1C1C1A]">
                                    ₹{product.discountPrice.toLocaleString()}
                                  </span>
                                  <span className="text-xs text-[#9E9088] line-through">
                                    ₹{product.price.toLocaleString()}
                                  </span>
                                </>
                              ) : (
                                <span className="font-semibold text-sm text-[#1C1C1A]">
                                  ₹{product.price.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#ECE6DF] text-xs">
                          <div>
                            {isOutOfStock ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 px-2 py-0.5 font-medium border border-red-200">
                                Out of Stock
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 px-2 py-0.5 font-medium border border-amber-200">
                                Low Stock ({product.stock})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 font-medium border border-emerald-200">
                                Active Stock ({product.stock})
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E8DDD0] hover:bg-[#FAF7F2] text-[#6B6560] font-medium"
                            >
                              <Edit2 size={12} /> Edit
                            </button>
                            <button
                              disabled={submittingId === product._id}
                              onClick={() => handleDelete(product._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E8DDD0] hover:border-red-200 hover:bg-red-50 hover:text-red-600 text-[#6B6560] font-medium disabled:opacity-50"
                            >
                              {submittingId === product._id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Trash2 size={12} />
                              )}{" "}
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
