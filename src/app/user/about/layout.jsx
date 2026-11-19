import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us — Water Hyacinth Craft by Women Artisans of Bihar",
  description: "KrisluxECO began in 2023 at IIT Patna to turn invasive water hyacinth from Begusarai's wetlands into handmade products, creating livelihoods for women artisans across Bihar.",
  path: "/user/about",
  keywords: ["about KrisluxECO", "Bihar women artisans", "water hyacinth startup India"],
});

export default function Layout({ children }) {
  return children;
}
