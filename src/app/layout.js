
import NavBar from "@/components/NavBar";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";


export const metadata = {
  title: "KrisluxEco | Premium Sustainable Handcrafted Products",
  description: "KrisluxEco combines traditional craftsmanship with environmental responsibility. We develop high-quality, eco-friendly handcrafted products using natural, recyclable, and sustainable materials.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      
    >
      
      <LayoutWrapper>
        <body className="min-h-full flex flex-col">{children}</body>
      </LayoutWrapper>
    </html>
  );
}
