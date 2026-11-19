import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Create account");

export default function Layout({ children }) {
  return children;
}
