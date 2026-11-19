import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { getAllPosts } from "@/lib/blogData";
import { FAQ_SECTIONS } from "@/content/faqs";
import { LOCATIONS } from "@/content/locations";
import { BUSINESS, SITE_URL } from "@/lib/seo";

const htmlToText = (html = "") =>
  html
    .replace(/<h2[^>]*>/gi, "\n## ")
    .replace(/<h3[^>]*>/gi, "\n### ")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/(p|h2|h3|ul|ol|table|tr)>/gi, "\n")
    .replace(/<(td|th)[^>]*>/gi, " | ")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, (_, href, text) => `${text} (${href.startsWith("/") ? SITE_URL + href : href})`)
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const loadProducts = async () => {
  try {
    await connectDb();
    return await Product.find({ status: { $ne: "draft" } })
      .select("name category description price discountPrice minOrderQty leadTime")
      .sort({ category: 1, name: 1 })
      .lean();
  } catch {
    return [];
  }
};

const factsBlock = () => `## Key facts
- Brand: ${BUSINESS.name}
- What we make: handcrafted products woven from water hyacinth fibre — storage baskets, laundry baskets, planter baskets and hanging planters, trays, hotel room décor and amenity holders, gift hampers and corporate gifts. Custom designs available for bulk orders.
- Material: water hyacinth (Eichhornia crassipes), an invasive aquatic weed harvested from rivers and wetlands in Bihar, sun-cured and handwoven. Natural and biodegradable.
- Made by: women artisans in rural Bihar, India.
- Location: ${BUSINESS.address.streetAddress}, ${BUSINESS.address.addressLocality}, ${BUSINESS.address.addressRegion}, India.
- Founded: ${BUSINESS.foundingDate}, idea started at IIT Patna by founder ${BUSINESS.founder}.
- Who we serve: homes, hotels and resorts, restaurants and cafés, offices (corporate gifting), retailers and interior designers.
- Delivery: across all Indian states and union territories.
- Ordering: online quote cart, bulk/wholesale quotes (GSTIN supported), samples on request, custom designs.
- Order tracking: every order gets a KrisluxECO tracking ID (format KLX-XXXXXXXX), trackable at ${SITE_URL}/track with production stages, dispatch and delivery.
- Contact: phone/WhatsApp ${BUSINESS.phone}, email ${BUSINESS.email}.
- Social: ${BUSINESS.sameAs.join(", ")}`;

/** Short, link-rich index for AI agents (llms.txt convention). */
export async function buildLlmsTxt() {
  const [posts, products] = await Promise.all([getAllPosts(), loadProducts()]);
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return `# ${BUSINESS.name}

> ${BUSINESS.description}

${factsBlock()}

## Main pages
- [Home](${SITE_URL}/): brand overview and featured products
- [All products](${SITE_URL}/user/products): full catalogue with prices, MOQ and lead times${categories.length ? ` — categories: ${categories.join(", ")}` : ""}
- [Bulk & wholesale orders](${SITE_URL}/user/bulk-order): request a quote for hotels, retail and corporate gifting
- [Custom designs](${SITE_URL}/user/custom-design): made-to-order sizes and designs
- [FAQ](${SITE_URL}/faq): products, ordering, delivery, tracking and care
- [Track an order](${SITE_URL}/track): live status by tracking ID
- [About us](${SITE_URL}/user/about) and [Our story](${SITE_URL}/user/about/brand-story)
- [Sustainability & impact](${SITE_URL}/user/sustainability)
- [Delivery across India](${SITE_URL}/water-hyacinth-products): state-by-state pages

## Products
${products.length ? products.map((p) => `- [${p.name}](${SITE_URL}/user/products/${p._id})${p.category ? ` (${p.category})` : ""}`).join("\n") : "- See the catalogue: " + SITE_URL + "/user/products"}

## Guides
${posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`).join("\n")}

## Regions served
${LOCATIONS.map((l) => `- [${l.name}](${SITE_URL}/water-hyacinth-products/${l.slug}): ${l.cities.slice(0, 5).join(", ")}`).join("\n")}

## Optional
- [Full text for AI assistants](${SITE_URL}/llms-full.txt): all FAQs, product details and guides in one file
`;
}

/** Full-content version: every FAQ, product and article as plain text. */
export async function buildLlmsFullTxt() {
  const [posts, products] = await Promise.all([getAllPosts(), loadProducts()]);

  const productText = products
    .map((p) => {
      const price = p.discountPrice ?? p.price;
      return `### ${p.name}
- URL: ${SITE_URL}/user/products/${p._id}
- Category: ${p.category || "—"}
- Price: from ₹${Number(price).toLocaleString("en-IN")} per unit (bulk pricing on request)
- Minimum order quantity: ${p.minOrderQty || 1}
- Indicative lead time: ${p.leadTime || "confirmed in quote"}
- Description: ${(p.description || "").replace(/\s+/g, " ").trim()}`;
    })
    .join("\n\n");

  const faqText = FAQ_SECTIONS.map(
    (s) => `### ${s.title}\n\n${s.faqs.map((f) => `**Q: ${f.q}**\nA: ${f.a}`).join("\n\n")}`
  ).join("\n\n");

  const articleText = posts
    .map((p) => `### ${p.title}\nURL: ${SITE_URL}/blog/${p.slug}\n\n${htmlToText(p.content)}${
      p.faqs?.length ? `\n\n${p.faqs.map((f) => `**Q: ${f.q}**\nA: ${f.a}`).join("\n\n")}` : ""
    }`)
    .join("\n\n---\n\n");

  return `# ${BUSINESS.name} — full reference

> ${BUSINESS.description}

${factsBlock()}

## Frequently asked questions

${faqText}

## Product catalogue

${productText || `See ${SITE_URL}/user/products`}

## Guides and articles

${articleText}

## Delivery regions
We deliver to every Indian state and union territory: ${LOCATIONS.map((l) => l.name).join(", ")}.
`;
}
