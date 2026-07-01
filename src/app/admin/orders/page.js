"use client";

import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle, Pencil, Trash2, PackageX } from "lucide-react";
import Link from "next/link";

const serif = "'Cormorant Garamond', Georgia, serif";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");

  const fetchProducts = async (pageNum = 1, query = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/admin/get-product?page=${pageNum}&search=${encodeURIComponent(query)}`,
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to load products");

      setProducts(data.products || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(1, search);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1
            className="text-2xl font-semibold text-[#1C1C1A]"
            style={{ fontFamily: serif }}
          >
            Products
          </h1>
          <p className="text-sm text-[#9E9088]">
            All products currently listed in your store
          </p>
        </div>

        <Link
          href="/admin/products/add"
          className="inline-flex items-center justify-center rounded-full bg-[#4A6741] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#3a5233] transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, brand or SKU..."
          className="w-full sm:w-80 rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
        />
      </form>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-[#9E9088]">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading products...
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-[#9E9088]">
          <PackageX className="h-8 w-8 mb-2" />
          <p className="text-sm">No products found.</p>
        </div>
      )}

      {/* Table */}
      {!loading && products.length > 0 && (
        <div className="rounded-2xl border border-[#ECE6DF] bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF7F2] text-[#9E9088] text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE6DF]">
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-[#FAF7F2]/60 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]?.url}
                        alt={p.name}
                        className="h-10 w-10 rounded-lg object-cover border border-[#ECE6DF]"
                      />
                      <div>
                        <p className="font-medium text-[#1C1C1A]">{p.name}</p>
                        {p.brand && (
                          <p className="text-xs text-[#9E9088]">{p.brand}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#1C1C1A]">{p.category}</td>
                  <td className="px-4 py-3">
                    <span className="text-[#1C1C1A] font-medium">
                      ₹{p.discountPrice || p.price}
                    </span>
                    {p.discountPrice && (
                      <span className="ml-1.5 text-xs text-[#9E9088] line-through">
                        ₹{p.price}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#1C1C1A]">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        p.status === "active"
                          ? "bg-[#8FBD84]/15 text-[#2F4A28]"
                          : p.status === "out_of_stock"
                            ? "bg-red-50 text-red-600"
                            : "bg-[#ECE6DF] text-[#9E9088]"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/edit/${p._id}`}
                        className="rounded-lg p-1.5 text-[#9E9088] hover:text-[#4A6741] hover:bg-[#4A6741]/5 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-[#9E9088] hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-xs text-[#9E9088]">
            Page {pagination.page} of {pagination.totalPages} (
            {pagination.total} products)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-[#E8DDD0] px-3 py-1.5 text-xs disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-[#E8DDD0] px-3 py-1.5 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
