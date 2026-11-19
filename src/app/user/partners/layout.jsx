import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Partners & Marketplaces",
  description: "The marketplaces, institutions and partners working with KrisluxECO to bring handmade water hyacinth products from Bihar to buyers across India.",
  path: "/user/partners",
  keywords: ["KrisluxECO partners", "handicraft marketplaces India"],
});

export default function Layout({ children }) {
  return children;
}
