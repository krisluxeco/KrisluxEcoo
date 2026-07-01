"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  X,
  Star,
  Plus,
  Trash2,
  Tag as TagIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImageIcon,
  Boxes,
} from "lucide-react";

const serif = "'Cormorant Garamond', Georgia, serif";

const categories = [
  "Home & Living",
  "Kitchen & Dining",
  "Eco & Sustainable",
  "Business & Wholesale",
  "Garden & Outdoor",
  "Gifting",
];

const emptySpec = () => ({ id: crypto.randomUUID(), key: "", value: "" });

export default function ProductForm({ initialData = null, mode = "add", onSuccess, onCancel }) {
  const router = useRouter();

  // Convert initial images (which are `{ url }` from DB) to our state format
  const initialImagesState = initialData?.images
    ? initialData.images.map((img) => ({
        id: crypto.randomUUID(),
        url: img.url,
        file: null,
        preview: img.url,
      }))
    : [];

  const [images, setImages] = useState(initialImagesState);
  const [tags, setTags] = useState(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [specs, setSpecs] = useState(
    initialData?.specs?.length
      ? initialData.specs.map(s => ({ id: crypto.randomUUID(), key: s.key, value: s.value }))
      : [emptySpec()],
  );
  const [form, setForm] = useState({
    name: initialData?.name || "",
    brand: initialData?.brand || "",
    category: initialData?.category || categories[0],
    description: initialData?.description || "",
    price: initialData?.price || "",
    discountPrice: initialData?.discountPrice || "",
    stock: initialData?.stock || "",
    sku: initialData?.sku || "",
    minOrderQty: initialData?.minOrderQty || "",
    weight: initialData?.weight || "",
    length: initialData?.length || "",
    width: initialData?.width || "",
    height: initialData?.height || "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // ── Images ──────────────────────────────────────────
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const room = 6 - images.length;
    const accepted = files.slice(0, room);

    const newImages = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const makeCover = (id) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      const rest = prev.filter((img) => img.id !== id);
      return [target, ...rest];
    });
  };

  // ── Tags ────────────────────────────────────────────
  const addTag = () => {
    const value = tagInput.trim();
    if (!value || tags.includes(value)) return;
    setTags((prev) => [...prev, value]);
    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

  // ── Specifications ──────────────────────────────────
  const addSpecRow = () => setSpecs((prev) => [...prev, emptySpec()]);

  const removeSpecRow = (id) =>
    setSpecs((prev) =>
      prev.length > 1 ? prev.filter((s) => s.id !== id) : prev,
    );

  const updateSpecRow = (id, field, value) =>
    setSpecs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );

  // ── Submit ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // basic client-side guards matching the Product schema's requirements
    if (!form.name.trim() || !form.description.trim() || !form.price) {
      setError("Name, description and price are required.");
      return;
    }
    if (images.length === 0) {
      setError("Please upload at least one product image.");
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("brand", form.brand);
      fd.append("category", form.category);
      fd.append("description", form.description);
      fd.append("price", form.price);
      if (form.discountPrice) fd.append("discountPrice", form.discountPrice);
      fd.append("stock", form.stock || "0");
      if (form.sku) fd.append("sku", form.sku);
      fd.append("minOrderQty", form.minOrderQty || "1");
      if (form.weight) fd.append("weight", form.weight);
      if (form.length) fd.append("length", form.length);
      if (form.width) fd.append("width", form.width);
      if (form.height) fd.append("height", form.height);

      fd.append("tags", JSON.stringify(tags));
      fd.append(
        "specs",
        JSON.stringify(specs.filter((s) => s.key.trim() && s.value.trim())),
      );

      // In edit mode, append URLs of already uploaded images that were kept
      if (mode === "edit") {
        const remainingExisting = images.filter((img) => !img.file).map((img) => img.url);
        fd.append("existingImages", JSON.stringify(remainingExisting));
      }

      // New files uploaded
      images.forEach((img) => {
        if (img.file) fd.append("images", img.file);
      });

      const endpoint =
        mode === "edit"
          ? `/api/admin/update-product/${initialData?._id}`
          : "/api/admin/add-product";

      const res = await fetch(endpoint, {
        method: mode === "edit" ? "PUT" : "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      if (mode === "add") {
        // reset the form for the next product
        setForm({
          name: "",
          brand: "",
          category: categories[0],
          description: "",
          price: "",
          discountPrice: "",
          stock: "",
          sku: "",
          minOrderQty: "",
          weight: "",
          length: "",
          width: "",
          height: "",
        });
        setImages([]);
        setTags([]);
        setSpecs([emptySpec()]);
      }

      router.refresh();

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      setError(err.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
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
            {mode === "edit" ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-sm text-[#9E9088]">
            {mode === "edit" ? "Update details for this product" : "Fill in the details below to list a new product in your store"}
          </p>
        </div>
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-5 flex items-center gap-2 rounded-xl border border-[#8FBD84]/40 bg-[#8FBD84]/10 px-4 py-3 text-sm text-[#2F4A28]"
          >
            <CheckCircle2 className="h-4 w-4 text-[#4A6741]" />
            {mode === "edit"
              ? "Product updated successfully."
              : "Product published successfully."}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-5 flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── LEFT: main content ───────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic Info */}
            <section className="rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm">
              <h2
                className="text-base font-semibold text-[#1C1C1A] mb-4"
                style={{ fontFamily: serif }}
              >
                Basic Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                    Product Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="e.g. Handthrown Ceramic Mug — Sage Glaze"
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                    Brand
                  </label>
                  <input
                    value={form.brand}
                    onChange={(e) => update("brand", e.target.value)}
                    placeholder="e.g. KrisluxECO"
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                    Description
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Describe the materials, craftsmanship, and what makes this product special..."
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                  />
                </div>
              </div>
            </section>

            {/* Images */}
            <section className="rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-base font-semibold text-[#1C1C1A]"
                  style={{ fontFamily: serif }}
                >
                  Product Images
                </h2>
                <span className="text-xs text-[#9E9088]">
                  {images.length}/6 uploaded
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-[#ECE6DF]"
                  >
                    <img
                      src={img.preview || img.url}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />

                    {i === 0 && (
                      <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-[#4A6741] text-white text-[10px] px-2 py-1">
                        <Star size={10} className="fill-white" /> Cover
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {i !== 0 && (
                        <button
                          type="button"
                          onClick={() => makeCover(img.id)}
                          className="rounded-full bg-white/90 p-1.5 hover:bg-white"
                          title="Set as cover"
                        >
                          <Star size={14} className="text-[#1C1C1A]" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="rounded-full bg-white/90 p-1.5 hover:bg-white"
                        title="Remove"
                      >
                        <X size={14} className="text-[#1C1C1A]" />
                      </button>
                    </div>
                  </div>
                ))}

                {images.length < 6 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-[#E8DDD0] bg-[#FAF7F2] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#4A6741]/40 hover:bg-[#4A6741]/5 transition-colors">
                    <UploadCloud size={22} className="text-[#9E9088]" />
                    <span className="text-xs text-[#9E9088] text-center px-2">
                      Click to upload
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {images.length === 0 && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-[#9E9088]">
                  <ImageIcon size={14} /> The first image you upload becomes the
                  cover photo.
                </p>
              )}
            </section>

            {/* Specifications */}
            <section className="rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-base font-semibold text-[#1C1C1A]"
                  style={{ fontFamily: serif }}
                >
                  Specifications
                </h2>
                <button
                  type="button"
                  onClick={addSpecRow}
                  className="inline-flex items-center gap-1.5 text-sm text-[#4A6741] hover:text-[#3a5233] font-medium"
                >
                  <Plus size={15} /> Add row
                </button>
              </div>

              <div className="space-y-2">
                {specs.map((spec) => (
                  <div
                    key={spec.id}
                    className="grid grid-cols-[1fr_1fr_auto] gap-2"
                  >
                    <input
                      value={spec.key}
                      onChange={(e) =>
                        updateSpecRow(spec.id, "key", e.target.value)
                      }
                      placeholder="e.g. Material"
                      className="rounded-lg border border-[#E8DDD0] bg-[#FAF7F2] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                    />
                    <input
                      value={spec.value}
                      onChange={(e) =>
                        updateSpecRow(spec.id, "value", e.target.value)
                      }
                      placeholder="e.g. Stoneware ceramic"
                      className="rounded-lg border border-[#E8DDD0] bg-[#FAF7F2] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecRow(spec.id)}
                      className="rounded-lg p-2 text-[#9E9088] hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Shipping */}
            <section className="rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm">
              <h2
                className="text-base font-semibold text-[#1C1C1A] mb-4"
                style={{ fontFamily: serif }}
              >
                Shipping Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.weight}
                    onChange={(e) => update("weight", e.target.value)}
                    placeholder="0.5"
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    value={form.length}
                    onChange={(e) => update("length", e.target.value)}
                    placeholder="10"
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                    Width (cm)
                  </label>
                  <input
                    type="number"
                    value={form.width}
                    onChange={(e) => update("width", e.target.value)}
                    placeholder="10"
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={form.height}
                    onChange={(e) => update("height", e.target.value)}
                    placeholder="12"
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* ── RIGHT: sidebar ───────────────────────── */}
          <div className="space-y-5">
            {/* Pricing & Stock */}
            <section className="rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm">
              <h2
                className="text-base font-semibold text-[#1C1C1A] mb-4"
                style={{ fontFamily: serif }}
              >
                Pricing & Stock
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                    MRP (₹)
                  </label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="999"
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) => update("discountPrice", e.target.value)}
                    placeholder="799"
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => update("stock", e.target.value)}
                      placeholder="50"
                      className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                      SKU
                    </label>
                    <input
                      value={form.sku}
                      onChange={(e) => update("sku", e.target.value)}
                      placeholder="KLX-001"
                      className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#1C1C1A] mb-1.5">
                    <Boxes size={14} className="text-[#9E9088]" /> Minimum Order
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.minOrderQty}
                    onChange={(e) => update("minOrderQty", e.target.value)}
                    placeholder="e.g. 1 for retail, 50 for bulk"
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                  />
                </div>
              </div>
            </section>

            {/* Tags */}
            <section className="rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm">
              <h2
                className="text-base font-semibold text-[#1C1C1A] mb-3"
                style={{ fontFamily: serif }}
              >
                Tags
              </h2>
              <div className="flex items-center gap-2 rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-3 py-2 mb-3">
                <TagIcon size={14} className="text-[#9E9088]" />
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type and press enter"
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#4A6741]/8 text-[#4A6741] text-xs px-3 py-1.5"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {tags.length === 0 && (
                  <span className="text-xs text-[#9E9088]">
                    No tags added yet
                  </span>
                )}
              </div>
            </section>

            {/* Submit */}
            <div className="flex gap-3">
              {mode === "edit" && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 inline-flex items-center justify-center rounded-full border border-[#ECE6DF] bg-white text-[#1C1C1A] py-3 text-sm font-medium hover:bg-[#FAF7F2] transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#4A6741] text-white py-3 text-sm font-medium hover:bg-[#3a5233] transition-colors disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}
                {mode === "edit" ? "Save Changes" : "Publish Product"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
