import LayoutWrapper from "@/components/LayoutWrapper";
import GoToTop from "@/components/GoToTop";
import "./globals.css";
import { Playfair_Display, Montserrat } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
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
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-[#FAF7F2] text-[#1C1C1A]">
        <LayoutWrapper>
          {children}
          <GoToTop />
        </LayoutWrapper>
      </body>
    </html>
  );
}
