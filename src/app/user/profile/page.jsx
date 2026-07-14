"use client";
import Image from "next/image";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Check, Loader2, Camera, LayoutDashboard, History, Settings, FileText, Package, Clock, TrendingUp, LogOut, ArrowLeft, X, Menu, Printer, Download, Palette } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Link from "next/link";

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

export default function UserProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const invoiceRef = useRef(null);

  // Profile data states
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dashboard states
  const [activeTab, setActiveTab] = useState("dashboard");
  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // Custom Designs states
  const [customDesigns, setCustomDesigns] = useState([]);
  const [loadingCustomDesigns, setLoadingCustomDesigns] = useState(true);
  const [selectedCustomDesign, setSelectedCustomDesign] = useState(null);

  // Status feedback states
  const [message, setMessage] = useState({ type: "", text: "" });

  // Print & PDF Handlers
  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    iframe.contentDocument.write('<html><head><title>Invoice</title>');
    // Copy Tailwind styles
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
    styles.forEach((style) => {
      iframe.contentDocument.write(style.outerHTML);
    });
    iframe.contentDocument.write('<style>body { background: white; -webkit-print-color-adjust: exact; color-adjust: exact; }</style>');
    iframe.contentDocument.write('</head><body>');
    // Wrap in standard width to preserve grid/flex classes
    iframe.contentDocument.write('<div style="width: 794px; padding: 2rem;">');
    iframe.contentDocument.write(printContent.innerHTML);
    iframe.contentDocument.write('</div></body></html>');
    iframe.contentDocument.close();

    // Give images time to load, then print
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
  };

  const handleDownloadPdf = () => {
    handlePrint();
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated") {
      fetchProfile();
      fetchQuotes();
      fetchCustomDesigns();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (res.ok && data.user) {
        setProfile({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          email: data.user.email || "",
          mobile: data.user.mobile || "",
          image: data.user.image || "",
        });
        setImagePreview(data.user.image || "");
      } else {
        setMessage({ type: "error", text: data.message || "Failed to load profile details" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "An error occurred fetching your profile details" });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotes = async () => {
    try {
      setLoadingQuotes(true);
      const res = await fetch("/api/user/my-quotes");
      const data = await res.json();
      if (res.ok) setQuotes(data.quotes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuotes(false);
    }
  };

  const fetchCustomDesigns = async () => {
    try {
      setLoadingCustomDesigns(true);
      const res = await fetch("/api/user/custom-design", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setCustomDesigns(data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCustomDesigns(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image file size should be less than 5MB" });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("mobile", profile.mobile);

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (profile.image) {
        formData.append("image", profile.image);
      }

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setMessage({ type: "success", text: "Profile details updated successfully!" });
        setProfile({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          email: data.user.email || "",
          mobile: data.user.mobile || "",
          image: data.user.image || "",
        });
        setImagePreview(data.user.image || "");
        setSelectedFile(null);

        await update({
          name: `${data.user.firstName} ${data.user.lastName}`,
          image: data.user.image,
        });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile details" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "An error occurred while saving your profile details" });
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || (loading && loadingQuotes && loadingCustomDesigns)) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#4A6741] h-8 w-8 stroke-[1.5]" />
          <p className="text-xs text-[#9E9088] uppercase tracking-widest" style={{ fontFamily: sans }}>
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Get user initials
  const initials = `${profile.firstName?.charAt(0) || ""}${profile.lastName?.charAt(0) || ""}`.toUpperCase() || "U";

  // Calculate Metrics
  const totalOrders = quotes.length;
  const pendingOrders = quotes.filter(q => q.status === "Pending").length;
  const totalProducts = quotes.reduce((acc, q) => acc + q.items.length, 0);

  // Chart Data: Orders over time
  const monthlyDataMap = {};
  quotes.forEach(q => {
    const d = new Date(q.createdAt);
    const m = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!monthlyDataMap[m]) monthlyDataMap[m] = 0;
    monthlyDataMap[m] += 1;
  });
  const barChartData = Object.keys(monthlyDataMap).map(k => ({ name: k, orders: monthlyDataMap[k] })).reverse();

  // Chart Data: Status breakdown
  const statusMap = {};
  quotes.forEach(q => {
    if (!statusMap[q.status]) statusMap[q.status] = 0;
    statusMap[q.status] += 1;
  });
  const pieChartData = Object.keys(statusMap).map(k => ({ name: k, value: statusMap[k] }));
  const COLORS = ['#4A6741', '#C8A97A', '#1C1C1A', '#8FBD84', '#E8DDD0'];

  const tabItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Order History", icon: History },
    { id: "customDesigns", label: "Custom Designs", icon: Palette },
    { id: "profile", label: "Profile Settings", icon: Settings },
  ];

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#1C1C1A] text-white">
      {/* Brand & Mobile Close */}
      <div className="flex items-center justify-between px-6 py-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#8FBD84" className="flex-shrink-0">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 4-8 4 .83-.83 3-2.67 4-5-2.5 1-5.33 2.5-7 4.5C9 8 8.5 11 9 14c-1-1.5-1.5-4-1-6-2 2-3 6-3 8a8 8 0 0 0 8 8c4-2 5-9 4-16z" />
          </svg>
          <span className="font-semibold text-xl tracking-wider" style={{ fontFamily: serif }}>
            Krislux<span className="text-[#8FBD84]">ECO</span>
          </span>
        </div>
        <button onClick={() => setMobileOpen(false)} className="md:hidden text-white/50 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* User Info */}
      <div className="px-6 py-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-2xl font-semibold shadow-lg overflow-hidden mb-4 border border-[#4A6741]/50">
          {imagePreview ? (
            <Image width={800} height={800} src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <h2 className="text-lg font-bold text-white tracking-wide">{profile.firstName} {profile.lastName}</h2>
        <p className="text-xs text-white/50 truncate w-full mt-1 font-mono">{profile.email}</p>
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-4 space-y-2 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4 mt-2">Main Menu</p>
        {tabItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${isActive ? "bg-[#4A6741] text-white shadow-md" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-white/60"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Footer Nav */}
      <div className="px-4 py-6 border-t border-white/10 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium text-white/60 hover:text-white hover:bg-white/5">
          <ArrowLeft size={18} />
          Back to Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 flex-shrink-0 shadow-2xl z-20 sticky top-0 h-screen overflow-y-auto">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween", duration: 0.3 }} className="relative w-72 bg-[#1C1C1A] h-full shadow-2xl overflow-y-auto">
            {SidebarContent}
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col relative z-10">

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-white border-b border-[#ECE6DF] px-6 py-4 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#8FBD84">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 4-8 4 .83-.83 3-2.67 4-5-2.5 1-5.33 2.5-7 4.5C9 8 8.5 11 9 14c-1-1.5-1.5-4-1-6-2 2-3 6-3 8a8 8 0 0 0 8 8c4-2 5-9 4-16z" />
            </svg>
            <span className="font-semibold text-lg tracking-wider text-[#1C1C1A]" style={{ fontFamily: serif }}>
              Krislux<span className="text-[#8FBD84]">ECO</span>
            </span>
          </div>
          <button onClick={() => setMobileOpen(true)} className="text-[#1C1C1A]">
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1 p-6 md:p-10 lg:p-12">
          <div className="max-w-6xl mx-auto">

            {activeTab === "dashboard" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h1 className="text-4xl font-light text-[#1C1C1A] mb-2" style={{ fontFamily: serif }}>
                      Welcome back, <span className="font-semibold italic text-[#4A6741]">{profile.firstName}</span>
                    </h1>
                    <p className="text-sm text-[#6B6560]">Here is an overview of your B2B account activity.</p>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white rounded-3xl border border-[#ECE6DF] p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-[#FAF7F2] rounded-xl text-[#C8A97A]">
                        <FileText size={24} />
                      </div>
                      <span className="text-[10px] font-bold text-[#9E9088] uppercase tracking-widest">Total Orders</span>
                    </div>
                    <h3 className="text-4xl font-bold text-[#1C1C1A] font-serif">{totalOrders}</h3>
                  </div>
                  <div className="bg-white rounded-3xl border border-[#ECE6DF] p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-[#FAF7F2] rounded-xl text-amber-500">
                        <Clock size={24} />
                      </div>
                      <span className="text-[10px] font-bold text-[#9E9088] uppercase tracking-widest">Pending</span>
                    </div>
                    <h3 className="text-4xl font-bold text-[#1C1C1A] font-serif">{pendingOrders}</h3>
                  </div>
                  <div className="bg-white rounded-3xl border border-[#ECE6DF] p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-[#FAF7F2] rounded-xl text-[#4A6741]">
                        <Package size={24} />
                      </div>
                      <span className="text-[10px] font-bold text-[#9E9088] uppercase tracking-widest">Items Requested</span>
                    </div>
                    <h3 className="text-4xl font-bold text-[#1C1C1A] font-serif">{totalProducts}</h3>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Bar Chart */}
                  <div className="bg-white rounded-3xl border border-[#ECE6DF] p-8 shadow-sm h-96 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xs font-bold text-[#1C1C1A] uppercase tracking-widest">Order Frequency</h3>
                      <TrendingUp size={18} className="text-[#9E9088]" />
                    </div>
                    {barChartData.length > 0 ? (
                      <div className="flex-1 w-full h-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9E9088" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#9E9088" }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: '#FAF7F2' }} contentStyle={{ borderRadius: '16px', border: '1px solid #ECE6DF', fontSize: '12px', padding: '12px' }} />
                            <Bar dataKey="orders" fill="#4A6741" radius={[6, 6, 0, 0]} barSize={40} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-sm text-[#9E9088]">Not enough data to display chart.</div>
                    )}
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-white rounded-3xl border border-[#ECE6DF] p-8 shadow-sm h-96 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-[#1C1C1A] uppercase tracking-widest">Status Breakdown</h3>
                    </div>
                    {pieChartData.length > 0 ? (
                      <div className="flex-1 w-full h-full min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={75}
                              outerRadius={110}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                            >
                              {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #ECE6DF', fontSize: '12px', padding: '12px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                          <span className="text-3xl font-bold text-[#1C1C1A] font-serif">{totalOrders}</span>
                          <span className="text-[10px] text-[#9E9088] uppercase tracking-widest mt-1">Total</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-sm text-[#9E9088]">No orders yet.</div>
                    )}
                  </div>
                </div>

                {/* Recent Orders List */}
                <div className="bg-white rounded-3xl border border-[#ECE6DF] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8 border-b border-[#ECE6DF] pb-4">
                    <h3 className="text-xs font-bold text-[#1C1C1A] uppercase tracking-widest">Recent Activity</h3>
                    <button onClick={() => setActiveTab("orders")} className="text-xs font-bold text-[#4A6741] uppercase tracking-wider hover:underline flex items-center gap-1">
                      View All
                    </button>
                  </div>
                  {quotes.length === 0 ? (
                    <p className="text-[#6B6560] text-sm text-center py-8">No recent activity.</p>
                  ) : (
                    <div className="space-y-6">
                      {quotes.slice(0, 3).map(quote => (
                        <div key={quote._id} className="flex items-center justify-between border-b border-[#ECE6DF] last:border-0 pb-6 last:pb-0">
                          <div>
                            <p className="font-semibold text-[#1C1C1A]">{quote.items.length} Product(s) Requested</p>
                            <p className="text-xs text-[#9E9088] mt-1 uppercase tracking-wider">{new Date(quote.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full ${quote.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              quote.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                'bg-gray-50 text-gray-700 border border-gray-200'
                            }`}>
                            {quote.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <div className="mb-8 border-b border-[#1C1C1A] pb-6">
                  <h1 className="text-4xl font-light text-[#1C1C1A] mb-2" style={{ fontFamily: serif }}>
                    Order <span className="font-semibold italic text-[#4A6741]">History</span>
                  </h1>
                  <p className="text-sm text-[#6B6560] font-light">Track and manage your requested B2B bulk orders.</p>
                </div>

                {loadingQuotes ? (
                  <div className="py-24 text-center text-sm text-[#9E9088] uppercase tracking-widest font-bold">Loading orders...</div>
                ) : quotes.length === 0 ? (
                  <div className="bg-[#FAF7F2] border border-[#ECE6DF] p-24 text-center">
                    <p className="text-[#6B6560] font-light">You haven't requested any bulk quotes yet.</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {quotes.map(quote => (
                      <div key={quote._id} className="bg-white border border-[#ECE6DF] p-8 md:p-10">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#ECE6DF] pb-6 mb-8 gap-4">
                          <div>
                            <p className="text-[9px] text-[#9E9088] uppercase tracking-widest font-bold mb-2">Requested on {new Date(quote.createdAt).toLocaleDateString()}</p>
                            <h4 className="font-medium text-[#1C1C1A] text-2xl" style={{ fontFamily: serif }}>{quote.items.length} Product(s)</h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${quote.status === 'Pending' ? 'bg-amber-500' :
                                quote.status === 'Approved' ? 'bg-emerald-600' :
                                  'bg-gray-400'
                              }`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${quote.status === 'Pending' ? 'text-amber-600' :
                                quote.status === 'Approved' ? 'text-emerald-700' :
                                  'text-gray-600'
                              }`}>
                              {quote.status}
                            </span>
                          </div>
                        </div>

                        <div className="mb-10">
                          <table className="w-full text-left text-sm text-[#6B6560]">
                            <thead className="text-[9px] uppercase tracking-widest text-[#9E9088] border-b border-[#ECE6DF]">
                              <tr>
                                <th className="font-bold py-4 px-2">Item Description</th>
                                <th className="font-bold py-4 px-2 text-right">Quantity</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#ECE6DF]">
                              {quote.items.map((item, idx) => {
                                const productImg = item.productId?.images?.[0]?.url;
                                return (
                                  <tr key={idx} className="hover:bg-[#FAF7F2] transition-colors">
                                    <td className="py-5 px-2 font-medium text-[#1C1C1A]">
                                      <div className="flex items-center gap-4">
                                        {productImg ? (
                                          <div className="w-12 h-16 shrink-0 bg-[#F8F6F3] border border-[#ECE6DF] overflow-hidden">
                                            <Image width={800} height={800} src={productImg} alt={item.productName} className="w-full h-full object-cover" />
                                          </div>
                                        ) : (
                                          <div className="w-12 h-16 shrink-0 bg-[#F8F6F3] border border-[#ECE6DF] flex items-center justify-center text-[#9E9088]">
                                            <Package size={14} strokeWidth={1.5} />
                                          </div>
                                        )}
                                        <span>{item.productName}</span>
                                      </div>
                                    </td>
                                    <td className="py-5 px-2 text-right font-bold text-xs uppercase tracking-widest text-[#6B6560] align-middle">{item.quantity} units</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-[#1C1C1A] space-x-4">
                          <button
                            onClick={() => setSelectedQuote(quote)}
                            className="text-[9px] font-bold text-[#1C1C1A] border border-[#1C1C1A] hover:bg-[#1C1C1A] hover:text-white px-8 py-3.5 uppercase tracking-[0.2em] transition-colors inline-flex items-center gap-2"
                          >
                            <FileText size={14} /> View Details
                          </button>
                          {quote.formalQuoteUrl && (
                            <a href={quote.formalQuoteUrl} target="_blank" className="text-[9px] font-bold text-white bg-[#1C1C1A] hover:bg-[#C8A97A] border border-[#1C1C1A] hover:border-[#C8A97A] px-8 py-3.5 uppercase tracking-[0.2em] transition-colors inline-flex items-center gap-2">
                              <Download size={14} /> Spec / PDF
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "customDesigns" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="mb-8 border-b border-[#ECE6DF] pb-6">
                  <h1 className="text-4xl font-light text-[#1C1C1A] mb-2" style={{ fontFamily: serif }}>
                    Custom <span className="font-semibold italic text-[#4A6741]">Designs</span>
                  </h1>
                  <p className="text-sm text-[#6B6560]">Track the status of your bespoke design requests.</p>
                </div>

                {loadingCustomDesigns ? (
                  <div className="py-24 text-center text-sm text-[#9E9088]">Loading designs...</div>
                ) : customDesigns.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#ECE6DF] p-24 text-center shadow-sm">
                    <p className="text-[#6B6560]">You haven't requested any custom designs yet.</p>
                    <Link href="/user/custom-design" className="mt-4 inline-block text-[10px] font-bold text-[#4A6741] border border-[#4A6741] hover:bg-[#4A6741] hover:text-white px-6 py-3 rounded-xl uppercase tracking-widest transition-colors">Request a Design</Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {customDesigns.map(design => (
                      <div key={design._id} className="bg-white rounded-3xl border border-[#ECE6DF] p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-start border-b border-[#ECE6DF] pb-6 mb-6">
                          <div>
                            <p className="text-[10px] text-[#9E9088] uppercase tracking-widest mb-2">Requested on {new Date(design.createdAt).toLocaleDateString()}</p>
                            <h4 className="font-bold text-[#1C1C1A] text-xl font-serif">Custom Request</h4>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full ${design.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              design.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                            {design.status}
                          </span>
                        </div>
                        <div className="mb-6">
                          <p className="text-sm text-[#1C1C1A] whitespace-pre-wrap line-clamp-3">{design.description}</p>
                        </div>
                        <div className="flex justify-end pt-4 border-t border-[#ECE6DF]">
                          <button
                            onClick={() => setSelectedCustomDesign(design)}
                            className="text-[10px] font-bold text-[#4A6741] border border-[#4A6741] hover:bg-[#4A6741] hover:text-white px-6 py-3 rounded-xl uppercase tracking-widest transition-colors inline-flex items-center gap-2 shadow-sm"
                          >
                            <FileText size={16} /> View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="mb-8 border-b border-[#ECE6DF] pb-6">
                  <h1 className="text-4xl font-light text-[#1C1C1A] mb-2" style={{ fontFamily: serif }}>
                    Profile <span className="font-semibold italic text-[#4A6741]">Settings</span>
                  </h1>
                  <p className="text-sm text-[#6B6560]">Update your personal information and contact details.</p>
                </div>

                <div className="bg-white rounded-3xl border border-[#ECE6DF] p-8 md:p-12 shadow-sm">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center">
                      <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                        {imagePreview ? (
                          <Image width={800} height={800}
                            src={imagePreview}
                            alt="Profile Preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-[#C8A97A]/40 group-hover:opacity-75 transition-all duration-300 shadow-md"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-4xl font-semibold border-4 border-[#C8A97A]/40 group-hover:opacity-75 transition-all duration-300 shadow-md">
                            {initials}
                          </div>
                        )}
                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Camera className="text-white w-8 h-8" />
                        </div>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="mt-4 text-[10px] font-bold text-[#4A6741] hover:underline uppercase tracking-widest"
                      >
                        Change Picture
                      </button>
                    </div>

                    {/* Info Message Banner */}
                    <AnimatePresence mode="wait">
                      {message.text && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className={`p-5 rounded-2xl text-xs font-bold uppercase tracking-widest border flex items-center gap-3 ${message.type === "success"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                              : "bg-red-50 border-red-200 text-red-800"
                            }`}
                        >
                          {message.type === "success" ? <Check size={18} /> : <div className="w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center font-bold">!</div>}
                          <span>{message.text}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Form Fields */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-bold text-[#9E9088] mb-2 uppercase tracking-widest">
                            First Name
                          </label>
                          <div className="relative">
                            <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9E9088]" />
                            <input
                              required
                              type="text"
                              value={profile.firstName}
                              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                              placeholder="John"
                              className="w-full rounded-2xl border border-[#ECE6DF] bg-white pl-14 pr-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition text-[#1C1C1A] shadow-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#9E9088] mb-2 uppercase tracking-widest">
                            Last Name
                          </label>
                          <div className="relative">
                            <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9E9088]" />
                            <input
                              required
                              type="text"
                              value={profile.lastName}
                              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                              placeholder="Doe"
                              className="w-full rounded-2xl border border-[#ECE6DF] bg-white pl-14 pr-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition text-[#1C1C1A] shadow-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#9E9088] mb-2 uppercase tracking-widest">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9E9088]" />
                          <input
                            disabled
                            type="email"
                            value={profile.email}
                            className="w-full rounded-2xl border border-[#ECE6DF] bg-[#FAF7F2] pl-14 pr-5 py-4 text-sm text-[#9E9088] cursor-not-allowed shadow-inner"
                          />
                        </div>
                        <p className="text-[10px] text-[#9E9088] mt-2 italic px-1">
                          Email address cannot be changed.
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#9E9088] mb-2 uppercase tracking-widest">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9E9088]" />
                          <input
                            type="tel"
                            value={profile.mobile}
                            onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full rounded-2xl border border-[#ECE6DF] bg-white pl-14 pr-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition text-[#1C1C1A] shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end border-t border-[#ECE6DF] pt-8 mt-10">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center min-w-[200px] gap-2 rounded-xl bg-[#4A6741] hover:bg-[#3a5233] text-white py-4 px-10 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-md disabled:opacity-60 cursor-pointer"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="animate-spin h-4 w-4" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Invoice Details Modal */}
            {selectedQuote && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
                onClick={() => setSelectedQuote(null)}
              >
                <div
                  className="w-full max-w-4xl h-full max-h-[95vh] overflow-hidden flex flex-col relative"
                  onClick={(e) => e.stopPropagation()}
                >

                  {/* Modal Controls Bar */}
                  <div className="flex items-center justify-between px-6 py-4 bg-[#1C1C1A] text-white">
                    <div className="flex items-center gap-4">
                      <button onClick={handlePrint} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9E9088] hover:text-white transition-colors">
                        <Printer size={14} /> Print
                      </button>
                      <button onClick={handleDownloadPdf} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C8A97A] hover:text-white transition-colors">
                        <Download size={14} /> Download PDF
                      </button>
                    </div>
                    <button onClick={() => setSelectedQuote(null)} className="text-[#9E9088] hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  {/* The "Paper" Container */}
                  <div className="overflow-y-auto flex-1 bg-[#ECE6DF] flex justify-center p-4 md:p-8 custom-scrollbar">

                    {/* The A4 Page itself */}
                    <div ref={invoiceRef} className="bg-white shadow-2xl w-full max-w-[794px] min-h-[1123px] shrink-0 p-8 sm:p-12 md:p-16 flex flex-col relative">

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
                          <h4 className="text-lg font-bold text-[#1C1C1A] mb-1">{profile.firstName} {profile.lastName}</h4>
                          <p className="text-sm text-[#6B6560] leading-relaxed">
                            {profile.email}<br />
                            {profile.mobile}
                          </p>
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
                                        <Image width={800} height={800} src={item.productId.images[0].url} alt={item.productName} className="w-12 h-12 object-cover bg-[#FAF7F2]" />
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
              </div>
            )}

            {/* Custom Design Details Modal */}
            {selectedCustomDesign && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="px-6 py-4 border-b border-[#ECE6DF] flex items-center justify-between bg-[#FAF7F2]">
                    <h3 className="text-lg font-semibold text-[#1C1C1A]" style={{ fontFamily: serif }}>
                      Custom Design Request Details
                    </h3>
                    <button
                      onClick={() => setSelectedCustomDesign(null)}
                      className="text-[#9E9088] hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#9E9088] font-semibold mb-1">Status</p>
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${selectedCustomDesign.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            selectedCustomDesign.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                          {selectedCustomDesign.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#9E9088] font-semibold mb-1">Submitted On</p>
                        <p className="text-[#1C1C1A] font-medium">{new Date(selectedCustomDesign.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#9E9088] font-semibold mb-1">Email Linked</p>
                        <p className="text-[#6B6560]">{selectedCustomDesign.email}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#9E9088] font-semibold mb-1">Phone Linked</p>
                        <p className="text-[#6B6560]">{selectedCustomDesign.phone || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#9E9088] font-semibold mb-2">Design Description & Requirements</p>
                        <div className="bg-[#FAF7F2] border border-[#ECE6DF] p-5 rounded-xl text-[#1C1C1A] text-sm whitespace-pre-wrap leading-relaxed">
                          {selectedCustomDesign.description}
                        </div>
                      </div>

                      {selectedCustomDesign.imageUrl && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-[#9E9088] font-semibold mb-2">Reference Image</p>
                          <div className="rounded-xl overflow-hidden border border-[#ECE6DF] inline-block">
                            <Image width={800} height={800}
                              src={selectedCustomDesign.imageUrl}
                              alt="Reference"
                              className="max-w-full max-h-64 object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-[#ECE6DF] bg-gray-50 flex justify-end">
                    <button
                      onClick={() => setSelectedCustomDesign(null)}
                      className="px-6 py-2.5 bg-[#1C1C1A] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-black transition-colors"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
