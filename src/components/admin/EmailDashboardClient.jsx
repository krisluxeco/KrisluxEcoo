"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  Send,
  Trash2,
  Edit3,
  Mail,
  MailOpen,
  Reply,
  X,
  Loader2,
  RefreshCw,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function EmailDashboardClient() {
  const [folder, setFolder] = useState("inbox");
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ to: "", subject: "", body: "" });
  const [isSending, setIsSending] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  // Centralized fetch function
  const fetchEmails = useCallback(
    async (targetFolder = folder, targetPage = page) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/emails?folder=${targetFolder}&page=${targetPage}&limit=20`
        );
        const json = await res.json();
        if (json.success) {
          setEmails(json.data || []);
          setPagination(json.pagination || { total: 0, pages: 1 });
          setUnreadCount(json.unreadCount || 0);
        }
      } catch (error) {
        console.error("Failed to fetch emails:", error);
      } finally {
        setLoading(false);
      }
    },
    [folder, page]
  );

  const handleFolderChange = (newFolder) => {
    setFolder(newFolder);
    setPage(1);
    setSelectedEmail(null);
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/emails?folder=${folder}&page=${page}&limit=20`
        );
        const json = await res.json();
        if (!ignore && json.success) {
          setEmails(json.data || []);
          setPagination(json.pagination || { total: 0, pages: 1 });
          setUnreadCount(json.unreadCount || 0);
        }
      } catch (error) {
        if (!ignore) console.error("Failed to load emails:", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [folder, page]);

  // Mark as Read
  const handleReadEmail = async (email) => {
    setSelectedEmail(email);
    if (!email.isRead && email.folder === "inbox") {
      try {
        await fetch(`/api/admin/emails/${email._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: true }),
        });
        setEmails((prev) =>
          prev.map((e) => (e._id === email._id ? { ...e, isRead: true } : e))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Failed to mark read:", error);
      }
    }
  };

  // Delete Email
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`/api/admin/emails/${id}`, { method: "DELETE" });
      setEmails((prev) => prev.filter((em) => em._id !== id));
      if (selectedEmail?._id === id) setSelectedEmail(null);
      setSuccessToast("Email deleted");
      setTimeout(() => setSuccessToast(""), 3000);
    } catch (error) {
      console.error("Failed to delete email:", error);
    }
  };

  // Toggle Star
  const handleToggleStar = async (e, email) => {
    e.stopPropagation();
    const newStatus = !email.isStarred;
    try {
      await fetch(`/api/admin/emails/${email._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: newStatus }),
      });
      setEmails((prev) =>
        prev.map((item) =>
          item._id === email._id ? { ...item, isStarred: newStatus } : item
        )
      );
      if (selectedEmail?._id === email._id) {
        setSelectedEmail((prev) => ({ ...prev, isStarred: newStatus }));
      }
      if (folder === "starred" && !newStatus) {
        setEmails((prev) => prev.filter((item) => item._id !== email._id));
      }
    } catch (error) {
      console.error("Failed to toggle star:", error);
    }
  };

  // Send Email
  const handleSend = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch("/api/admin/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(composeData),
      });
      const json = await res.json();
      if (json.success) {
        setIsComposing(false);
        setComposeData({ to: "", subject: "", body: "" });
        setSuccessToast("Email dispatched successfully");
        setTimeout(() => setSuccessToast(""), 3500);
        if (folder === "sent") fetchEmails("sent", 1);
      } else {
        alert("Failed to send: " + (json.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("An error occurred while sending the email.");
    } finally {
      setIsSending(false);
    }
  };

  // Reply Setup
  const handleReply = () => {
    if (!selectedEmail) return;
    setComposeData({
      to: selectedEmail.senderEmail || "",
      subject: selectedEmail.subject?.startsWith("Re:")
        ? selectedEmail.subject
        : `Re: ${selectedEmail.subject || ""}`,
      body: `\n\n--- Original Message ---\nFrom: ${selectedEmail.senderName} <${selectedEmail.senderEmail}>\nDate: ${new Date(
        selectedEmail.createdAt
      ).toLocaleString()}\n\n${selectedEmail.body || ""}`,
    });
    setIsComposing(true);
  };

  // Sync Emails via IMAP
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/emails/sync", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setSuccessToast(json.message || "Synced new emails");
        setTimeout(() => setSuccessToast(""), 3500);
        fetchEmails(folder, 1);
      } else {
        alert("Sync status: " + (json.error || json.message || "Ready"));
      }
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter emails by search query in memory
  const filteredEmails = useMemo(() => {
    if (!searchQuery.trim()) return emails;
    const q = searchQuery.toLowerCase();
    return emails.filter(
      (em) =>
        (em.senderName && em.senderName.toLowerCase().includes(q)) ||
        (em.senderEmail && em.senderEmail.toLowerCase().includes(q)) ||
        (em.recipientEmail && em.recipientEmail.toLowerCase().includes(q)) ||
        (em.subject && em.subject.toLowerCase().includes(q)) ||
        (em.body && em.body.toLowerCase().includes(q))
    );
  }, [emails, searchQuery]);

  return (
    <div className="h-[calc(100vh-125px)] w-full flex flex-col bg-white rounded-2xl shadow-xs border border-[#E8DDD0] overflow-hidden relative">
      {/* Success Notification Pill */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-[#4A6741] text-white px-4 py-2 rounded-full shadow-lg text-xs font-semibold"
          >
            <CheckCircle2 size={14} />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden">
        {/* 1. Left Folder Sidebar */}
        <div className="w-56 sm:w-60 bg-[#FAF7F2] border-r border-[#E8DDD0] flex flex-col shrink-0">
          <div className="p-4">
            <button
              onClick={() => {
                setComposeData({ to: "", subject: "", body: "" });
                setIsComposing(true);
              }}
              className="w-full bg-[#1C1C1A] text-white rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold hover:bg-[#4A6741] transition-all shadow-xs cursor-pointer group"
            >
              <Edit3 size={15} className="group-hover:rotate-12 transition-transform" />
              <span>Compose</span>
            </button>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            <button
              onClick={() => handleFolderChange("inbox")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                folder === "inbox"
                  ? "bg-white text-[#4A6741] font-bold shadow-xs border border-[#E8DDD0]/80"
                  : "text-[#6B6560] hover:bg-black/5 font-medium"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox size={16} />
                <span>Inbox</span>
              </div>
              {unreadCount > 0 && (
                <span className="bg-[#4A6741] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleFolderChange("sent")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                folder === "sent"
                  ? "bg-white text-[#4A6741] font-bold shadow-xs border border-[#E8DDD0]/80"
                  : "text-[#6B6560] hover:bg-black/5 font-medium"
              }`}
            >
              <Send size={16} />
              <span>Sent</span>
            </button>

            <button
              onClick={() => handleFolderChange("starred")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                folder === "starred"
                  ? "bg-white text-[#4A6741] font-bold shadow-xs border border-[#E8DDD0]/80"
                  : "text-[#6B6560] hover:bg-black/5 font-medium"
              }`}
            >
              <Star
                size={16}
                className={folder === "starred" ? "fill-[#D4AF37] text-[#D4AF37]" : ""}
              />
              <span>Starred</span>
            </button>

            <button
              onClick={() => handleFolderChange("trash")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                folder === "trash"
                  ? "bg-white text-[#4A6741] font-bold shadow-xs border border-[#E8DDD0]/80"
                  : "text-[#6B6560] hover:bg-black/5 font-medium"
              }`}
            >
              <Trash2 size={16} />
              <span>Trash</span>
            </button>
          </nav>

          <div className="p-4 border-t border-[#E8DDD0] text-[11px] text-[#9E9088] flex items-center justify-between">
            <span>Mail Channel</span>
            <span className="font-semibold text-[#4A6741]">Connected</span>
          </div>
        </div>

        {/* 2. Middle Email List Pane */}
        <div
          className={`flex flex-col border-r border-[#E8DDD0] bg-white transition-all duration-200 shrink-0 ${
            selectedEmail
              ? "hidden md:flex md:w-[360px] lg:w-[400px]"
              : "flex w-full"
          }`}
        >
          {/* Header & Controls */}
          <div className="p-3.5 border-b border-[#E8DDD0] flex flex-col gap-2.5 bg-[#FAF7F2]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1C1C1A] capitalize tracking-tight font-serif">
                  {folder}
                </h2>
                <span className="text-xs text-[#9E9088]">
                  ({filteredEmails.length})
                </span>
              </div>

              {folder === "inbox" && (
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1C1A] bg-white px-2.5 py-1 rounded-lg border border-[#E8DDD0] hover:bg-[#FAF7F2] transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                  title="Check and pull latest emails"
                >
                  <RefreshCw
                    size={12}
                    className={isSyncing ? "animate-spin text-[#4A6741]" : ""}
                  />
                  <span>{isSyncing ? "Syncing..." : "Sync"}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9088]"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search sender, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#E8DDD0] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#1C1C1A] outline-none focus:ring-1 focus:ring-[#C8A97A] transition-all placeholder:text-[#9E9088]"
                />
              </div>

              {pagination.pages > 1 && (
                <div className="flex items-center gap-1 text-[#6B6560] shrink-0">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1 rounded hover:bg-[#FAF7F2] disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[11px] font-medium text-[#9E9088]">
                    {page}/{pagination.pages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page >= pagination.pages}
                    className="p-1 rounded hover:bg-[#FAF7F2] disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E8DDD0]/60">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-white border border-[#ECE6DF] space-y-2 animate-pulse"
                  >
                    <div className="flex justify-between">
                      <div className="h-3.5 w-28 bg-[#E8DDD0] rounded-md" />
                      <div className="h-3 w-12 bg-[#E8DDD0]/50 rounded-full" />
                    </div>
                    <div className="h-3 w-4/5 bg-[#E8DDD0]/70 rounded-md" />
                  </div>
                ))}
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-52 text-[#9E9088] p-6 text-center">
                <MailOpen size={36} className="mb-2 opacity-30 text-[#C8A97A]" />
                <p className="text-xs font-semibold text-[#1C1C1A]">No messages</p>
                <p className="text-[11px] text-[#9E9088] mt-0.5">
                  Your {folder} folder is clear
                </p>
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = selectedEmail?._id === email._id;
                const letter = (
                  folder === "sent"
                    ? email.recipientEmail?.[0]
                    : email.senderName?.[0] || email.senderEmail?.[0]
                )?.toUpperCase() || "K";

                return (
                  <div
                    key={email._id}
                    onClick={() => handleReadEmail(email)}
                    className={`p-3.5 cursor-pointer transition-all relative group flex gap-3 items-start ${
                      isSelected
                        ? "bg-[#FAF7F2] border-l-3 border-[#4A6741]"
                        : !email.isRead
                        ? "bg-white font-semibold border-l-3 border-[#C8A97A]"
                        : "bg-white/60 hover:bg-[#FAF7F2]/50 border-l-3 border-transparent"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                        !email.isRead ? "bg-[#4A6741]" : "bg-[#C8A97A]"
                      }`}
                    >
                      {letter}
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4
                          className={`text-xs truncate ${
                            !email.isRead
                              ? "font-bold text-[#1C1C1A]"
                              : "font-medium text-[#4A4541]"
                          }`}
                        >
                          {folder === "sent"
                            ? `To: ${email.recipientEmail}`
                            : email.senderName || email.senderEmail}
                        </h4>
                        <span className="text-[10px] text-[#9E9088] shrink-0 ml-2">
                          {new Date(email.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <h5
                        className={`text-xs truncate ${
                          !email.isRead ? "font-semibold text-[#1C1C1A]" : "text-[#6B6560]"
                        }`}
                      >
                        {email.subject || "(No Subject)"}
                      </h5>

                      <p className="text-[11px] text-[#9E9088] truncate mt-0.5">
                        {email.body
                          ?.replace(/<[^>]+>/g, "")
                          .replace(/&nbsp;/g, " ") || ""}
                      </p>
                    </div>

                    {/* Quick Hover Actions */}
                    <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleToggleStar(e, email)}
                        className={`p-1 rounded hover:bg-white border border-transparent hover:border-[#E8DDD0] ${
                          email.isStarred ? "opacity-100 text-[#D4AF37]" : "text-[#9E9088]"
                        }`}
                        title={email.isStarred ? "Unstar" : "Star"}
                      >
                        <Star
                          size={13}
                          className={email.isStarred ? "fill-[#D4AF37]" : ""}
                        />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, email._id)}
                        className="p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 3. Right Email View Pane */}
        {selectedEmail ? (
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Action Bar */}
            <div className="px-6 py-4 border-b border-[#E8DDD0] flex items-center justify-between bg-[#FAF7F2]/40">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="md:hidden p-1.5 rounded-lg text-[#1C1C1A] hover:bg-black/5"
                  title="Back to list"
                >
                  <ArrowLeft size={18} />
                </button>
                <h3 className="text-base sm:text-lg font-bold text-[#1C1C1A] truncate font-serif">
                  {selectedEmail.subject || "(No Subject)"}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReply}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#E8DDD0] text-[#1C1C1A] hover:bg-[#FAF7F2] hover:border-[#4A6741] transition-all cursor-pointer shadow-2xs"
                >
                  <Reply size={13} />
                  <span>Reply</span>
                </button>
                <button
                  onClick={(e) => handleDelete(e, selectedEmail._id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete email"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Sender Details */}
            <div className="px-6 py-4 border-b border-[#E8DDD0]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4A6741] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {(
                    selectedEmail.senderName?.[0] ||
                    selectedEmail.senderEmail?.[0] ||
                    "K"
                  ).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#1C1C1A]">
                      {selectedEmail.senderName || selectedEmail.senderEmail}
                    </p>
                    <span className="text-xs text-[#9E9088]">
                      &lt;{selectedEmail.senderEmail}&gt;
                    </span>
                  </div>
                  <p className="text-xs text-[#9E9088] mt-0.5">
                    to {selectedEmail.recipientEmail || "KrisluxECO Concierge"}
                  </p>
                </div>
              </div>

              <span className="text-xs text-[#9E9088] font-medium">
                {new Date(selectedEmail.createdAt).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>

            {/* Email Body */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto text-[#1C1C1A] text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {selectedEmail.body || ""}
            </div>

            {/* Quick Reply Bar */}
            <div className="p-4 border-t border-[#E8DDD0] bg-[#FAF7F2]/40">
              <button
                onClick={handleReply}
                className="w-full text-left bg-white border border-[#E8DDD0] rounded-xl px-4 py-2.5 text-xs text-[#9E9088] flex items-center gap-2 hover:border-[#4A6741] transition-all cursor-pointer shadow-2xs"
              >
                <Reply size={14} className="text-[#4A6741]" />
                <span>Click here to quickly draft a response...</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#FAF7F2]/30 text-center p-8">
            <div className="w-16 h-16 rounded-full bg-white border border-[#E8DDD0] flex items-center justify-center mb-3 shadow-xs">
              <Mail size={28} className="text-[#C8A97A]" />
            </div>
            <h4
              className="text-base font-bold text-[#1C1C1A]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              No Conversation Selected
            </h4>
            <p className="text-xs text-[#9E9088] mt-1 max-w-xs">
              Select an incoming customer inquiry or dispatch an email from the left list.
            </p>
          </div>
        )}
      </div>

      {/* 4. Luxury Compose Modal */}
      <AnimatePresence>
        {isComposing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-[#E8DDD0] flex flex-col"
            >
              <div className="px-5 py-3.5 border-b border-[#E8DDD0] flex justify-between items-center bg-[#FAF7F2]">
                <h3
                  className="font-bold text-base text-[#1C1C1A]"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  New Dispatch
                </h3>
                <button
                  onClick={() => setIsComposing(false)}
                  className="text-[#9E9088] hover:text-[#1C1C1A] p-1 rounded-md transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSend} className="flex flex-col flex-1">
                <div className="px-5 py-2.5 border-b border-[#E8DDD0]">
                  <input
                    type="email"
                    required
                    placeholder="Recipient email (To:)"
                    value={composeData.to}
                    onChange={(e) =>
                      setComposeData({ ...composeData, to: e.target.value })
                    }
                    className="w-full bg-transparent outline-none text-xs text-[#1C1C1A] placeholder:text-[#9E9088]"
                  />
                </div>
                <div className="px-5 py-2.5 border-b border-[#E8DDD0]">
                  <input
                    type="text"
                    required
                    placeholder="Subject"
                    value={composeData.subject}
                    onChange={(e) =>
                      setComposeData({ ...composeData, subject: e.target.value })
                    }
                    className="w-full bg-transparent outline-none text-xs font-semibold text-[#1C1C1A] placeholder:text-[#9E9088]"
                  />
                </div>
                <div className="p-5 flex-1 min-h-[220px]">
                  <textarea
                    required
                    placeholder="Write your email dispatch here..."
                    value={composeData.body}
                    onChange={(e) =>
                      setComposeData({ ...composeData, body: e.target.value })
                    }
                    className="w-full h-full bg-transparent outline-none resize-none text-xs text-[#1C1C1A] placeholder:text-[#9E9088] leading-relaxed"
                  />
                </div>
                <div className="px-5 py-3 bg-[#FAF7F2] border-t border-[#E8DDD0] flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="px-4 py-1.5 rounded-xl text-xs text-[#6B6560] font-medium hover:bg-black/5 transition-colors cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-1.5 rounded-xl bg-[#4A6741] text-white text-xs font-semibold hover:bg-[#3d5535] transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {isSending ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Send size={14} />
                    )}
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
