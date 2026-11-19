import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sustainability & Impact — Cleaner Rivers, Women's Livelihoods",
  description: "Our environmental and social impact: removing invasive water hyacinth from Bihar's waterways, replacing plastic with biodegradable products and creating skilled work for women artisans.",
  path: "/user/sustainability",
  keywords: ["sustainable products India", "plastic-free alternatives", "social impact handicrafts"],
});

export default function Layout({ children }) {
  return children;
}
