import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Sign in");

export default function Layout({ children }) {
  return children;
}
