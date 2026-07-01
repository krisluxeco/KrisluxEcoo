"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

import { SessionProvider } from "next-auth/react";
import Footer from "./Footer";
import { ReactLenis } from "lenis/react";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  return (
    <SessionProvider>
      <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothTouch: false }}>
        {!hideNavbar && <NavBar />}
        {children}
        {!hideNavbar && <Footer />}
      </ReactLenis>
    </SessionProvider>
  );
}