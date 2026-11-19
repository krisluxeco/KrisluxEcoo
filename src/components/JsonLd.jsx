import { jsonLdString } from "@/lib/seo";

/** Renders one or more JSON-LD blocks (server component). */
export default function JsonLd({ data }) {
  const blocks = Array.isArray(data) ? data : [data];
  return blocks.map((block, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(block) }} />
  ));
}
