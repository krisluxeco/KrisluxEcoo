"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingCart, ArrowRight, Check } from "lucide-react";

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

const COMPANY_WHATSAPP = "6202585952"; // Replace with your real business WhatsApp number

export default function QuoteCartPage() {
  const router = useRouter();
  const { status } = useSession();
  const { cartItems, removeFromCart, updateQuantity, clearCart, isLoaded } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Billing Details State
  const [form, setForm] = useState({
    companyName: "",
    gstNumber: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    additionalInfo: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Calculate totals
  const totalItems = cartItems.length;
  const estimatedTotal = cartItems.reduce((acc, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status !== "authenticated") {
      return router.push("/login");
    }
    if (cartItems.length === 0) return;
    setSubmitting(true);

    // 1. Track Quote Event
    fetch("/api/user/track-quote", { method: "POST" }).catch(() => {});

    // 2. Construct WhatsApp Message
    let itemsText = "";
    cartItems.forEach((item, index) => {
      itemsText += `\n*${index + 1}. ${item.product.name}*\n`;
      itemsText += `   Quantity: ${item.quantity}\n`;
      if (item.targetBudget) itemsText += `   Target Budget: ₹${item.targetBudget}\n`;
    });

    const waMessage = `🌿 *BULK ORDER PURCHASE INQUIRY* 🌿
    
📦 *ITEMS REQUESTED (${cartItems.length})*${itemsText}

🏢 *BILLING & SHIPPING INFO*
▪️ *Company:* ${form.companyName}
▪️ *Contact:* ${form.contactPerson}
▪️ *Phone:* ${form.phone}
▪️ *Email:* ${form.email}
▪️ *GST:* ${form.gstNumber || "N/A"}
▪️ *Address:* ${form.address}

📝 *ADDITIONAL NOTES*
${form.additionalInfo || "_No additional requirements specified._"}

-----------------------------------
_Sent via KrisluxECO B2B Portal_`;

    const text = encodeURIComponent(waMessage);

    // 3. Send Email via API
    try {
      await fetch("/api/user/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isMultiProduct: true,
          items: cartItems,
          companyName: form.companyName,
          gstNumber: form.gstNumber,
          contactPerson: form.contactPerson,
          email: form.email,
          phone: form.phone,
          address: form.address,
          additionalInfo: form.additionalInfo,
        }),
      });
    } catch (err) {
      console.error("Failed to send email", err);
    }

    setSubmitting(false);
    setSubmitted(true);
    clearCart();

    // 4. Open WhatsApp
    window.open(`https://wa.me/${COMPANY_WHATSAPP}?text=${text}`, "_blank");
  };

  if (!isLoaded) return <div className="min-h-screen bg-[#FAF7F2]"></div>;

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-32 pb-24 px-6 text-[#1C1C1A]" style={{ fontFamily: sans }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-8 bg-[#C8A97A]/60" />
          <p className="text-xs tracking-[0.25em] uppercase text-[#C8A97A] font-semibold">
            B2B Checkout
          </p>
        </div>
        <h1 className="text-4xl md:text-5xl font-light mb-12" style={{ fontFamily: serif }}>
          Your <span className="italic font-semibold text-[#4A6741]">Quote Cart</span>
        </h1>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-[#ECE6DF] p-10 md:p-16 text-center max-w-2xl mx-auto shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-sm mb-6">
              <Check size={32} />
            </div>
            <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: serif }}>Quote Submitted Successfully</h2>
            <p className="text-[#6B6560] leading-relaxed mb-8">
              Thank you for your bulk inquiry. We have sent the details to our WhatsApp business line and our email. An artisan partnerships manager will reach out shortly with finalized pricing and lead times.
            </p>
            <Link
              href="/user/products"
              className="inline-flex items-center gap-2 bg-[#1C1C1A] text-white px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-[#4A6741] transition-colors"
            >
              Continue Sourcing
            </Link>
          </motion.div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#ECE6DF] p-16 text-center shadow-sm">
            <ShoppingCart size={48} className="mx-auto text-[#E8DDD0] mb-6" />
            <h2 className="text-2xl font-medium mb-3" style={{ fontFamily: serif }}>Your list is empty</h2>
            <p className="text-[#9E9088] mb-8 max-w-md mx-auto">
              Add products to your quote list to request custom B2B pricing and bulk discounts.
            </p>
            <Link
              href="/user/products"
              className="inline-flex items-center gap-2 bg-[#1C1C1A] text-white px-8 py-3.5 rounded-full text-sm tracking-wide transition hover:bg-[#4A6741]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Cart Items */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl border border-[#ECE6DF] p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#ECE6DF] pb-4 mb-6">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: serif }}>Items in your list ({totalItems})</h3>
                  <button onClick={clearCart} className="text-xs text-red-600 font-medium hover:underline">
                    Clear all
                  </button>
                </div>

                <div className="space-y-6">
                  {cartItems.map((item) => {
                    const price = item.product.discountPrice ?? item.product.price;
                    return (
                      <div key={item.product._id} className="flex gap-4 sm:gap-6 border-b border-[#ECE6DF] pb-6 last:border-0 last:pb-0">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 bg-[#F8F6F3] rounded-lg border border-[#ECE6DF] overflow-hidden">
                          {item.product.images?.[0] ? (
                            <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#9E9088]">
                              <ShoppingCart size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <p className="text-[10px] tracking-widest text-[#C8A97A] uppercase font-bold mb-1">{item.product.category}</p>
                              <h4 className="text-base sm:text-lg font-medium leading-tight mb-2">
                                <Link href={`/user/products/${item.product._id}`} className="hover:text-[#4A6741] transition">
                                  {item.product.name}
                                </Link>
                              </h4>
                              <p className="text-xs text-[#9E9088] mb-3">Base Price: ₹{price.toLocaleString()} / unit</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product._id)}
                              className="text-[#9E9088] hover:text-red-500 transition p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-auto">
                            <div className="flex items-center gap-2">
                              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6560]">Qty:</label>
                              <input
                                type="number"
                                min={item.product.minOrderQty || 1}
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value) || 1)}
                                className="w-20 rounded-md border border-[#E8DDD0] bg-[#FAF7F2] px-3 py-1.5 text-sm focus:outline-none focus:border-[#4A6741] text-center"
                              />
                            </div>
                            {item.targetBudget && (
                              <div className="text-[11px] font-medium bg-amber-50 text-amber-700 px-2 py-1 rounded-md border border-amber-200">
                                Target: ₹{item.targetBudget} / unit
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Checkout Form */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#ECE6DF] p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 border-b border-[#ECE6DF] pb-4" style={{ fontFamily: serif }}>Billing & Shipping Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Company Name *</label>
                    <input required type="text" name="companyName" value={form.companyName} onChange={handleChange} className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Contact Person *</label>
                      <input required type="text" name="contactPerson" value={form.contactPerson} onChange={handleChange} className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Phone *</label>
                      <input required type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Email Address *</label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">GST Number</label>
                    <input type="text" name="gstNumber" value={form.gstNumber} onChange={handleChange} className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition font-mono uppercase" placeholder="Optional" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Delivery Address / Country *</label>
                    <textarea required name="address" rows={2} value={form.address} onChange={handleChange} className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Order Notes</label>
                    <textarea name="additionalInfo" rows={2} value={form.additionalInfo} onChange={handleChange} placeholder="Custom branding, timelines..." className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition" />
                  </div>
                </div>

                <div className="mt-8 bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8DDD0]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[#6B6560]">Estimated Base Total</span>
                    <span className="text-sm font-semibold">₹{estimatedTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-[#9E9088] leading-relaxed">
                    This is an estimate based on standard pricing. Final B2B pricing, including volume discounts and shipping, will be provided by our sales team.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A6741] hover:bg-[#3a5233] text-white py-4 text-xs font-bold uppercase tracking-wider transition disabled:opacity-60 shadow-md hover:shadow-lg mt-6"
                >
                  {submitting ? "Processing..." : "Submit Quote & Open WhatsApp"} <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
