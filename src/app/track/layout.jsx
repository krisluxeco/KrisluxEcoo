import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Track Your Order — Live Production & Delivery Status",
  description: "Enter your KrisluxECO tracking ID (KLX-…) to follow your handmade water hyacinth order from artisan production in Bihar to dispatch and delivery anywhere in India.",
  path: "/track",
  keywords: ["track order", "order tracking", "KrisluxECO tracking"],
});

export default function Layout({ children }) {
  return children;
}
