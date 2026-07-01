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
  title: "KrisluxECO | Premium Sustainable Handcrafted Products",
  description:
    "KrisluxECO combines traditional craftsmanship with environmental responsibility. We develop high-quality, eco-friendly handcrafted products using natural, recyclable, and sustainable materials.",
  keywords: [
    "Sustainable luxury",
    "Handcrafted products",
    "Eco-friendly home decor",
    "Corporate gifting",
    "Biodegradable amenities",
    "Bihar artisans",
    "Water hyacinth craft",
  ],
  openGraph: {
    title: "KrisluxECO | Premium Sustainable Handcrafted Products",
    description:
      "KrisluxECO combines traditional craftsmanship with environmental responsibility. Discover high-quality, eco-friendly handcrafted products.",
    url: "https://krisluxeco.com",
    siteName: "KrisluxECO",
    images: [
      {
        url: "/images/hero_hotel.png", // Example default sharing image
        width: 1200,
        height: 630,
        alt: "KrisluxECO Premium Sustainable Products",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KrisluxECO | Premium Sustainable Handcrafted Products",
    description:
      "Discover high-quality, eco-friendly handcrafted products by KrisluxECO.",
    images: ["/images/hero_hotel.png"],
  },
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
