"use client";

import { useState, useEffect } from "react";
import { Search, FileText, Download, Briefcase, Mail, Phone, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminCatalogs() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCatalogs = async () => {
    try {
      const res = await fetch("/api/catalogs");
      const data = await res.json();
      if (res.ok) {
        setCatalogs(data.catalogs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/catalogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setCatalogs(catalogs.map(c => c._id === id ? { ...c, status: newStatus } : c));
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCatalog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this catalog?")) return;
    try {
      const res = await fetch(`/api/catalogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCatalogs(catalogs.filter(c => c._id !== id));
      } else {
        console.error("Failed to delete catalog");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const filteredCatalogs = catalogs.filter(c => 
    (c.organisationName && c.organisationName.toLowerCase().includes(search.toLowerCase())) || 
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#1C1C1A]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Partner Catalogs
        </h1>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD0] overflow-hidden">
        <div className="p-4 border-b border-[#E8DDD0] flex gap-4 bg-[#FAF7F2]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by shop name or email..."
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
                <th className="px-6 py-4 font-medium">Organisation / Contact</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Submitted On</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">Loading catalogs...</td>
                </tr>
              ) : filteredCatalogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">No catalogs found.</td>
                </tr>
              ) : (
                filteredCatalogs.map((catalog) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={catalog._id}
                    className="border-b border-[#E8DDD0] transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] text-[#4A6741] flex items-center justify-center border border-[#E8DDD0] shrink-0">
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-base">
                            {catalog.organisationName}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Mail size={12} /> {catalog.email}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <Phone size={12} /> {catalog.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      <div><span className="font-medium text-gray-700">Owner:</span> {catalog.ownerName || '-'}</div>
                      <div><span className="font-medium text-gray-700">Location:</span> {catalog.location || '-'}</div>
                      <div><span className="font-medium text-gray-700">Product:</span> {catalog.productType || '-'}</div>
                      <div><span className="font-medium text-gray-700">Material:</span> {catalog.sustainableMaterial || '-'}</div>
                      <div><span className="font-medium text-gray-700">MOQ:</span> {catalog.moq || '-'}</div>
                      <div><span className="font-medium text-gray-700">Model:</span> {catalog.collaborationModel || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                       <select
                         value={catalog.status}
                         onChange={(e) => updateStatus(catalog._id, e.target.value)}
                         className={`text-xs font-bold rounded-full px-3 py-1.5 border-r-8 border-transparent focus:outline-none focus:ring-2 focus:ring-[#C8A97A] ${
                           catalog.status === "Approved" ? "bg-emerald-100 text-emerald-800" :
                           catalog.status === "Rejected" ? "bg-red-100 text-red-800" :
                           "bg-amber-100 text-amber-800"
                         }`}
                       >
                         <option value="Pending">Pending</option>
                         <option value="Approved">Approved</option>
                         <option value="Rejected">Rejected</option>
                       </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(catalog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <a
                          href={catalog.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-[#4A6741] hover:bg-[#FAF7F2] transition-colors"
                        >
                          <FileText size={14} /> View PDF
                        </a>
                        <a
                          href={catalog.pdfUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#4A6741] text-white hover:bg-[#3d5535] transition-colors"
                        >
                          <Download size={14} />
                        </a>
                        <button
                          onClick={() => deleteCatalog(catalog._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                          title="Delete Catalog"
                        >
                          <Trash2 size={14} />
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
