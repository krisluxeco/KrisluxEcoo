import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Partner With Us — Share Your Catalogue",
  description: "Artisan groups, workshops and sustainable brands can share their product catalogue with KrisluxECO to collaborate on eco-friendly handmade products.",
  path: "/share-catalog",
  keywords: ["artisan partnership", "handicraft supplier collaboration", "sustainable brand partnership"],
});

export default function Layout({ children }) {
  return children;
}
