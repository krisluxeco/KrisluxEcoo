"use client";
import Image from "next/image";

import { useEffect, useState, useRef } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AdminShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Persist collapse preference across visits
  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-[#E8DDD0] bg-[#FAF7F2]/90 backdrop-blur-md px-5 py-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-[#1C1C1A]"
          >
            <Menu size={22} />
          </button>
          <h1
            className="text-lg font-semibold text-[#1C1C1A]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Admin
          </h1>
          <div className="ml-auto flex items-center gap-3 relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center outline-none focus:ring-2 focus:ring-[#C8A97A]/40 rounded-full cursor-pointer"
            >
              {session?.user?.image ? (
                <Image width={800} height={800}
                  src={session.user.image}
                  alt={session.user.name || "Admin"}
                  className="w-9 h-9 rounded-full object-cover border border-[#E8DDD0]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-sm font-medium border border-[#E8DDD0]">
                  {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "A"}
                </div>
              )}
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E8DDD0] rounded-xl shadow-lg py-2 z-50 text-left">
                <div className="px-4 py-2 border-b border-[#ECE6DF] mb-1">
                  <p className="text-[10px] text-[#9E9088] font-medium uppercase tracking-wider">Admin Console</p>
                  <p className="text-sm font-semibold text-[#1C1C1A] truncate">{session?.user?.name || "Administrator"}</p>
                </div>
                <Link
                  href="/"
                  className="block px-4 py-2 text-xs text-[#1C1C1A] hover:bg-[#FAF7F2] transition-colors"
                >
                  Store Home
                </Link>
                <Link
                  href="/admin/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="block px-4 py-2 text-xs text-[#1C1C1A] hover:bg-[#FAF7F2] transition-colors"
                >
                  Admin Profile
                </Link>
                <hr className="border-[#ECE6DF] my-1" />
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}