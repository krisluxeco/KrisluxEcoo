"use client";

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
  Settings,
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
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
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
  // { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col bg-[#1C1C1A] text-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-6 border-b border-white/10">
        <div className="relative w-10 h-8 flex-shrink-0">
          <Image
            src="/logotrans.png"
            alt="KrisluxECO Logo"
            width={80}
            height={60}
            className="w-full h-full object-contain"
          />
        </div>
        {!collapsed && (
          <span
            className="font-semibold text-lg whitespace-nowrap"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Krislux<span className="text-[#8FBD84]">ECO</span>
          </span>
        )}
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto md:hidden text-white/60 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
      <nav className="custom-scrollbar flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${active
                ? "bg-[#4A6741] text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}

              {/* Tooltip when collapsed (desktop only) */}
              {collapsed && (
                <span className="absolute left-full ml-2 hidden md:group-hover:block whitespace-nowrap rounded-md bg-[#1C1C1A] border border-white/10 px-2.5 py-1.5 text-xs z-50">
                  {item.label}
                </span>
              )}

              {active && (
                <motion.span
                  layoutId="active-pill-edge"
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[#C8A97A]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 m-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-all font-medium text-left cursor-pointer w-[calc(100%-1.5rem)]"
      >
        <LogOut size={18} className="flex-shrink-0" />
        {!collapsed && <span className="whitespace-nowrap">Logout</span>}
      </button>

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex items-center gap-2 m-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 text-xs transition-all cursor-pointer"
      >
        <ChevronLeft
          size={16}
          className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        />
        {!collapsed && <span>Collapse</span>}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 248 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden md:block h-screen sticky top-0 flex-shrink-0 overflow-hidden border-r border-white/10"
      >
        {content}
      </motion.aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute left-0 top-0 h-full w-64"
          >
            {content}
          </motion.div>
        </div>
      )}
    </>
  );
}