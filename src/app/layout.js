import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata = {
  title: "KrisluxEco | Premium Sustainable Handcrafted Products",
  description:
    "KrisluxEco combines traditional craftsmanship with environmental responsibility. We develop high-quality, eco-friendly handcrafted products using natural, recyclable, and sustainable materials.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <LayoutWrapper>
        <body className="min-h-full flex flex-col font-sans bg-[#FAF7F2] text-[#1C1C1A]">
          {children}
        </body>
      </LayoutWrapper>
    </html>
  );
}
