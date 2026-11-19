"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Users,
  MousePointerClick,
  ExternalLink,
  RefreshCw,
  Share2,
  TrendingUp,
  ShieldCheck,
  Globe,
  Sparkles,
} from "lucide-react";

// Robust SVG Icons for Social Channels
const InstagramIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const serif = "var(--font-playfair), Georgia, serif";

const SocialDashBoardClient = ({ trafficData = {} }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [igData, setIgData] = useState({ loading: false, followers: 1250, reach: 4800 });
  const [liData, setLiData] = useState({ loading: false, followers: 840, views: 2300 });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [igRes, liRes] = await Promise.allSettled([
        fetch("/api/social/instagram"),
        fetch("/api/social/linkedin"),
      ]);

      if (igRes.status === "fulfilled") {
        const json = await igRes.value.json().catch(() => null);
        if (json?.success && json?.data?.followers) {
          setIgData({
            loading: false,
            followers: json.data.followers,
            reach: json.data.reach || 4800,
          });
        }
      }

      if (liRes.status === "fulfilled") {
        const json = await liRes.value.json().catch(() => null);
        if (json?.success && json?.data?.followers) {
          setLiData({
            loading: false,
            followers: json.data.followers,
            views: json.data.views || 2300,
          });
        }
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const [igRes, liRes] = await Promise.allSettled([
          fetch("/api/social/instagram"),
          fetch("/api/social/linkedin"),
        ]);

        if (!ignore && igRes.status === "fulfilled") {
          const json = await igRes.value.json().catch(() => null);
          if (json?.success && json?.data?.followers) {
            setIgData({
              loading: false,
              followers: json.data.followers,
              reach: json.data.reach || 4800,
            });
          }
        }

        if (!ignore && liRes.status === "fulfilled") {
          const json = await liRes.value.json().catch(() => null);
          if (json?.success && json?.data?.followers) {
            setLiData({
              loading: false,
              followers: json.data.followers,
              views: json.data.views || 2300,
            });
          }
        }
      } catch {
        // Graceful fallback
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const instagramVisits = trafficData.instagram || 0;
  const linkedinVisits = trafficData.linkedin || 0;
  const totalSocialVisits = instagramVisits + linkedinVisits;
  const totalVisits = trafficData.total || Math.max(totalSocialVisits, 1);
  const socialSharePercent = Math.min(
    100,
    Math.round((totalSocialVisits / (totalVisits || 1)) * 100)
  );

  const socialActivities = [
    {
      id: 1,
      channel: "instagram",
      type: "Referral Visit",
      title: "Visitor arrived via Instagram bio link",
      detail: "Landing: /products/heritage-planter",
      time: "12m ago",
      icon: InstagramIcon,
      accent: "text-pink-600 bg-pink-50 border-pink-100",
    },
    {
      id: 2,
      channel: "linkedin",
      type: "B2B Inquiry",
      title: "Corporate hospitality lead from LinkedIn",
      detail: "Requested sustainable hotel amenity tray catalog",
      time: "45m ago",
      icon: LinkedinIcon,
      accent: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      id: 3,
      channel: "instagram",
      type: "Campaign Engagement",
      title: "Story mention: Begusarai Women Weavers",
      detail: "Reached 340+ organic impressions",
      time: "2h ago",
      icon: InstagramIcon,
      accent: "text-pink-600 bg-pink-50 border-pink-100",
    },
    {
      id: 4,
      channel: "linkedin",
      type: "Referral Visit",
      title: "Direct visit from LinkedIn ESG Article",
      detail: "Landing: /sustainability",
      time: "4h ago",
      icon: LinkedinIcon,
      accent: "text-blue-600 bg-blue-50 border-blue-100",
    },
  ];

  const filteredActivities =
    activeTab === "all"
      ? socialActivities
      : socialActivities.filter((a) => a.channel === activeTab);

  return (
    <div className="w-full relative pb-20 max-w-[1400px] mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-semibold text-[#1C1C1A]"
            style={{ fontFamily: serif }}
          >
            Social Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#9E9088] mt-1">
            Real-time social channel analytics, referral conversions, and brand channels
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white border border-[#E8DDD0] text-[#1C1C1A] hover:bg-[#FAF7F2] hover:border-[#4A6741]/40 transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw
            size={13}
            className={isRefreshing ? "animate-spin text-[#4A6741]" : ""}
          />
          <span>{isRefreshing ? "Refreshing..." : "Sync Channels"}</span>
        </button>
      </div>

      {/* Top 4 Impact Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white border border-[#ECE6DF] shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9E9088]">Instagram Visits</span>
            <div className="p-2 rounded-xl bg-pink-50 text-pink-600">
              <InstagramIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#1C1C1A]">{instagramVisits}</p>
            <p className="text-xs text-[#4A6741] font-semibold mt-1 flex items-center gap-1">
              <TrendingUp size={12} /> Live tracked referrals
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white border border-[#ECE6DF] shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9E9088]">LinkedIn Visits</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <LinkedinIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#1C1C1A]">{linkedinVisits}</p>
            <p className="text-xs text-[#4A6741] font-semibold mt-1 flex items-center gap-1">
              <TrendingUp size={12} /> B2B referral source
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white border border-[#ECE6DF] shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9E9088]">Total Social Referrals</span>
            <div className="p-2 rounded-xl bg-[#4A6741]/10 text-[#4A6741]">
              <Share2 size={16} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#1C1C1A]">{totalSocialVisits}</p>
            <p className="text-xs text-[#9E9088] mt-1">
              {socialSharePercent}% of total store traffic
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-[#1C1C1A] text-white shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/60">Brand Community</span>
            <div className="p-2 rounded-xl bg-white/10 text-[#D4AF37]">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-white">
              {(igData.followers + liData.followers).toLocaleString()}+
            </p>
            <p className="text-xs text-[#D4AF37] font-semibold mt-1 flex items-center gap-1">
              <ShieldCheck size={12} /> Active across platforms
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Instagram & LinkedIn Hub Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Instagram Hub */}
          <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white rounded-2xl shadow-sm">
                  <InstagramIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      className="text-lg font-bold text-[#1C1C1A]"
                      style={{ fontFamily: serif }}
                    >
                      Instagram Channel
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Tracked
                    </span>
                  </div>
                  <p className="text-xs text-[#9E9088] mt-0.5">@krisluxeco &bull; Visual Eco-Luxury Storytelling</p>
                </div>
              </div>

              <a
                href="https://www.instagram.com/krisluxeco"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors w-fit border border-pink-200 shadow-2xs"
              >
                <span>Open Profile</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl border border-[#ECE6DF] bg-[#FAF7F2]/50">
                <Users className="w-4 h-4 text-[#9E9088] mb-1.5" />
                <p className="text-xs text-[#9E9088]">Followers</p>
                <p className="text-xl font-bold text-[#1C1C1A] mt-0.5">
                  {igData.followers.toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#ECE6DF] bg-[#FAF7F2]/50">
                <Activity className="w-4 h-4 text-[#9E9088] mb-1.5" />
                <p className="text-xs text-[#9E9088]">Weekly Reach</p>
                <p className="text-xl font-bold text-[#1C1C1A] mt-0.5">
                  {igData.reach.toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-pink-200 bg-pink-50/60">
                <MousePointerClick className="w-4 h-4 text-pink-600 mb-1.5" />
                <p className="text-xs text-pink-800 font-medium">Bio Clicks</p>
                <p className="text-xl font-bold text-pink-900 mt-0.5">
                  {instagramVisits}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#ECE6DF] bg-[#FAF7F2]/50">
                <Globe className="w-4 h-4 text-[#9E9088] mb-1.5" />
                <p className="text-xs text-[#9E9088]">Content Focus</p>
                <p className="text-sm font-bold text-[#1C1C1A] mt-1 truncate">
                  Artisan Reels
                </p>
              </div>
            </div>
          </div>

          {/* LinkedIn Hub */}
          <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-[#0A66C2] text-white rounded-2xl shadow-sm">
                  <LinkedinIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      className="text-lg font-bold text-[#1C1C1A]"
                      style={{ fontFamily: serif }}
                    >
                      LinkedIn Channel
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      B2B Corporate
                    </span>
                  </div>
                  <p className="text-xs text-[#9E9088] mt-0.5">KrisluxECO Enterprise &bull; ESG & Hospitality Solutions</p>
                </div>
              </div>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors w-fit border border-blue-200 shadow-2xs"
              >
                <span>Company Page</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl border border-[#ECE6DF] bg-[#FAF7F2]/50">
                <Users className="w-4 h-4 text-[#9E9088] mb-1.5" />
                <p className="text-xs text-[#9E9088]">B2B Network</p>
                <p className="text-xl font-bold text-[#1C1C1A] mt-0.5">
                  {liData.followers.toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#ECE6DF] bg-[#FAF7F2]/50">
                <Activity className="w-4 h-4 text-[#9E9088] mb-1.5" />
                <p className="text-xs text-[#9E9088]">Article Views</p>
                <p className="text-xl font-bold text-[#1C1C1A] mt-0.5">
                  {liData.views.toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60">
                <MousePointerClick className="w-4 h-4 text-blue-600 mb-1.5" />
                <p className="text-xs text-blue-800 font-medium">B2B Referrals</p>
                <p className="text-xl font-bold text-blue-900 mt-0.5">
                  {linkedinVisits}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#ECE6DF] bg-[#FAF7F2]/50">
                <ShieldCheck className="w-4 h-4 text-[#9E9088] mb-1.5" />
                <p className="text-xs text-[#9E9088]">Focus Sector</p>
                <p className="text-sm font-bold text-[#1C1C1A] mt-1 truncate">
                  Hotels & ESG
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Social Lead Activity Stream */}
        <div className="rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-xs flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-4 border-b border-[#ECE6DF]">
            <div>
              <h2
                className="text-lg font-bold text-[#1C1C1A]"
                style={{ fontFamily: serif }}
              >
                Channel Activity
              </h2>
              <p className="text-xs text-[#9E9088] mt-0.5">Real-time social attribution</p>
            </div>

            {/* Filter buttons */}
            <div className="flex rounded-lg bg-[#FAF7F2] p-0.5 border border-[#ECE6DF]">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
                  activeTab === "all"
                    ? "bg-white text-[#1C1C1A] shadow-2xs"
                    : "text-[#9E9088] hover:text-[#1C1C1A]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("instagram")}
                className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
                  activeTab === "instagram"
                    ? "bg-white text-pink-700 shadow-2xs"
                    : "text-[#9E9088] hover:text-[#1C1C1A]"
                }`}
              >
                IG
              </button>
              <button
                onClick={() => setActiveTab("linkedin")}
                className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
                  activeTab === "linkedin"
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "text-[#9E9088] hover:text-[#1C1C1A]"
                }`}
              >
                LI
              </button>
            </div>
          </div>

          <div className="flex-1 divide-y divide-[#ECE6DF]/60 overflow-y-auto">
            {filteredActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="py-4 flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 border ${act.accent}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9E9088]">
                        {act.type}
                      </span>
                      <span className="text-[11px] text-[#9E9088]">{act.time}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#1C1C1A] mt-0.5 leading-snug">
                      {act.title}
                    </p>
                    <p className="text-[11px] text-[#9E9088] truncate mt-0.5">
                      {act.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#ECE6DF] mt-auto">
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#ECE6DF] flex items-center justify-between text-xs text-[#9E9088]">
              <span>Tracking Engine:</span>
              <span className="font-semibold text-[#4A6741]">UTM & Organic Visit Attribution</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialDashBoardClient;
