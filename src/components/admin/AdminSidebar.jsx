"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  ChevronLeft,
  X,
  User,
  LogOut,
  FileText,
  MessageSquare,
  Star,
  Activity,
  Mail,
  Briefcase,
  Factory,
} from "lucide-react";
import { signOut } from "next-auth/react";

export const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Production", href: "/admin/production", icon: Factory },
  { label: "B2B Leads", href: "/admin/leads", icon: Briefcase },
  { label: "Emails", href: "/admin/emails", icon: Mail },
  { label: "Social Hub", href: "/admin/social", icon: Activity },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Promos", href: "/admin/promos", icon: Tags },
  { label: "Custom Designs", href: "/admin/custom-designs", icon: MessageSquare },
  { label: "Catalogs", href: "/admin/catalogs", icon: Briefcase },
  { label: "Profile", href: "/admin/profile", icon: User },
];

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const pathname = usePathname();
  const scrollContainerRef = useRef(null);

  // Wheel forwarding ensures mouse scroll works everywhere on the sidebar (header, padding, etc.)
  const handleWheel = (e) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop += e.deltaY;
    }
  };

  const content = (
    <div
      onWheel={handleWheel}
      className="flex h-full flex-col bg-[#1C1C1A] text-white select-none relative"
    >
      {/* Sidebar Header / Brand Logo (Sticky at top) */}
      <div className="flex-shrink-0 flex items-center justify-between gap-3 px-5 py-5 border-b border-white/10 bg-[#1C1C1A] z-10">
        <Link
          href="/admin"
          className={`flex items-center gap-3 transition-opacity hover:opacity-90 ${
            collapsed ? "justify-center w-full" : ""
          }`}
          title="KrisluxECO Admin Dashboard"
        >
          <div className="relative w-9 h-7 flex-shrink-0">
            <Image
              src="/logotrans.png"
              alt="KrisluxECO"
              width={72}
              height={56}
              priority
              className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(218,165,32,0.35)]"
            />
          </div>
          {!collapsed && (
            <span
              className="font-semibold text-lg whitespace-nowrap tracking-wide"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Krislux<span className="bg-gradient-to-r from-[#D4AF37] via-[#FFF6C2] via-[#E5C07B] to-[#AA7A1E] bg-clip-text text-transparent font-extrabold drop-shadow-[0_1px_3px_rgba(218,165,32,0.4)]">ECO</span>
            </span>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <style jsx global>{`
        .custom-sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(212, 175, 55, 0.25) transparent;
          -webkit-overflow-scrolling: touch;
        }
        .custom-sidebar-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.22);
          border-radius: 9999px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>

      {/* Main Scrollable Navigation Area (with mouse-wheel scrolling) */}
      <div
        ref={scrollContainerRef}
        className="custom-sidebar-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain py-3 px-3 space-y-1"
        style={{ scrollBehavior: "smooth" }}
      >
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center ${
                collapsed ? "justify-center px-2" : "gap-3 px-3.5"
              } py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-[#4A6741] text-white shadow-sm shadow-[#4A6741]/30"
                  : "text-white/65 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 transition-transform duration-150 ${
                  active
                    ? "text-[#FFF6C2]"
                    : "text-white/70 group-hover:text-white group-hover:scale-110"
                }`}
              />
              {!collapsed && (
                <span className="whitespace-nowrap truncate">{item.label}</span>
              )}

              {/* Collapsed floating badge */}
              {collapsed && (
                <span className="absolute left-[calc(100%+8px)] hidden md:group-hover:flex items-center whitespace-nowrap rounded-lg bg-[#252522] border border-[#C8A97A]/30 text-white shadow-xl px-3 py-1.5 text-xs font-semibold z-50 pointer-events-none">
                  {item.label}
                </span>
              )}

              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#D4AF37]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* FIXED Bottom Footer Actions (Logout & Collapse - always pinned to bottom) */}
      <div className="flex-shrink-0 border-t border-white/10 px-3 py-2.5 bg-[#1C1C1A] z-10 space-y-1">
        {/* Logout button */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title={collapsed ? "Logout" : undefined}
          className={`group relative flex items-center ${
            collapsed ? "justify-center px-2" : "gap-3 px-3.5"
          } py-2 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 w-full text-left cursor-pointer`}
        >
          <LogOut
            size={18}
            className="flex-shrink-0 group-hover:scale-110 transition-transform"
          />
          {!collapsed && <span className="whitespace-nowrap">Logout</span>}
          {collapsed && (
            <span className="absolute left-[calc(100%+8px)] hidden md:group-hover:flex items-center whitespace-nowrap rounded-lg bg-[#252522] border border-red-500/30 text-red-300 shadow-xl px-3 py-1.5 text-xs font-semibold z-50 pointer-events-none">
              Logout
            </span>
          )}
        </button>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`hidden md:flex items-center ${
            collapsed ? "justify-center px-2" : "gap-2 px-3.5"
          } py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.08] text-xs font-medium transition-all duration-150 w-full cursor-pointer`}
        >
          <ChevronLeft
            size={16}
            className={`transition-transform duration-300 ${
              collapsed ? "rotate-180 text-[#D4AF37]" : ""
            }`}
          />
          {!collapsed && <span>Collapse</span>}
          {collapsed && (
            <span className="absolute left-[calc(100%+8px)] hidden md:group-hover:flex items-center whitespace-nowrap rounded-lg bg-[#252522] border border-[#C8A97A]/30 text-white shadow-xl px-3 py-1.5 text-xs font-semibold z-50 pointer-events-none">
              Expand
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 256 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden md:block h-screen sticky top-0 flex-shrink-0 border-r border-white/10 z-40 overflow-hidden"
      >
        {content}
      </motion.aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute left-0 top-0 h-full w-64 shadow-2xl"
          >
            {content}
          </motion.div>
        </div>
      )}
    </>
  );
}