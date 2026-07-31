"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, CalendarDays, Wallet, Package, Users, Truck } from "lucide-react";

// Custom SVG Icons for robust rendering
const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GlobeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const serif = "var(--font-playfair), Georgia, serif";

const AdminDashBoardClient = ({ earning, stats, chartData, trafficData }) => {
  const [filter, setFilter] = useState("sevenDays");

  const currentEarning =
    filter === "today" ? earning.today : filter === "sevenDays" ? earning.sevenDays : earning.total;

  const title =
    filter === "today"
      ? "Today's Earnings"
      : filter === "sevenDays"
        ? "Last 7 Days Earnings"
        : "Total Earnings";

  const getStatIcon = (title) => {
    if (title.toLowerCase().includes("order")) return Package;
    if (title.toLowerCase().includes("customer")) return Users;
    if (title.toLowerCase().includes("pending")) return Truck;
    return TrendingUp;
  };

  return (
    <div className="w-full relative pb-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-semibold text-[#1C1C1A]"
              style={{ fontFamily: serif }}
            >
              Welcome back
            </h1>
            <p className="text-sm text-[#9E9088]">Here's how the store is doing</p>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-full border border-[#E8DDD0] bg-white px-4 py-2 text-sm font-medium text-[#1C1C1A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
          >
            <option value="sevenDays">Last 7 Days</option>
            <option value="today">Today</option>
            <option value="total">Total</option>
          </select>
        </div>

        {/* Earnings Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ y: -3 }}
            className={`rounded-2xl border p-5 shadow-sm transition ${
              filter === "today" ? "bg-[#4A6741]/5 border-[#4A6741]/30" : "bg-white border-[#ECE6DF]"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#9E9088]">Today</p>
              <CalendarDays className="h-5 w-5 text-[#4A6741]" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-[#1C1C1A]">
              ₹{earning.today.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className={`rounded-2xl border p-5 shadow-sm transition ${
              filter === "sevenDays" ? "bg-[#C8A97A]/8 border-[#C8A97A]/40" : "bg-white border-[#ECE6DF]"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#9E9088]">Last 7 Days</p>
              <TrendingUp className="h-5 w-5 text-[#C8A97A]" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-[#1C1C1A]">
              ₹{earning.sevenDays.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className={`rounded-2xl border p-5 shadow-sm transition ${
              filter === "total" ? "bg-[#8FBD84]/10 border-[#8FBD84]/40" : "bg-white border-[#ECE6DF]"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#9E9088]">Total</p>
              <Wallet className="h-5 w-5 text-[#4A6741]" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-[#1C1C1A]">
              ₹{earning.total.toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* Highlight Card */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="relative overflow-hidden rounded-2xl bg-[#1C1C1A] p-6 sm:p-8 text-white shadow-lg"
            >
              <div className="relative z-10">
                <p className="text-sm font-medium text-white/70">{title}</p>
                <p className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight" style={{ fontFamily: serif }}>
                  ₹{currentEarning.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-white/50">Updated in real time</p>
              </div>
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#4A6741]/30 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#C8A97A]/20 blur-2xl" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stats Section */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => {
            const Icon = getStatIcon(stat.title);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden rounded-2xl border border-[#ECE6DF] bg-white p-5 shadow-sm transition"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#9E9088]">{stat.title}</p>
                  <div className="rounded-lg bg-[#4A6741]/8 p-2 text-[#4A6741] group-hover:bg-[#4A6741]/15 transition">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-semibold text-[#1C1C1A]">
                  {stat.value.toLocaleString()}
                </p>
                <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-[#4A6741]/5 blur-2xl" />
              </motion.div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[#1C1C1A]" style={{ fontFamily: serif }}>
                  Orders Overview
                </h2>
                <p className="text-sm text-[#9E9088]">Last 7 days performance</p>
              </div>
              <TrendingUp className="h-5 w-5 text-[#4A6741]" />
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ECE6DF" />
                  <XAxis dataKey="day" stroke="#9E9088" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#9E9088" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #ECE6DF",
                      fontSize: 13,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#4A6741"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#4A6741" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Traffic Sources */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#1C1C1A]" style={{ fontFamily: serif }}>
                  Traffic Sources
                </h2>
                <p className="text-sm text-[#9E9088]">Total Site Visits: {trafficData?.total || 0}</p>
              </div>
              <Users className="h-5 w-5 text-[#C8A97A]" />
            </div>

            <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-[#ECE6DF] bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-[#1C1C1A]">Instagram</span>
                </div>
                <span className="font-semibold">{trafficData?.instagram || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-[#ECE6DF] bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <LinkedinIcon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-[#1C1C1A]">LinkedIn</span>
                </div>
                <span className="font-semibold">{trafficData?.linkedin || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-[#ECE6DF] bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 text-gray-600 rounded-lg">
                    <GlobeIcon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-[#1C1C1A]">Direct / Other</span>
                </div>
                <span className="font-semibold">
                  {(trafficData?.direct || 0) + (trafficData?.other || 0)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashBoardClient;