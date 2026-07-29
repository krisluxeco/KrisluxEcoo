"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, MessageSquare, Activity, Users, MousePointerClick, AlertCircle } from "lucide-react";

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

const serif = "'Cormorant Garamond', Georgia, serif";

const mockNotifications = [
  { id: 1, text: "New Instagram follower", time: "2m ago", source: "Instagram", icon: InstagramIcon, color: "text-pink-500", bg: "bg-pink-100" },
  { id: 2, text: "New LinkedIn connection", time: "15m ago", source: "LinkedIn", icon: LinkedinIcon, color: "text-blue-500", bg: "bg-blue-100" },
  { id: 3, text: "Instagram message received", time: "1h ago", source: "Instagram", icon: MessageSquare, color: "text-pink-500", bg: "bg-pink-100" },
  { id: 4, text: "LinkedIn post passed 1k views", time: "3h ago", source: "LinkedIn", icon: Activity, color: "text-blue-500", bg: "bg-blue-100" },
];

const liveSimulations = [
  { text: "🔴 New LinkedIn Message: Collaboration", color: "border-blue-500 bg-blue-50 text-blue-800" },
  { text: "🔴 Instagram Post reached 500 likes", color: "border-pink-500 bg-pink-50 text-pink-800" },
  { text: "🔴 New Instagram Lead Captured", color: "border-pink-500 bg-pink-50 text-pink-800" },
  { text: "🔴 New LinkedIn Lead: Corporate Gifting", color: "border-blue-500 bg-blue-50 text-blue-800" }
];

