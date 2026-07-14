"use client";
import Image from "next/image";

import { useState, useEffect } from "react";
import { Loader2, ExternalLink } from "lucide-react";

export default function AdminCustomDesigns() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/custom-designs", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setRequests(data.requests);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/custom-designs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
      if (selectedRequest && selectedRequest._id === id) {
        setSelectedRequest((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C8A97A]" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-[#1C1C1A] mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Custom Design Requests
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-[#ECE6DF] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] text-[#9E9088] text-xs uppercase tracking-wider border-b border-[#ECE6DF]">
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {requests.map((req) => (
                <tr key={req._id} className="border-b border-[#ECE6DF] hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="px-6 py-4 text-[#6B6560]">
                    {new Date(req.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-medium text-[#1C1C1A]">
                    {req.name}
                  </td>
                  <td className="px-6 py-4 text-[#6B6560]">
                    <div className="truncate max-w-[150px]">{req.email}</div>
                    <div className="text-xs text-[#9E9088]">{req.phone || "No phone"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={req.status}
                      onChange={(e) => updateStatus(req._id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full outline-none cursor-pointer border ${
                        req.status === "Pending" ? "bg-amber-100 text-amber-800 border-amber-200" :
                        req.status === "Reviewed" ? "bg-blue-100 text-blue-800 border-blue-200" :
                        "bg-green-100 text-green-800 border-green-200"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4A6741] hover:text-[#3a5233] transition-colors"
                    >
                      View Details <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#9E9088]">
                    No custom design requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for viewing request details */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#ECE6DF] flex items-center justify-between bg-[#FAF7F2]">
              <h3 className="text-lg font-semibold text-[#1C1C1A]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Request Details
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-[#9E9088] hover:text-[#1C1C1A]"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9E9088] font-semibold mb-1">Customer Name</p>
                  <p className="text-[#1C1C1A]">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9E9088] font-semibold mb-1">Submitted On</p>
                  <p className="text-[#1C1C1A]">{new Date(selectedRequest.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9E9088] font-semibold mb-1">Email</p>
                  <a href={`mailto:${selectedRequest.email}`} className="text-[#4A6741] hover:underline">{selectedRequest.email}</a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9E9088] font-semibold mb-1">Phone</p>
                  <p className="text-[#1C1C1A]">{selectedRequest.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9E9088] font-semibold mb-2">Design Description & Requirements</p>
                  <div className="bg-[#FAF7F2] border border-[#ECE6DF] p-4 rounded-xl text-[#1C1C1A] text-sm whitespace-pre-wrap leading-relaxed">
                    {selectedRequest.description}
                  </div>
                </div>

                {selectedRequest.imageUrl && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#9E9088] font-semibold mb-2">Reference Image</p>
                    <div className="rounded-xl overflow-hidden border border-[#ECE6DF] inline-block">
                      <Image width={800} height={800} 
                        src={selectedRequest.imageUrl} 
                        alt="Reference" 
                        className="max-w-full max-h-64 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#ECE6DF] bg-gray-50 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#9E9088] uppercase tracking-wider">Update Status:</span>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => updateStatus(selectedRequest._id, e.target.value)}
                  className="text-sm font-medium px-3 py-1.5 rounded-lg border border-[#ECE6DF] outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-[#1C1C1A] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
