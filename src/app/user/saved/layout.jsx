import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Saved products");

export default function Layout({ children }) {
  return children;
}
