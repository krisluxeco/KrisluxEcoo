import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Custom Designs — Made-to-Order Water Hyacinth Products",
  description: "Request custom sizes, shapes and designs in handwoven water hyacinth for hotels, retail and corporate gifting. Upload your reference and get a quote.",
  path: "/user/custom-design",
  keywords: ["custom water hyacinth basket", "made to order handicrafts", "custom hotel decor"],
});

export default function Layout({ children }) {
  return children;
}
