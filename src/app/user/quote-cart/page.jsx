"use client";
import Image from "next/image";

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
  const { cartItems, removeFromCart, updateQuantity, clearCart, isLoaded, promoCode, discountPercentage, applyPromo, removePromo } = useCart();
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

  const discountAmount = (estimatedTotal * (discountPercentage || 0)) / 100;
  const finalTotal = estimatedTotal - discountAmount;
  
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState({ text: "", type: "" });

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoInput) return;
    setPromoLoading(true);
    setPromoMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/promos/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput }),
      });
      const data = await res.json();
      if (res.ok) {
        applyPromo(data.code, data.discountPercentage);
        setPromoMessage({ text: `Code applied! ${data.discountPercentage}% off.`, type: "success" });
      } else {
        setPromoMessage({ text: data.error, type: "error" });
      }
    } catch (err) {
      setPromoMessage({ text: "Error applying code.", type: "error" });
    } finally {
      setPromoLoading(false);
    }
  };

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

${promoCode ? `🏷️ *PROMO APPLIED:* ${promoCode} (${discountPercentage}% OFF)\n` : ""}💰 *ESTIMATED TOTAL:* ₹${finalTotal.toLocaleString()}

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

  if (!isLoaded) return <div className="min-h-screen bg-white"></div>;

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-6 text-[#1C1C1A]" style={{ fontFamily: sans }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="block text-[10px] tracking-[0.3em] uppercase text-[#C8A97A] font-bold mb-4">
            B2B Checkout
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light" style={{ fontFamily: serif }}>
            Your <span className="italic font-semibold text-[#4A6741]">Quote Cart</span>
          </h1>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[#1C1C1A] p-12 md:p-20 text-center max-w-3xl mx-auto"
          >
            <div className="w-20 h-20 rounded-full border border-[#1C1C1A] text-[#1C1C1A] flex items-center justify-center mx-auto mb-8">
              <Check size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl font-medium mb-6" style={{ fontFamily: serif }}>Inquiry Submitted</h2>
            <p className="text-[#6B6560] leading-[1.8] font-light mb-10 text-sm md:text-base max-w-xl mx-auto">
              Thank you for your bulk inquiry. The details have been forwarded to our WhatsApp business line and email. An artisan partnerships manager will reach out shortly with finalized pricing and lead times.
            </p>
            <Link
              href="/user/products"
              className="inline-flex items-center justify-center bg-[#1C1C1A] text-white hover:bg-[#C8A97A] px-10 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
            >
              Continue Sourcing
            </Link>
          </motion.div>
        ) : cartItems.length === 0 ? (
          <div className="border border-[#ECE6DF] p-16 md:p-24 text-center max-w-3xl mx-auto flex flex-col items-center">
            <ShoppingCart size={48} strokeWidth={1} className="text-[#9E9088] mb-8" />
            <h2 className="text-3xl font-medium mb-4" style={{ fontFamily: serif }}>Your list is empty</h2>
            <p className="text-[#6B6560] leading-relaxed mb-10 max-w-sm font-light text-sm">
              Add products to your quote list to request custom B2B pricing, volume discounts, and personalized lead times.
            </p>
            <Link
              href="/user/products"
              className="inline-flex items-center justify-center border border-[#1C1C1A] text-[#1C1C1A] hover:bg-[#1C1C1A] hover:text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start relative">
            
            {/* Left: Cart Items */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="flex items-center justify-between border-b-2 border-[#1C1C1A] pb-6 mb-8">
                <h3 className="text-2xl font-medium" style={{ fontFamily: serif }}>Selected Items ({totalItems})</h3>
                <button onClick={clearCart} className="text-[10px] font-bold uppercase tracking-widest text-[#9E9088] hover:text-[#1C1C1A] transition-colors">
                  Clear All
                </button>
              </div>

              <div className="flex flex-col">
                {cartItems.map((item) => {
                  const price = item.product.discountPrice ?? item.product.price;
                  return (
                    <div key={item.product._id} className="flex gap-6 sm:gap-10 border-b border-[#ECE6DF] py-8 last:border-b-0">
                      <div className="w-24 h-32 sm:w-32 sm:h-40 shrink-0 bg-[#F8F6F3] overflow-hidden border border-[#ECE6DF]/50">
                        {item.product.images?.[0] ? (
                          <Image width={800} height={800} src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#9E9088]">
                            <ShoppingCart size={20} strokeWidth={1} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <p className="text-[9px] tracking-[0.2em] text-[#C8A97A] uppercase font-bold">{item.product.category}</p>
                            <button
                              onClick={() => removeFromCart(item.product._id)}
                              className="text-[#9E9088] hover:text-[#1C1C1A] transition-colors"
                            >
                              <Trash2 size={16} strokeWidth={1.5} />
                            </button>
                          </div>
                          <h4 className="text-xl sm:text-2xl font-light leading-tight mb-3" style={{ fontFamily: serif }}>
                            <Link href={`/user/products/${item.product._id}`} className="hover:text-[#4A6741] transition-colors">
                              {item.product.name}
                            </Link>
                          </h4>
                          <p className="text-xs text-[#6B6560] font-light">Base: ₹{price.toLocaleString()} / unit</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-[#9E9088]">Quantity</label>
                            <input
                              type="number"
                              min={item.product.minOrderQty || 1}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value) || 1)}
                              className="w-24 border-b border-[#ECE6DF] bg-transparent pb-1 text-lg font-medium text-[#1C1C1A] focus:outline-none focus:border-[#1C1C1A] transition-colors"
                            />
                            <span className="text-[9px] uppercase tracking-wider font-bold text-[#C8A97A]">MOQ: {item.product.minOrderQty || 1}</span>
                          </div>
                          
                          {item.targetBudget && (
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B6560]">
                              Target: <span className="text-[#1C1C1A]">₹{item.targetBudget} / unit</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Checkout Form */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32">
              <div className="bg-[#FAF7F2] p-8 md:p-10 border border-[#ECE6DF]">
                <h3 className="text-2xl font-medium mb-8 border-b border-[#E8DDD0] pb-6" style={{ fontFamily: serif }}>Billing & Shipping Details</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#9E9088] mb-2">Company Name *</label>
                    <input required type="text" name="companyName" value={form.companyName} onChange={handleChange} className="w-full border-b border-[#E8DDD0] bg-transparent py-2 text-sm text-[#1C1C1A] focus:outline-none focus:border-[#1C1C1A] transition-colors placeholder:text-[#ECE6DF]" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-[#9E9088] mb-2">Contact Person *</label>
                      <input required type="text" name="contactPerson" value={form.contactPerson} onChange={handleChange} className="w-full border-b border-[#E8DDD0] bg-transparent py-2 text-sm text-[#1C1C1A] focus:outline-none focus:border-[#1C1C1A] transition-colors placeholder:text-[#ECE6DF]" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-[#9E9088] mb-2">Phone *</label>
                      <input required type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full border-b border-[#E8DDD0] bg-transparent py-2 text-sm text-[#1C1C1A] focus:outline-none focus:border-[#1C1C1A] transition-colors placeholder:text-[#ECE6DF]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#9E9088] mb-2">Email Address *</label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange} className="w-full border-b border-[#E8DDD0] bg-transparent py-2 text-sm text-[#1C1C1A] focus:outline-none focus:border-[#1C1C1A] transition-colors placeholder:text-[#ECE6DF]" />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#9E9088] mb-2">GST Number</label>
                    <input type="text" name="gstNumber" value={form.gstNumber} onChange={handleChange} className="w-full border-b border-[#E8DDD0] bg-transparent py-2 text-sm text-[#1C1C1A] focus:outline-none focus:border-[#1C1C1A] transition-colors font-mono uppercase placeholder:text-transparent" placeholder="Optional" />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#9E9088] mb-2">Delivery Address / Country *</label>
                    <textarea required name="address" rows={2} value={form.address} onChange={handleChange} className="w-full border-b border-[#E8DDD0] bg-transparent py-2 text-sm text-[#1C1C1A] focus:outline-none focus:border-[#1C1C1A] transition-colors resize-none placeholder:text-[#ECE6DF]" />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#9E9088] mb-2">Order Notes</label>
                    <textarea name="additionalInfo" rows={2} value={form.additionalInfo} onChange={handleChange} placeholder="Custom branding, timelines..." className="w-full border-b border-[#E8DDD0] bg-transparent py-2 text-sm text-[#1C1C1A] focus:outline-none focus:border-[#1C1C1A] transition-colors resize-none placeholder:text-[#D5CCC3]" />
                  </div>

                  <div className="mt-10 pt-6 border-t border-[#E8DDD0]">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#9E9088]">Subtotal</span>
                      <span className="text-xl font-light text-[#9E9088]" style={{ fontFamily: serif }}>₹{estimatedTotal.toLocaleString()}</span>
                    </div>

                    {promoCode && (
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A6741]">Discount ({promoCode})</span>
                        <span className="text-xl font-light text-[#4A6741]" style={{ fontFamily: serif }}>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-end mb-4 pt-3 border-t border-[#ECE6DF]">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#1C1C1A]">Estimated Total</span>
                      <span className="text-2xl font-semibold text-[#1C1C1A]" style={{ fontFamily: serif }}>₹{finalTotal.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-[#9E9088] leading-relaxed font-light mb-6">
                      This is an estimate based on standard pricing. Final B2B pricing, including shipping, will be finalized by our team.
                    </p>
                    
                    {!promoCode ? (
                      <div className="bg-white border border-[#ECE6DF] p-4 flex gap-3">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          placeholder="Promo Code"
                          className="flex-1 bg-transparent text-sm font-mono uppercase focus:outline-none placeholder:text-[#D5CCC3] placeholder:normal-case"
                        />
                        <button
                          onClick={handleApplyPromo}
                          disabled={promoLoading || !promoInput}
                          type="button"
                          className="text-[10px] font-bold uppercase tracking-widest text-[#C8A97A] hover:text-[#1C1C1A] transition-colors disabled:opacity-50"
                        >
                          {promoLoading ? "Applying" : "Apply"}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-100 p-4 flex justify-between items-center">
                        <span className="text-xs text-emerald-800 font-medium">Promo <span className="font-bold">{promoCode}</span> applied!</span>
                        <button
                          type="button"
                          onClick={removePromo}
                          className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-900 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {promoMessage.text && !promoCode && (
                      <p className={`text-[10px] mt-2 font-medium tracking-wide ${promoMessage.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                        {promoMessage.text}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-4 bg-[#1C1C1A] hover:bg-[#C8A97A] text-white py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors mt-8 disabled:opacity-60"
                  >
                    {submitting ? "Processing Inquiry..." : "Submit Quote Request"} <ArrowRight size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
