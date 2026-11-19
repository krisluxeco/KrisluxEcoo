import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Signing in");

export default function Layout({ children }) {
  return children;
}
