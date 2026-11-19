import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("My account");

export default function Layout({ children }) {
  return children;
}
