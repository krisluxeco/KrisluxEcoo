import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Reset password");

export default function Layout({ children }) {
  return children;
}
