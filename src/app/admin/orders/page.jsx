"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, X, FileText, Search, Filter, Printer, Download } from "lucide-react";

export default function AdminQuotesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // "active" | "deleted"

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const customerParam = params.get("customer");
      if (customerParam) {
        setSearch(customerParam);
      }
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    } else if (status === "authenticated") {
      fetchQuotes();
    }
  }, [status]);

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (res.ok) setQuotes(data.quotes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setQuotes((prev) =>
          prev.map((q) => (q._id === id ? { ...q, status: newStatus } : q))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-500">Loading quotes...</div>;
  }

  const statusColors = {
    Pending: "bg-amber-100 text-amber-800",
    Quoted: "bg-blue-100 text-blue-800",
    "Sample Sent": "bg-purple-100 text-purple-800",
    Approved: "bg-emerald-100 text-emerald-800",
    Rejected: "bg-red-100 text-red-800",
    Shipped: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1C1C1A]">Orders & Quotes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage B2B inquiries, sample requests, and bulk orders.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by customer, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]/50 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-3 text-sm font-semibold transition-colors ${activeTab === "active" ? "text-[#4A6741] border-b-2 border-[#4A6741]" : "text-gray-500 hover:text-gray-700"}`}
        >
          Active Orders
        </button>
        <button
          onClick={() => setActiveTab("deleted")}
          className={`pb-3 text-sm font-semibold transition-colors ${activeTab === "deleted" ? "text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Rejected Orders
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quotes
                .filter(quote => activeTab === "deleted" ? quote.status === "Rejected" : quote.status !== "Rejected")
                .filter(quote => {
                   if (!search) return true;
                   const searchLower = search.toLowerCase();
                   const company = quote.customerDetails?.companyName?.toLowerCase() || "";
                   const name = quote.customerDetails?.contactPerson?.toLowerCase() || "";
                   const email = quote.customerDetails?.email?.toLowerCase() || "";
                   return company.includes(searchLower) || name.includes(searchLower) || email.includes(searchLower);
                })
                .map((quote) => (
                <tr key={quote._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{quote.customerDetails.companyName || "N/A"}</p>
                    <p className="text-xs">{quote.customerDetails.contactPerson}</p>
                    <p className="text-xs text-gray-400">{quote.customerDetails.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium mb-1">{quote.items.length} Product(s)</p>
                    <div className="flex flex-col gap-1">
                      {quote.items.map((i, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-500">{i.quantity}x</span>
                          <span className="text-xs text-gray-700">{i.productName}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={quote.status}
                      onChange={(e) => updateStatus(quote._id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border-none focus:ring-0 cursor-pointer ${statusColors[quote.status]}`}
                    >
                      {Object.keys(statusColors).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <button 
                      onClick={() => setSelectedQuote(quote)}
                      className="text-xs border border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741] hover:text-white px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1.5"
                      title="View Invoice"
                    >
                      <FileText size={14} /> View Invoice
                    </button>
                  </td>
                </tr>
              ))}
              {quotes
                .filter(quote => activeTab === "deleted" ? quote.status === "Rejected" : quote.status !== "Rejected")
                .filter(q => {
                   if (!search) return true;
                   const searchLower = search.toLowerCase();
                   return (q.customerDetails?.companyName?.toLowerCase() || "").includes(searchLower) || 
                          (q.customerDetails?.contactPerson?.toLowerCase() || "").includes(searchLower) || 
                          (q.customerDetails?.email?.toLowerCase() || "").includes(searchLower);
                }).length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No orders found matching "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedQuote && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedQuote(null)}
        >
          <div 
            className="bg-[#FAF7F2] rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Controls Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#ECE6DF]">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 text-xs font-semibold text-[#6B6560] hover:text-[#1C1C1A] px-3 py-1.5 border border-[#ECE6DF] hover:border-[#1C1C1A] transition-colors bg-white">
                  <Printer size={14} /> Print
                </button>
                <button className="flex items-center gap-2 text-xs font-semibold text-white bg-[#4A6741] hover:bg-[#3a5233] px-3 py-1.5 transition-colors shadow-sm">
                  <Download size={14} /> PDF
                </button>
              </div>
              <button onClick={() => setSelectedQuote(null)} className="text-[#6B6560] hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* The "Paper" Invoice */}
            <div className="overflow-y-auto p-8 sm:p-12 flex-1 bg-white mx-auto w-full">
              
              {/* Branding & Header */}
              <div className="flex justify-between items-start border-b-2 border-[#1C1C1A] pb-8 mb-8">
                <div>
                  <h1 className="text-4xl font-serif font-bold text-[#1C1C1A] tracking-wider">Krislux<span className="text-[#4A6741]">ECO</span></h1>
                  <p className="text-[10px] text-[#6B6560] tracking-[0.2em] uppercase mt-2">Premium Eco-Friendly Hotel Supplies</p>
                </div>
                <div className="text-right text-[#1C1C1A]">
                  <h2 className="text-3xl font-light tracking-widest mb-4">INVOICE</h2>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <span className="font-semibold text-gray-500">Invoice #</span>
                    <span className="font-mono">INV-{selectedQuote._id.substring(selectedQuote._id.length - 6).toUpperCase()}</span>
                    <span className="font-semibold text-gray-500">Date</span>
                    <span>{new Date(selectedQuote.createdAt).toLocaleDateString()}</span>
                    <span className="font-semibold text-gray-500">Status</span>
                    <span className={`font-bold ${selectedQuote.status === 'Approved' ? 'text-[#4A6741]' : 'text-amber-600'}`}>
                      {selectedQuote.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bill To & Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                <div>
                  <h3 className="text-[10px] font-bold text-[#9E9088] uppercase tracking-widest border-b border-[#ECE6DF] pb-2 mb-3">Bill To</h3>
                  <h4 className="text-lg font-bold text-[#1C1C1A] mb-1">{selectedQuote.customerDetails.companyName || "N/A"}</h4>
                  <p className="text-sm text-[#6B6560] leading-relaxed">
                    {selectedQuote.customerDetails.contactPerson}<br/>
                    {selectedQuote.customerDetails.email}<br/>
                    {selectedQuote.customerDetails.phone}
                  </p>
                  {selectedQuote.customerDetails.gstNumber && (
                    <p className="text-xs font-mono text-[#6B6560] mt-3 pt-3 border-t border-dashed border-[#ECE6DF]">GSTIN: {selectedQuote.customerDetails.gstNumber}</p>
                  )}
                </div>
                {selectedQuote.additionalInfo && (
                  <div>
                     <h3 className="text-[10px] font-bold text-[#9E9088] uppercase tracking-widest border-b border-[#ECE6DF] pb-2 mb-3">Order Notes</h3>
                     <p className="text-sm text-[#6B6560] italic leading-relaxed bg-[#FAF7F2] p-4 rounded-sm border-l-4 border-[#C8A97A]">
                       "{selectedQuote.additionalInfo}"
                     </p>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-y-2 border-[#1C1C1A] text-[10px] uppercase tracking-widest text-[#1C1C1A]">
                      <th className="py-3 px-2">Item Description</th>
                      <th className="py-3 px-2 text-center">Qty</th>
                      <th className="py-3 px-2 text-right">Unit Price</th>
                      <th className="py-3 px-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECE6DF]">
                    {selectedQuote.items.map((item, idx) => {
                      const productPrice = item.productId?.discountPrice || item.productId?.price || 0;
                      const displayPrice = item.targetBudget || productPrice;
                      const lineTotal = displayPrice * item.quantity;
                      
                      return (
                        <tr key={idx} className="group">
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-4">
                              {item.productId?.images?.[0]?.url ? (
                                <img src={item.productId.images[0].url} alt={item.productName} className="w-12 h-12 object-cover bg-[#FAF7F2]" />
                              ) : (
                                <div className="w-12 h-12 bg-[#FAF7F2] flex items-center justify-center text-[10px] text-gray-400">N/A</div>
                              )}
                              <div>
                                <p className="font-bold text-[#1C1C1A]">{item.productName}</p>
                                {item.targetBudget && <span className="text-[9px] uppercase tracking-wider text-[#C8A97A] font-semibold">Custom Target Budget</span>}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center text-[#6B6560] font-medium">{item.quantity}</td>
                          <td className="py-4 px-2 text-right text-[#6B6560]">₹{displayPrice.toLocaleString()}</td>
                          <td className="py-4 px-2 text-right font-bold text-[#1C1C1A]">₹{lineTotal.toLocaleString()}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div className="flex justify-end mb-16">
                <div className="w-72">
                  <div className="flex justify-between py-2 text-sm text-[#6B6560] border-b border-[#ECE6DF]">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ₹{selectedQuote.items.reduce((sum, item) => sum + ((item.targetBudget || item.productId?.discountPrice || item.productId?.price || 0) * item.quantity), 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 text-sm text-[#6B6560] border-b border-[#1C1C1A]">
                    <span>Shipping & Taxes</span>
                    <span className="italic text-[10px] uppercase tracking-wider mt-1">Calculated Later</span>
                  </div>
                  <div className="flex justify-between py-4 text-xl font-bold text-[#1C1C1A] border-b-4 border-double border-[#1C1C1A]">
                    <span className="font-serif">Total Due</span>
                    <span>
                      ₹{selectedQuote.items.reduce((sum, item) => sum + ((item.targetBudget || item.productId?.discountPrice || item.productId?.price || 0) * item.quantity), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-8 border-t border-[#ECE6DF]">
                <p className="font-serif text-[#1C1C1A] text-lg italic mb-1">Thank you for your business.</p>
                <p className="text-[10px] text-[#9E9088] uppercase tracking-widest">KrisluxECO • support@krisluxeco.com • +91 6202585952</p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
