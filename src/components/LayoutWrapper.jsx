"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideNavbar =
    pathname === "/login" ||
    pathname === "/register";

  return (
    <>
      {!hideNavbar && <NavBar />}
      {children}
    </>
  );
}