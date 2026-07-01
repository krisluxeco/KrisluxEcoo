"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

import { SessionProvider } from "next-auth/react";
import Footer from "./Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  return (
    <SessionProvider>
      {!hideNavbar && <NavBar />}
      {children}
      {!hideNavbar && <Footer />}
    </SessionProvider>
  );
}