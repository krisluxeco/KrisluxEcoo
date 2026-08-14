"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  RefreshCw, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Building,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Loader2,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

export default function LeadsDashboardClient() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [filter, setFilter] = useState("all");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  
  const [selectedLead, setSelectedLead] = useState(null);

  const fetchLeads = async (currentStatus = filter, currentPage = page) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?status=${currentStatus}&page=${currentPage}&limit=20`);
      const json = await res.json();
      if (json.success) {
        setLeads(json.data);
        setPagination(json.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchLeads(filter, 1);
    setSelectedLead(null);
  }, [filter]);

  useEffect(() => {
    if (page > 1) fetchLeads(filter, page);
  }, [page]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/leads/sync", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        fetchLeads();
      } else {
        alert("Failed to sync leads: " + json.error);
      }
    } catch (error) {
      console.error("Sync error:", error);
    }
    setIsSyncing(false);
  };

  const updateStatus = async (leadId, newStatus) => {
    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
      if (selectedLead?._id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
      if (filter !== "all" && filter !== newStatus) {
        fetchLeads(); // refresh if it moves out of current view
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "new": return <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">New</span>;
      case "contacted": return <span className="bg-yellow-100 text-yellow-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">Contacted</span>;
      case "qualified": return <span className="bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">Qualified</span>;
      case "converted": return <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">Converted</span>;
      case "lost": return <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">Lost</span>;
      default: return null;
    }
  };

  const getSourceBadge = (source) => {
    switch (source) {
      case "indiamart": return <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded uppercase tracking-wider">IndiaMART</span>;
      case "exportindia": return <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded uppercase tracking-wider">Export India</span>;
      case "website": return <span className="text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded uppercase tracking-wider">Website</span>;
      default: return <span className="text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded uppercase tracking-wider">{source}</span>;
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex bg-white rounded-2xl shadow-sm border border-[#E8DDD0] overflow-hidden m-6">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#FAF7F2] border-r border-[#E8DDD0] flex flex-col">
        <div className="p-6">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full bg-[#1C1C1A] text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-medium hover:bg-[#8B2935] transition-colors shadow-sm disabled:opacity-70"
          >
            <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "Syncing..." : "Sync Portals"}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => setFilter("all")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${filter === "all" ? "bg-[#F4EFE6] text-[#8B2935] font-semibold" : "text-[#6B6560] hover:bg-black/5"}`}
          >
            <Briefcase size={18} /> <span className="font-medium">All Leads</span>
          </button>
          
          <button
            onClick={() => setFilter("new")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${filter === "new" ? "bg-[#F4EFE6] text-[#8B2935] font-semibold" : "text-[#6B6560] hover:bg-black/5"}`}
          >
            <Clock size={18} /> <span className="font-medium">New</span>
          </button>
          
          <button
            onClick={() => setFilter("contacted")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${filter === "contacted" ? "bg-[#F4EFE6] text-[#8B2935] font-semibold" : "text-[#6B6560] hover:bg-black/5"}`}
          >
            <MessageSquare size={18} /> <span className="font-medium">Contacted</span>
          </button>

          <button
            onClick={() => setFilter("converted")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${filter === "converted" ? "bg-[#F4EFE6] text-[#8B2935] font-semibold" : "text-[#6B6560] hover:bg-black/5"}`}
          >
            <CheckCircle size={18} /> <span className="font-medium">Converted</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Leads List */}
        <div className={`flex flex-col border-r border-[#E8DDD0] bg-white transition-all duration-300 ${selectedLead ? 'w-[450px]' : 'w-full'}`}>
          <div className="p-4 border-b border-[#E8DDD0] flex flex-col gap-3">
            <h2 className="text-2xl font-serif font-bold text-[#1C1C1A] capitalize">{filter} Leads</h2>
            
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9088]" size={16} />
                <input 
                  type="text" 
                  placeholder="Search leads..." 
                  className="w-full bg-[#FAF7F2] border border-[#E8DDD0] rounded-xl pl-9 pr-4 py-2 text-sm text-[#1C1C1A] outline-none focus:ring-2 focus:ring-[#8B2935]/20 transition-all"
                />
              </div>
              
              <div className="flex items-center gap-2 shrink-0 text-[#6B6560]">
                <span className="text-xs font-medium mr-2">
                  {pagination.total > 0 ? `${(page - 1) * 20 + 1}-${Math.min(page * 20, pagination.total)} of ${pagination.total}` : "0"}
                </span>
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-[#FAF7F2] disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page >= pagination.pages}
                  className="p-1.5 rounded-lg hover:bg-[#FAF7F2] disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-[#FAF7F2]/20">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-[#9E9088]">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-[#9E9088]">
                <Briefcase size={48} className="mb-4 opacity-20" />
                <p>No leads found.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[#E8DDD0]/50">
                {leads.map((lead) => (
                  <li
                    key={lead._id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-5 cursor-pointer transition-all relative group border-l-4 ${selectedLead?._id === lead._id ? 'bg-[#F4EFE6] border-[#8B2935]' : 'bg-white border-transparent hover:border-[#E8DDD0]'} hover:bg-[#FAF7F2]`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-[#1C1C1A]">
                          {lead.buyerName}
                        </h4>
                        {getStatusBadge(lead.status)}
                      </div>
                      <span className="text-[11px] font-medium text-[#9E9088]">
                        {new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className="text-sm font-medium text-[#6B6560] mb-2 flex items-center gap-1.5">
                      <Building size={14} className="text-[#C8A97A] shrink-0" /> {lead.companyName || "No Company"}
                    </div>
                    
                    <h5 className="text-sm text-[#1C1C1A] font-medium truncate mb-1">
                      {lead.subject}
                    </h5>
                    <p className="text-xs text-[#9E9088] truncate pr-4">{lead.queryMessage}</p>
                    
                    <div className="mt-3 flex justify-between items-center">
                       {getSourceBadge(lead.source)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Lead Reading Pane */}
        {selectedLead ? (
          <div className="flex-1 flex flex-col bg-[#FAF7F2]/30 overflow-y-auto">
            
            {/* Header */}
            <div className="px-8 py-8 border-b border-[#E8DDD0] bg-white shadow-sm z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-[#1C1C1A] mb-2">{selectedLead.buyerName}</h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[#6B6560] bg-[#FAF7F2] px-3 py-1 rounded-lg border border-[#E8DDD0]">
                      <Building size={16} className="text-[#C8A97A]" /> 
                      <span className="font-medium">{selectedLead.companyName || "No Company Provided"}</span>
                    </div>
                    {getSourceBadge(selectedLead.source)}
                    {getStatusBadge(selectedLead.status)}
                  </div>
                </div>
                
                {/* Status Controls */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[#9E9088] uppercase tracking-wider text-right">Update Status</span>
                  <select 
                    value={selectedLead.status}
                    onChange={(e) => updateStatus(selectedLead._id, e.target.value)}
                    className="bg-white border border-[#E8DDD0] rounded-xl px-4 py-2 text-sm font-bold text-[#1C1C1A] shadow-sm focus:ring-2 focus:ring-[#8B2935]/20 outline-none cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted (Won)</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8DDD0]">
                  <div className="flex items-center gap-2 text-[#9E9088] mb-1"><Mail size={14} /> <span className="text-xs font-semibold uppercase tracking-wider">Email</span></div>
                  <a href={`mailto:${selectedLead.email}`} className="text-[#1C1C1A] font-medium hover:text-[#C8A97A] transition-colors">{selectedLead.email || "N/A"}</a>
                </div>
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8DDD0]">
                  <div className="flex items-center gap-2 text-[#9E9088] mb-1"><Phone size={14} /> <span className="text-xs font-semibold uppercase tracking-wider">Phone</span></div>
                  <a href={`tel:${selectedLead.phone}`} className="text-[#1C1C1A] font-medium hover:text-[#C8A97A] transition-colors">{selectedLead.phone || "N/A"}</a>
                </div>
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8DDD0]">
                  <div className="flex items-center gap-2 text-[#9E9088] mb-1"><MapPin size={14} /> <span className="text-xs font-semibold uppercase tracking-wider">Location</span></div>
                  <p className="text-[#1C1C1A] font-medium">{[selectedLead.city, selectedLead.state, selectedLead.country].filter(Boolean).join(", ") || "N/A"}</p>
                </div>
              </div>
            </div>
            
            {/* Message Content */}
            <div className="p-8 max-w-3xl">
              <h3 className="text-xl font-serif font-bold text-[#1C1C1A] mb-6 border-b border-[#E8DDD0] pb-4">Inquiry Details</h3>
              
              <div className="bg-white p-6 rounded-2xl border border-[#E8DDD0] shadow-sm mb-6">
                <h4 className="text-sm font-bold text-[#9E9088] uppercase tracking-wider mb-2">Subject / Product</h4>
                <p className="text-lg text-[#1C1C1A] font-medium mb-6">{selectedLead.subject}</p>
                
                <h4 className="text-sm font-bold text-[#9E9088] uppercase tracking-wider mb-2">Message</h4>
                <div className="text-[#1C1C1A] font-sans leading-relaxed whitespace-pre-wrap bg-[#FAF7F2] p-4 rounded-xl border border-[#E8DDD0]">
                  {selectedLead.queryMessage || "No message provided."}
                </div>
              </div>
            </div>
            
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#FAF7F2]/30 text-[#9E9088]">
            <div className="w-24 h-24 rounded-full bg-[#E8DDD0]/50 flex items-center justify-center mb-6">
              <Briefcase size={40} className="text-[#C8A97A]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1C1A] mb-2">No lead selected</h3>
            <p>Select a lead from the list to view their requirements.</p>
          </div>
        )}
      </div>
    </div>
  );
}
