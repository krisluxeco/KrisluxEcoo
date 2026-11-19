import LayoutWrapper from "@/components/LayoutWrapper";
import GoToTop from "@/components/GoToTop";
import "./globals.css";
import { Playfair_Display, Montserrat } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, CORE_KEYWORDS, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KrisluxECO | Handmade Water Hyacinth Products from Bihar, India",
    template: "%s | KrisluxECO",
  },
  description:
    "Handcrafted water hyacinth baskets, planters, storage, trays, hotel décor and eco-friendly corporate gifts — woven by women artisans in Begusarai, Bihar and delivered across India. Bulk & custom orders.",
  keywords: CORE_KEYWORDS,
  applicationName: "KrisluxECO",
  authors: [{ name: "KrisluxECO" }],
  creator: "KrisluxECO",
  publisher: "KrisluxECO",
  category: "Home & Garden",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: "KrisluxECO | Handmade Water Hyacinth Products from Bihar, India",
    description:
      "Handwoven water hyacinth baskets, planters, hotel décor and corporate gifts by women artisans in Bihar. Delivered across India.",
    url: SITE_URL,
    siteName: "KrisluxECO",
    images: [{ url: "/images/hero_hotel.png", width: 1200, height: 630, alt: "KrisluxECO handmade water hyacinth products" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KrisluxECO | Handmade Water Hyacinth Products from Bihar, India",
    description: "Handwoven water hyacinth baskets, planters, hotel décor and corporate gifts, delivered across India.",
    images: ["/images/hero_hotel.png"],
  },
  verification: {
    // Add these in your hosting environment after claiming the site in each console
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  other: { "geo.region": "IN-BR", "geo.placename": "Begusarai, Bihar, India" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-[#FAF7F2] text-[#1C1C1A]">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <LayoutWrapper>
          {children}
          <GoToTop />
        </LayoutWrapper>
      </body>
    </html>
  );
}
