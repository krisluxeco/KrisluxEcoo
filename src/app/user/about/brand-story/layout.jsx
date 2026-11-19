import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Story — From River Weed to Handmade Luxury",
  description: "How KrisluxECO turns water hyacinth from Bihar's rivers into handcrafted baskets, planters and décor — the people, the process and the purpose.",
  path: "/user/about/brand-story",
  keywords: ["KrisluxECO story", "water hyacinth craft story", "Begusarai handicrafts"],
});

export default function Layout({ children }) {
  return children;
}
