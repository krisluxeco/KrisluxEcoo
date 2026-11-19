import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Quote cart");

export default function Layout({ children }) {
  return children;
}
