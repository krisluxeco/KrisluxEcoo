"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, ExternalLink, ChevronRight, ShieldCheck } from "lucide-react";
import AdminSidebar, { navItems } from "./AdminSidebar";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AdminShell({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("admin-sidebar-collapsed") === "true";
      } catch {
        return false;
      }
    }
    return false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  // Find active navigation item title
  const currentItem = navItems.find(
    (item) =>
      item.href === pathname ||
      (item.href !== "/admin" && pathname?.startsWith(item.href))
  );
  const sectionTitle = currentItem ? currentItem.label : "Console";

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

  // Persist collapse preference
  useEffect(() => {
    try {
      localStorage.setItem("admin-sidebar-collapsed", String(collapsed));
    } catch {
      // ignore
    }
  }, [collapsed]);

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#E8DDD0] bg-[#FAF7F2]/90 backdrop-blur-md px-5 py-3.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-[#1C1C1A] p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/admin"
                className="text-[#9E9088] hover:text-[#1C1C1A] transition-colors font-medium"
              >
                Admin
              </Link>
              <ChevronRight size={14} className="text-[#9E9088]/60" />
              <span
                className="text-base font-bold text-[#1C1C1A] tracking-tight"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {sectionTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Link to Store */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-[#E8DDD0] text-[#4A6741] hover:bg-[#FAF7F2] hover:border-[#4A6741]/40 transition-all shadow-xs"
              title="Open storefront in new tab"
            >
              <span>View Store</span>
              <ExternalLink size={12} />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 outline-none focus:ring-2 focus:ring-[#C8A97A]/40 rounded-full cursor-pointer p-0.5"
                aria-label="Admin user menu"
              >
                {session?.user?.image ? (
                  <Image
                    width={40}
                    height={40}
                    src={session.user.image}
                    alt={session.user.name || "Admin"}
                    className="w-9 h-9 rounded-full object-cover border border-[#E8DDD0]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-sm font-semibold border border-[#E8DDD0] shadow-xs">
                    {session?.user?.name
                      ? session.user.name.charAt(0).toUpperCase()
                      : "A"}
                  </div>
                )}
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#E8DDD0] rounded-xl shadow-xl py-2 z-50 text-left">
                  <div className="px-4 py-2 border-b border-[#ECE6DF] mb-1">
                    <p className="text-[10px] text-[#9E9088] font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck size={12} className="text-[#4A6741]" />
                      Admin Console
                    </p>
                    <p className="text-sm font-semibold text-[#1C1C1A] truncate mt-0.5">
                      {session?.user?.name || "Administrator"}
                    </p>
                  </div>
                  <Link
                    href="/"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-[#1C1C1A] hover:bg-[#FAF7F2] transition-colors"
                  >
                    Storefront Home
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
          </div>
        </header>

        <main className="p-4 sm:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
