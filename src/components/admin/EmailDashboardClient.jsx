"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, Send, Trash2, Edit3, Mail, MailOpen, Trash, Reply, X, Loader2, RefreshCw, Search, Star, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";

export default function EmailDashboardClient() {
  const [folder, setFolder] = useState("inbox");
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ to: "", subject: "", body: "" });
  const [isSending, setIsSending] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch Emails
  const fetchEmails = async (currentFolder = folder, currentPage = page) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/emails?folder=${currentFolder}&page=${currentPage}&limit=20`);
      const json = await res.json();
      if (json.success) {
        setEmails(json.data);
        setPagination(json.pagination);
        setUnreadCount(json.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1); // Reset page on folder change
    fetchEmails(folder, 1);
    setSelectedEmail(null);
  }, [folder]);
  
  useEffect(() => {
    if (page > 1) fetchEmails(folder, page);
  }, [page]);

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
        // Update local state
        setEmails((prev) => prev.map((e) => (e._id === email._id ? { ...e, isRead: true } : e)));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Failed to mark read:", error);
      }
    }
  };

  // Delete Email
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent opening the email
    try {
      await fetch(`/api/admin/emails/${id}`, { method: "DELETE" });
      if (selectedEmail?._id === id) setSelectedEmail(null);
      fetchEmails();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  // Toggle Star
  const handleToggleStar = async (e, email) => {
    e.stopPropagation();
    try {
      const newStarredStatus = !email.isStarred;
      await fetch(`/api/admin/emails/${email._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: newStarredStatus }),
      });
      // Update local state
      setEmails((prev) => prev.map((e) => (e._id === email._id ? { ...e, isStarred: newStarredStatus } : e)));
      if (selectedEmail?._id === email._id) {
        setSelectedEmail({ ...selectedEmail, isStarred: newStarredStatus });
      }
      if (folder === "starred" && !newStarredStatus) {
        fetchEmails(); // Remove from view if in starred folder
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
        if (folder === "sent") fetchEmails();
      } else {
        alert("Failed to send: " + json.error);
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("An error occurred while sending the email.");
    }
    setIsSending(false);
  };

  // Reply Setup
  const handleReply = () => {
    if (!selectedEmail) return;
    setComposeData({
      to: selectedEmail.senderEmail,
      subject: `Re: ${selectedEmail.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${selectedEmail.senderName} <${selectedEmail.senderEmail}>\n\n${selectedEmail.body}`,
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
        // Refresh the inbox to show the newly synced emails
        if (folder === "inbox") fetchEmails("inbox");
      } else {
        alert("Failed to sync: " + json.error);
      }
    } catch (error) {
      console.error("Sync error:", error);
    }
    setIsSyncing(false);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex bg-white rounded-2xl shadow-sm border border-[#E8DDD0] overflow-hidden m-6">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#FAF7F2] border-r border-[#E8DDD0] flex flex-col">
        <div className="p-6">
          <button
            onClick={() => setIsComposing(true)}
            className="w-full bg-[#1C1C1A] text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-medium hover:bg-[#8B2935] transition-colors shadow-sm"
          >
            <Edit3 size={18} /> Compose
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => setFolder("inbox")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${folder === "inbox" ? "bg-[#F4EFE6] text-[#8B2935] font-semibold" : "text-[#6B6560] hover:bg-black/5"}`}
          >
            <div className="flex items-center gap-3">
              <Inbox size={18} /> <span className="font-medium">Inbox</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-[#8B2935] text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </button>
          
          <button
            onClick={() => setFolder("sent")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${folder === "sent" ? "bg-[#F4EFE6] text-[#8B2935] font-semibold" : "text-[#6B6560] hover:bg-black/5"}`}
          >
            <Send size={18} /> <span className="font-medium">Sent</span>
          </button>
          
          <button
            onClick={() => setFolder("starred")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${folder === "starred" ? "bg-[#F4EFE6] text-[#8B2935] font-semibold" : "text-[#6B6560] hover:bg-black/5"}`}
          >
            <Star size={18} className={folder === "starred" ? "fill-[#8B2935] text-[#8B2935]" : ""} /> <span className="font-medium">Starred</span>
          </button>
          
          <button
            onClick={() => setFolder("trash")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${folder === "trash" ? "bg-[#F4EFE6] text-[#8B2935] font-semibold" : "text-[#6B6560] hover:bg-black/5"}`}
          >
            <Trash2 size={18} /> <span className="font-medium">Trash</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Email List */}
        <div className={`flex flex-col border-r border-[#E8DDD0] bg-white transition-all duration-300 ${selectedEmail ? 'w-[400px]' : 'w-full'}`}>
          <div className="p-4 border-b border-[#E8DDD0] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-[#1C1C1A] capitalize">{folder}</h2>
              {folder === "inbox" && (
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="flex items-center gap-2 text-sm text-[#6B6560] hover:text-[#1C1C1A] bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#E8DDD0] disabled:opacity-50 transition-colors"
                  title="Pull external emails from Gmail"
                >
                  <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                  <span className="font-medium">{isSyncing ? "Syncing..." : "Sync"}</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search Bar Placeholder */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9088]" size={16} />
                <input 
                  type="text" 
                  placeholder="Search mail" 
                  className="w-full bg-[#FAF7F2] border border-[#E8DDD0] rounded-xl pl-9 pr-4 py-2 text-sm text-[#1C1C1A] outline-none focus:ring-2 focus:ring-[#8B2935]/20 transition-all"
                />
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center gap-2 shrink-0 text-[#6B6560]">
                <span className="text-xs font-medium mr-2">
                  {pagination.total > 0 ? `${(page - 1) * 20 + 1}-${Math.min(page * 20, pagination.total)} of ${pagination.total}` : "0-0 of 0"}
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
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-[#9E9088]">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-[#9E9088]">
                <MailOpen size={48} className="mb-4 opacity-20" />
                <p>No emails in {folder}</p>
              </div>
            ) : (
              <ul className="divide-y divide-[#E8DDD0]/50">
                {emails.map((email) => {
                  const avatarLetter = (folder === "sent" ? email.recipientEmail[0] : email.senderName[0])?.toUpperCase() || "?";
                  return (
                  <li
                    key={email._id}
                    onClick={() => handleReadEmail(email)}
                    className={`p-4 cursor-pointer transition-all relative group flex gap-3 items-start ${selectedEmail?._id === email._id ? 'bg-[#F4EFE6] border-l-4 border-[#8B2935]' : !email.isRead ? 'bg-white border-l-4 border-transparent' : 'bg-[#FAF7F2]/30 border-l-4 border-transparent'} hover:bg-[#FAF7F2]`}
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm ${!email.isRead ? 'bg-[#8B2935]' : 'bg-[#C8A97A]'}`}>
                      {avatarLetter}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className={`text-sm truncate pr-2 ${!email.isRead ? 'text-[#1C1C1A] font-bold' : 'text-[#4A4541] font-medium'}`}>
                          {folder === "sent" ? `To: ${email.recipientEmail}` : email.senderName}
                        </h4>
                        <span className={`text-[11px] whitespace-nowrap ${!email.isRead ? 'text-[#8B2935] font-semibold' : 'text-[#9E9088]'}`}>
                          {new Date(email.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      
                      <h5 className={`text-sm truncate mb-1 ${!email.isRead ? 'text-[#1C1C1A] font-semibold' : 'text-[#6B6560]'}`}>
                        {email.subject}
                      </h5>
                      <p className="text-xs text-[#9E9088] truncate pr-8">{email.body.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleToggleStar(e, email)}
                        className={`p-2 bg-white rounded-full shadow-sm hover:bg-yellow-50 border border-[#E8DDD0] ${email.isStarred ? 'opacity-100 text-[#F59E0B] border-[#F59E0B]/30' : 'text-[#9E9088]'}`}
                        title={email.isStarred ? "Unstar" : "Star"}
                      >
                        <Star size={14} className={email.isStarred ? "fill-[#F59E0B]" : ""} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, email._id)}
                        className="p-2 bg-white rounded-full shadow-sm text-red-500 hover:bg-red-50 border border-[#E8DDD0]"
                        title={folder === 'trash' ? "Delete Permanently" : "Move to Trash"}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                    
                    {/* Unread indicator dot */}
                    {!email.isRead && (
                      <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#8B2935] rounded-full group-hover:hidden shadow-sm" />
                    )}
                    {/* Star indicator dot for non-hovered state if starred */}
                    {email.isRead && email.isStarred && (
                      <div className="absolute top-4 right-4 text-[#F59E0B] group-hover:hidden">
                         <Star size={12} className="fill-[#F59E0B]" />
                      </div>
                    )}
                  </li>
                )})}
              </ul>
            )}
          </div>
        </div>

        {/* Email Reading Pane */}
        {selectedEmail ? (
          <div className="flex-1 flex flex-col bg-white">
            <div className="px-8 py-6 border-b border-[#E8DDD0] flex justify-between items-start bg-[#FAF7F2]/30">
              <h2 className="text-[22px] leading-tight font-serif font-bold text-[#1C1C1A] pr-4">{selectedEmail.subject}</h2>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleReply}
                  className="p-2.5 text-[#6B6560] hover:text-[#1C1C1A] hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-[#E8DDD0]"
                  title="Reply"
                >
                  <Reply size={18} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, selectedEmail._id)}
                  className="p-2.5 text-[#6B6560] hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100"
                  title={folder === 'trash' ? "Delete Permanently" : "Move to Trash"}
                >
                  <Trash2 size={18} />
                </button>
                <button
                  className="p-2.5 text-[#6B6560] hover:text-[#1C1C1A] hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-[#E8DDD0]"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
            
            <div className="px-8 py-5 flex items-center justify-between border-b border-[#E8DDD0]/50">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${!selectedEmail.isRead ? 'bg-[#8B2935]' : 'bg-[#C8A97A]'}`}>
                  {folder === "sent" ? selectedEmail.recipientEmail[0].toUpperCase() : selectedEmail.senderName[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#1C1C1A]">
                      {folder === "sent" ? selectedEmail.recipientEmail : selectedEmail.senderName}
                    </p>
                    <button
                        onClick={(e) => handleToggleStar(e, selectedEmail)}
                        className={`${selectedEmail.isStarred ? 'text-[#F59E0B]' : 'text-[#E8DDD0] hover:text-[#9E9088]'} transition-colors`}
                        title={selectedEmail.isStarred ? "Unstar" : "Star"}
                      >
                        <Star size={16} className={selectedEmail.isStarred ? "fill-[#F59E0B]" : ""} />
                    </button>
                  </div>
                  <p className="text-sm text-[#6B6560]">
                    <span className="text-[#9E9088]">to</span> {folder === "sent" ? selectedEmail.recipientEmail : 'me'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#9E9088] font-medium">
                {new Date(selectedEmail.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto">
              <div 
                className="prose prose-sm md:prose-base max-w-none text-[#1C1C1A] font-sans leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedEmail.body.replace(/\n/g, '<br/>') }}
              />
            </div>
            
            {/* Quick Reply Box */}
            <div className="p-6 border-t border-[#E8DDD0] bg-[#FAF7F2]/50">
              <button 
                onClick={handleReply}
                className="w-full text-left bg-white border border-[#E8DDD0] rounded-xl p-4 text-[#9E9088] flex items-center gap-3 hover:shadow-sm transition-all hover:border-[#C8A97A]"
              >
                <Reply size={18} /> Click here to reply...
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#FAF7F2]/30 text-[#9E9088]">
            <div className="w-24 h-24 rounded-full bg-[#E8DDD0]/50 flex items-center justify-center mb-6">
              <Mail size={40} className="text-[#C8A97A]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1C1A] mb-2">No email selected</h3>
            <p>Select an email from the list to view its contents.</p>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {isComposing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#E8DDD0] flex flex-col"
            >
              <div className="px-6 py-4 border-b border-[#E8DDD0] flex justify-between items-center bg-[#FAF7F2]">
                <h3 className="font-serif font-bold text-lg text-[#1C1C1A]">New Message</h3>
                <button onClick={() => setIsComposing(false)} className="text-[#9E9088] hover:text-[#1C1C1A] transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSend} className="flex flex-col flex-1">
                <div className="px-6 py-3 border-b border-[#E8DDD0]">
                  <input
                    type="email"
                    required
                    placeholder="To"
                    value={composeData.to}
                    onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                    className="w-full bg-transparent outline-none text-[#1C1C1A] placeholder-[#9E9088]"
                  />
                </div>
                <div className="px-6 py-3 border-b border-[#E8DDD0]">
                  <input
                    type="text"
                    required
                    placeholder="Subject"
                    value={composeData.subject}
                    onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                    className="w-full bg-transparent outline-none text-[#1C1C1A] font-medium placeholder-[#9E9088]"
                  />
                </div>
                <div className="p-6 flex-1 min-h-[300px]">
                  <textarea
                    required
                    placeholder="Write your message..."
                    value={composeData.body}
                    onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                    className="w-full h-full bg-transparent outline-none resize-none text-[#1C1C1A] placeholder-[#9E9088]"
                  />
                </div>
                <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#E8DDD0] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="px-6 py-2 rounded-xl text-[#6B6560] font-medium hover:bg-black/5 transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-6 py-2 rounded-xl bg-[#8B2935] text-white font-medium hover:bg-[#72202a] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    Send
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