const SocialDashBoardClient = ({ trafficData }) => {
  const [liveToast, setLiveToast] = useState(null);
  
  // Live API States
  const [igData, setIgData] = useState({ loading: true, data: null, error: null });
  const [liData, setLiData] = useState({ loading: true, data: null, error: null });

  // Fetch Live Data
  useEffect(() => {
    const fetchSocialData = async () => {
      try {
        const [igRes, liRes] = await Promise.all([
          fetch('/api/social/instagram'),
          fetch('/api/social/linkedin')
        ]);
        
        const igJson = await igRes.json();
        const liJson = await liRes.json();

        setIgData({
          loading: false,
          data: igJson.success ? igJson.data : null,
          error: igJson.success ? null : igJson.error
        });

        setLiData({
          loading: false,
          data: liJson.success ? liJson.data : null,
          error: liJson.success ? null : liJson.error
        });

      } catch (err) {
        setIgData({ loading: false, data: null, error: "Failed to connect to server" });
        setLiData({ loading: false, data: null, error: "Failed to connect to server" });
      }
    };

    fetchSocialData();
  }, []);

  // Live Notification Simulator (Socket.IO UX)
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLiveToast(liveSimulations[index % liveSimulations.length]);
      index++;
      // Hide toast after 4 seconds
      setTimeout(() => setLiveToast(null), 4000);
    }, 12000); // Trigger every 12 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative pb-20">
      
      {/* Live Toast Simulator */}
      <AnimatePresence>
        {liveToast && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={`fixed top-24 right-6 z-50 p-4 rounded-xl shadow-2xl border-l-4 backdrop-blur-sm flex items-center gap-3 ${liveToast.color}`}
          >
            <Bell className="w-5 h-5 animate-pulse" />
            <span className="font-semibold text-sm">{liveToast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[1400px] mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#1C1C1A]" style={{ fontFamily: serif }}>
              Social Hub
            </h1>
            <p className="text-sm text-[#9E9088] mt-1">Live Instagram and LinkedIn Performance</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Social Stats */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Instagram Hub */}
            <motion.div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <InstagramIcon className="w-48 h-48 text-pink-500" />
              </div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
                  <InstagramIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#1C1C1A]" style={{ fontFamily: serif }}>Instagram Live</h2>
                    {igData.error && (
                      <span className="flex items-center gap-1 text-xs text-red-500 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                        <AlertCircle className="w-3 h-3" /> Keys Missing
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#9E9088]">Graph API Connection</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="p-4 rounded-xl border border-[#ECE6DF] bg-gray-50/50">
                  <Users className="w-5 h-5 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Followers</p>
                  <p className="text-2xl font-semibold text-[#1C1C1A]">
                    {igData.loading ? "..." : (igData.data?.followers?.toLocaleString() || "0")}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-[#ECE6DF] bg-gray-50/50">
                  <Activity className="w-5 h-5 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Reach (Live)</p>
                  <p className="text-2xl font-semibold text-[#1C1C1A]">
                    {igData.loading ? "..." : (igData.data?.reach?.toLocaleString() || "0")}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-pink-100 bg-pink-50">
                  <MousePointerClick className="w-5 h-5 text-pink-400 mb-2" />
                  <p className="text-sm text-pink-700 mb-1">Website Visits (Tracked)</p>
                  <p className="text-2xl font-semibold text-[#1C1C1A]">{trafficData?.instagram || 0}</p>
                </div>
                <div className="p-4 rounded-xl border border-[#ECE6DF] bg-gray-50/50">
                  <MessageSquare className="w-5 h-5 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Engagements</p>
                  <p className="text-2xl font-semibold text-[#1C1C1A]">
                    {igData.loading ? "..." : (igData.data?.engagements?.toLocaleString() || "0")}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* LinkedIn Hub */}
            <motion.div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <LinkedinIcon className="w-48 h-48 text-blue-600" />
              </div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <LinkedinIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#1C1C1A]" style={{ fontFamily: serif }}>LinkedIn Live</h2>
                    {liData.error && (
                      <span className="flex items-center gap-1 text-xs text-red-500 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                        <AlertCircle className="w-3 h-3" /> Keys Missing
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#9E9088]">Developer API Connection</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="p-4 rounded-xl border border-[#ECE6DF] bg-gray-50/50">
                  <Users className="w-5 h-5 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Followers</p>
                  <p className="text-2xl font-semibold text-[#1C1C1A]">
                    {liData.loading ? "..." : (liData.data?.followers?.toLocaleString() || "0")}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-[#ECE6DF] bg-gray-50/50">
                  <Activity className="w-5 h-5 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Post Views (Live)</p>
                  <p className="text-2xl font-semibold text-[#1C1C1A]">
                    {liData.loading ? "..." : (liData.data?.views?.toLocaleString() || "0")}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50">
                  <MousePointerClick className="w-5 h-5 text-blue-400 mb-2" />
                  <p className="text-sm text-blue-700 mb-1">Website Visits (Tracked)</p>
                  <p className="text-2xl font-semibold text-[#1C1C1A]">{trafficData?.linkedin || 0}</p>
                </div>
                <div className="p-4 rounded-xl border border-[#ECE6DF] bg-gray-50/50">
                  <MessageSquare className="w-5 h-5 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Lead Forms</p>
                  <p className="text-2xl font-semibold text-[#1C1C1A]">0</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Notifications Feed */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <motion.div className="flex-1 rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#1C1C1A]" style={{ fontFamily: serif }}>
                    Social Notifications
                  </h2>
                  <p className="text-sm text-[#9E9088]">Live updates</p>
                </div>
                <Bell className="h-5 w-5 text-[#C8A97A]" />
              </div>

              <div className="flex-1 overflow-y-auto pr-2 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#ECE6DF] before:to-transparent">
                <div className="relative z-10 flex flex-col gap-6">
                  {mockNotifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div key={notif.id} className="relative pl-12 md:pl-0 flex flex-col md:items-center">
                        <div className="md:hidden absolute left-0 top-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white ${notif.bg} ${notif.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>
                        
                        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1 w-10 h-10 rounded-full items-center justify-center border-4 border-white z-20 bg-white">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notif.bg} ${notif.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>

                        <div className="w-full md:w-[calc(50%-2.5rem)] md:ml-auto bg-gray-50 border border-[#ECE6DF] rounded-xl p-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{notif.source}</p>
                          <p className="text-sm text-[#1C1C1A] font-medium leading-snug">{notif.text}</p>
                          <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SocialDashBoardClient;

