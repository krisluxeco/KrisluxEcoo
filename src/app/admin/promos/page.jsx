"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Percent, Check, X } from "lucide-react";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPromo, setNewPromo] = useState({ code: "", discountPercentage: "" });
  const [error, setError] = useState("");

  const fetchPromos = async () => {
    try {
      const res = await fetch("/api/admin/promos");
      if (res.ok) {
        const data = await res.json();
        setPromos(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newPromo.code,
          discountPercentage: Number(newPromo.discountPercentage),
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewPromo({ code: "", discountPercentage: "" });
        fetchPromos();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create promo");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/promos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) fetchPromos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this promo code?")) return;
    try {
      const res = await fetch(`/api/admin/promos/${id}`, { method: "DELETE" });
      if (res.ok) fetchPromos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-3xl font-semibold text-[#1C1C1A] mb-1"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Promo Codes
          </h1>
          <p className="text-sm text-[#9E9088]">
            Manage discount codes and special offers for customers.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-[#4A6741] hover:bg-[#3a5233] text-white px-5 py-2.5 rounded-full text-sm font-medium transition shadow-sm"
        >
          <Plus size={16} /> New Promo Code
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#ECE6DF] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#6B6560]">
            <thead className="bg-[#FAF7F2] text-[#9E9088] font-medium uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Promo Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE6DF]">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[#9E9088]">
                    Loading promos...
                  </td>
                </tr>
              ) : promos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[#9E9088]">
                    No promo codes found. Click "New Promo Code" to create one.
                  </td>
                </tr>
              ) : (
                promos.map((promo) => (
                  <tr key={promo._id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center border border-[#ECE6DF]">
                          <Percent size={14} className="text-[#C8A97A]" />
                        </div>
                        <span className="font-bold font-mono text-[#1C1C1A] text-[13px] tracking-wider bg-gray-100 px-2 py-0.5 rounded">
                          {promo.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#4A6741]">
                      {promo.discountPercentage}% OFF
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(promo._id, promo.isActive)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                          promo.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {promo.isActive ? <Check size={12} /> : <X size={12} />}
                        {promo.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(promo._id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete Promo"
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

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => {
                setShowAddModal(false);
                setError("");
              }}
              className="absolute top-4 right-4 text-[#9E9088] hover:text-[#1C1C1A] p-1.5 rounded-full hover:bg-[#FAF7F2] transition"
            >
              <X size={18} />
            </button>
            <h2 className="text-2xl font-semibold text-[#1C1C1A] mb-6" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              New Promo Code
            </h2>
            {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Code (e.g. ECOB2B)</label>
                <input
                  required
                  type="text"
                  value={newPromo.code}
                  onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                  placeholder="SUMMER20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Discount Percentage (%)</label>
                <input
                  required
                  type="number"
                  min="1"
                  max="100"
                  value={newPromo.discountPercentage}
                  onChange={(e) => setNewPromo({ ...newPromo, discountPercentage: e.target.value })}
                  className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                  placeholder="10"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#4A6741] hover:bg-[#3a5233] text-white py-3 rounded-xl text-sm font-bold tracking-wider uppercase mt-4 transition"
              >
                Save Code
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
