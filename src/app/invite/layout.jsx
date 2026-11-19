import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Workshop invitation");

export default function Layout({ children }) {
  return children;
}
