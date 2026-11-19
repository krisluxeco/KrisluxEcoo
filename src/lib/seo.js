// Central SEO + AI-search configuration. One source of truth for business facts,
// so Google, Bing and AI assistants (ChatGPT, Gemini, Claude, Perplexity, Copilot,
// Grok…) always see the same, consistent information.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://krisluxeco.com").replace(/\/+$/, "");

export const BUSINESS = {
  name: "KrisluxECO",
  legalName: "KrisluxECO",
  tagline: "Handcrafted water hyacinth products from Bihar, India",
  description:
    "KrisluxECO is an Indian sustainable brand that makes handcrafted water hyacinth products — baskets, planters, storage, trays, hotel room décor and corporate gifts — woven by women artisans in Begusarai, Bihar. We supply homes, hotels, resorts, offices and retailers across India, with bulk and custom orders.",
  foundingDate: "2023",
  founder: "Krishna Singh",
  email: "krisluxeco@gmail.com",
  phone: "+91-97986-11931",
  phoneE164: "+919798611931",
  whatsapp: "https://wa.me/919798611931",
  address: {
    streetAddress: "Teghra",
    addressLocality: "Begusarai",
    addressRegion: "Bihar",
    postalCode: "851133", // Teghra PIN — confirm before launch
    addressCountry: "IN",
  },
  logo: "/logo.png",
  image: "/images/hero_hotel.png",
  sameAs: [
    "https://www.instagram.com/krisluxeco",
    "https://www.facebook.com/krisluxeco",
    "https://www.linkedin.com/company/krisluxeco-official",
  ],
};

// Core keyword set — product, material, buyer intent and location terms.
export const CORE_KEYWORDS = [
  "water hyacinth products",
  "water hyacinth baskets",
  "water hyacinth products India",
  "water hyacinth handicrafts",
  "handmade water hyacinth basket",
  "water hyacinth planter",
  "water hyacinth storage basket",
  "water hyacinth laundry basket",
  "water hyacinth tray",
  "eco-friendly home decor India",
  "sustainable home decor",
  "handmade baskets India",
  "natural fibre baskets",
  "eco-friendly hotel amenities",
  "sustainable hotel room decor",
  "eco-friendly corporate gifts India",
  "sustainable corporate gifting",
  "bulk handmade baskets supplier",
  "wholesale water hyacinth products",
  "water hyacinth manufacturer India",
  "Bihar handicrafts",
  "Begusarai handicrafts",
  "Madhubani handicrafts",
  "women artisans Bihar",
  "plastic-free products India",
  "biodegradable home products",
];

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Builds a complete metadata object for a page (title, description, canonical,
 * Open Graph, Twitter, keywords).
 */
export const pageMetadata = ({ title, description, path = "/", keywords = [], image, noIndex = false, type = "website" }) => {
  const url = absoluteUrl(path);
  const img = image ? (image.startsWith("http") ? image : absoluteUrl(image)) : absoluteUrl(BUSINESS.image);
  return {
    title,
    description,
    keywords: [...new Set([...keywords, ...CORE_KEYWORDS.slice(0, 8)])],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: BUSINESS.name,
      type,
      locale: "en_IN",
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [img] },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
};

export const noIndexMetadata = (title) => ({ title, robots: { index: false, follow: false } });

/* ----------------------------- JSON-LD builders ----------------------------- */

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": `${SITE_URL}/#organization`,
  name: BUSINESS.name,
  legalName: BUSINESS.legalName,
  url: SITE_URL,
  logo: absoluteUrl(BUSINESS.logo),
  image: absoluteUrl(BUSINESS.image),
  description: BUSINESS.description,
  slogan: BUSINESS.tagline,
  foundingDate: BUSINESS.foundingDate,
  founder: { "@type": "Person", name: BUSINESS.founder },
  email: BUSINESS.email,
  telephone: BUSINESS.phoneE164,
  address: { "@type": "PostalAddress", ...BUSINESS.address },
  areaServed: { "@type": "Country", name: "India" },
  knowsAbout: [
    "Water hyacinth handicrafts",
    "Sustainable home decor",
    "Eco-friendly hotel amenities",
    "Corporate gifting",
    "Handwoven baskets",
    "Bihar handicrafts",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: BUSINESS.phoneE164,
      email: BUSINESS.email,
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  ],
  sameAs: BUSINESS.sameAs,
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: BUSINESS.name,
  inLanguage: "en-IN",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/user/products?search={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbJsonLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});

export const faqJsonLd = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

/** Safely serialises JSON-LD for a <script> tag (prevents `</script>` injection). */
export const jsonLdString = (data) => JSON.stringify(data).replace(/</g, "\\u003c");
