"use client";

import React, { useState, useEffect } from "react";
import { Star, Trash2, MessageSquare, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-3xl font-semibold text-[#1C1C1A] mb-1"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Customer Reviews
        </h1>
        <p className="text-sm text-[#9E9088]">
          Monitor and manage product feedback from customers.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#ECE6DF] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#6B6560]">
            <thead className="bg-[#FAF7F2] text-[#9E9088] font-medium uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Reviewer</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE6DF]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#9E9088]">
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#9E9088]">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#1C1C1A]">
                      {review.userName}
                    </td>
                    <td className="px-6 py-4">
                      {review.productId ? (
                        <div className="flex items-center gap-2">
                          <Link href={`/user/products/${review.productId._id}`} className="text-[#4A6741] hover:underline font-medium flex items-center gap-1">
                            {review.productId.name}
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      ) : (
                        <span className="text-red-500 text-xs">Product Deleted</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: review.rating }).map((_, r) => (
                          <Star key={r} size={14} className="fill-amber-500 stroke-none" />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={review.comment}>
                      <span className="italic">"{review.comment}"</span>
                    </td>
                    <td className="px-6 py-4 text-xs whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
