"use client";

import { useState, useEffect } from "react";
import { Search, Ban, CheckCircle2, Clock, MessageSquare, Building2, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CustomersList() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalTimeSpentHours: 0, totalQuotes: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/customers?search=${search}`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        if (data.stats) setStats(data.stats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const toggleBlockStatus = async (id, currentStatus) => {
    if (session?.user?.id === id) {
      alert("You cannot block your own admin account.");
      return;
    }
    const newStatus = !currentStatus;
    if (!confirm(`Are you sure you want to ${newStatus ? 'block' : 'unblock'} this user?`)) return;
    
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: newStatus }),
      });
      if (res.ok) {
        setUsers(users.map((u) => u._id === id ? { ...u, isBlocked: newStatus } : u));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0m";
    if (seconds < 60) return `${seconds}s`;
    const min = Math.floor(seconds / 60);
    const hrs = Math.floor(min / 60);
    if (hrs > 0) return `${hrs}h ${min % 60}m`;
    return `${min}m`;
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#1C1C1A]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Customers & Analytics
        </h1>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E8DDD0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#C8A97A]">
            <UserCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-semibold text-[#1C1C1A]">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E8DDD0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Time Spent</p>
            <p className="text-2xl font-semibold text-[#1C1C1A]">{stats.totalTimeSpentHours.toFixed(1)} hrs</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E8DDD0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Quotes</p>
            <p className="text-2xl font-semibold text-[#1C1C1A]">{stats.totalQuotes}</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD0] overflow-hidden">
        <div className="p-4 border-b border-[#E8DDD0] flex gap-4 bg-[#FAF7F2]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A97A] text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-[#FAF7F2] border-b border-[#E8DDD0]">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">B2B Details</th>
                <th className="px-6 py-4 font-medium text-center">Time Spent</th>
                <th className="px-6 py-4 font-medium text-center">Quotes Requested</th>
                <th className="px-6 py-4 font-medium text-center">Last Login</th>
                <th className="px-6 py-4 font-medium text-right">Access</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">No customers found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={user._id}
                    className={`border-b border-[#E8DDD0] transition-colors ${user.isBlocked ? 'bg-red-50/30' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} className="w-8 h-8 rounded-full border border-gray-200" alt="avatar" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#1C1C1A] text-white flex items-center justify-center font-bold text-xs">
                            {user.firstName?.charAt(0) || "U"}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {user.firstName} {user.lastName}
                            {user.role === 'admin' && <span className="bg-blue-100 text-blue-700 text-[9px] uppercase px-1.5 py-0.5 rounded font-bold">Admin</span>}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.companyName ? (
                        <div>
                          <div className="font-medium text-gray-800 flex items-center gap-1">
                            <Building2 size={12} className="text-gray-400" />
                            {user.companyName}
                          </div>
                          {user.taxId && <div className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider">GST: {user.taxId}</div>}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Individual</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {formatTime(user.totalTimeSpent)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${user.quotesRequested > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                        {user.quotesRequested || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-xs">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/orders?customer=${encodeURIComponent(user.email)}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-[#4A6741] hover:bg-[#FAF7F2] transition-colors"
                        >
                          View Orders
                        </button>
                        <button
                          onClick={() => toggleBlockStatus(user._id, user.isBlocked)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            user.isBlocked 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {user.isBlocked ? (
                            <><Ban size={14} /> Blocked</>
                          ) : (
                            <><CheckCircle2 size={14} className="text-green-600" /> Active</>
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
