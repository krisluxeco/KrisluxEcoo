import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Truck, Package, Building2, Gift, CheckCircle2 } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { LOCATIONS, findLocation } from "@/content/locations";
import { ARTICLES } from "@/content/articles";
import { pageMetadata, breadcrumbJsonLd, faqJsonLd, absoluteUrl, SITE_URL, BUSINESS } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ state: l.slug }));
}

const cityList = (cities) =>
  cities.length > 1 ? `${cities.slice(0, -1).join(", ")} and ${cities[cities.length - 1]}` : cities[0];

export async function generateMetadata({ params }) {
  const { state } = await params;
  const loc = findLocation(state);
  if (!loc) return {};
  const top = loc.cities.slice(0, 3).join(", ");
  return pageMetadata({
    title: `Water Hyacinth Products in ${loc.name} — Handmade Baskets, Planters & Décor`,
    description: `Buy handmade water hyacinth baskets, planters, trays, hotel décor and corporate gifts in ${loc.name} (${top}). Made by women artisans in Bihar, bulk & custom orders, delivered with live tracking.`,
    path: `/water-hyacinth-products/${loc.slug}`,
    keywords: [
      `water hyacinth products ${loc.name}`,
      `water hyacinth basket ${loc.cities[0]}`,
      `eco-friendly home decor ${loc.cities[0]}`,
      `handmade baskets ${loc.name}`,
      `sustainable corporate gifts ${loc.cities[0]}`,
      `eco-friendly hotel supplies ${loc.name}`,
    ],
  });
}

const serif = "var(--font-playfair), Georgia, serif";

export default async function LocationPage({ params }) {
  const { state } = await params;
  const loc = findLocation(state);
  if (!loc) notFound();

  const faqs = [
    {
      q: `Do you deliver water hyacinth products to ${loc.name}?`,
      a: `Yes. KrisluxECO delivers across ${loc.name}, including ${cityList(loc.cities)}, from our artisan workshops in Bihar through courier and logistics partners.`,
    },
    {
      q: `How long does delivery to ${loc.cities[0]} take?`,
      a: `Handmade orders first go through production, which depends on product and quantity, then courier transit to ${loc.cities[0]}. The full timeline is confirmed in your quote, and you can follow every step with your KrisluxECO tracking ID.`,
    },
    {
      q: `Can businesses in ${loc.name} order in bulk?`,
      a: `Yes. We supply ${loc.buyers.join(", ")} in ${loc.name}, with bulk pricing, samples and custom designs. Request a quote with your quantities and delivery city.`,
    },
  ];

  const neighbours = LOCATIONS.filter((l) => l.slug !== loc.slug).slice(0, 12);

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-32 pb-24">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Delivery across India", path: "/water-hyacinth-products" },
            { name: loc.name, path: `/water-hyacinth-products/${loc.slug}` },
          ]),
          faqJsonLd(faqs),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Handmade water hyacinth products in ${loc.name}`,
            serviceType: "Supply of handmade water hyacinth home décor, hotel amenities and corporate gifts",
            provider: { "@id": `${SITE_URL}/#organization` },
            areaServed: [
              { "@type": loc.type === "ut" ? "AdministrativeArea" : "State", name: loc.name },
              ...loc.cities.map((c) => ({ "@type": "City", name: c })),
            ],
            url: absoluteUrl(`/water-hyacinth-products/${loc.slug}`),
          },
        ]}
      />

      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-xs text-[#9E9088] mb-8">
          <Link href="/" className="hover:text-[#1C1C1A]">Home</Link> /{" "}
          <Link href="/water-hyacinth-products" className="hover:text-[#1C1C1A]">Delivery across India</Link> /{" "}
          <span className="text-[#1C1C1A]">{loc.name}</span>
        </nav>

        <header className="mb-12">
          <p className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#C8A97A] font-bold mb-4">
            <MapPin size={14} /> {loc.home ? "Our home state" : `Delivering to ${loc.name}`}
          </p>
          <h1 className="text-4xl sm:text-5xl text-[#1C1C1A] leading-tight" style={{ fontFamily: serif }}>
            Handmade water hyacinth products in {loc.name}
          </h1>
          <p className="mt-6 text-lg text-[#4A4540] leading-relaxed max-w-3xl">{loc.focus}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/user/products" className="bg-[#1C1C1A] hover:bg-[#4A6741] text-white px-7 py-3 text-xs font-bold uppercase tracking-widest text-center">
              Browse products
            </Link>
            <Link href="/user/bulk-order" className="border border-[#1C1C1A] hover:bg-[#1C1C1A] hover:text-white px-7 py-3 text-xs font-bold uppercase tracking-widest text-center">
              Get a bulk quote for {loc.cities[0]}
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {[
            { icon: Package, title: "Homes & retail", text: "Storage and laundry baskets, planters, trays and décor — handwoven and plastic-free." },
            { icon: Building2, title: "Hotels & resorts", text: "Room storage, laundry baskets, bathroom trays and amenity holders, in custom sizes." },
            { icon: Gift, title: "Corporate gifting", text: "Festive hampers, desk organisers and planters with a real sustainability story." },
          ].map((c) => (
            <div key={c.title} className="bg-white border border-[#E8DDD0] p-6">
              <c.icon size={22} className="text-[#4A6741] mb-3" />
              <h2 className="text-lg text-[#1C1C1A] mb-2" style={{ fontFamily: serif }}>{c.title}</h2>
              <p className="text-sm text-[#6B6560] leading-relaxed">{c.text}</p>
            </div>
          ))}
        </section>

        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl text-[#1C1C1A] mb-4" style={{ fontFamily: serif }}>
            Cities we deliver to in {loc.name}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {loc.cities.map((c) => (
              <li key={c} className="px-4 py-2 bg-white border border-[#E8DDD0] text-sm text-[#1C1C1A]">{c}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[#6B6560]">
            Not on the list? We ship to every pin code our courier partners serve in {loc.name} — just add your address to your quote.
          </p>
        </section>

        <section className="mb-14 bg-white border border-[#E8DDD0] p-6 sm:p-8">
          <h2 className="text-2xl text-[#1C1C1A] mb-5" style={{ fontFamily: serif }}>How ordering works</h2>
          <ol className="space-y-3">
            {[
              "Choose products or send a custom design, with your quantities and delivery city.",
              "Get a formal quote (add your GSTIN for business orders) and approve a sample if needed.",
              "Women artisans in Bihar handweave your order — follow every stage with your tracking ID.",
              `We dispatch to ${loc.cities[0]} and share the courier name, AWB number and tracking link.`,
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-[#4A4540]">
                <CheckCircle2 size={18} className="text-[#4A6741] shrink-0 mt-0.5" /> {step}
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-[#6B6560] flex items-center gap-2">
            <Truck size={15} className="text-[#C8A97A]" /> Already ordered? <Link href="/track" className="underline text-[#4A6741]">Track your order</Link>
          </p>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl text-[#1C1C1A] mb-4" style={{ fontFamily: serif }}>
            Questions from buyers in {loc.name}
          </h2>
          <div className="bg-white border border-[#E8DDD0] divide-y divide-[#F0E9DF]">
            {faqs.map((f) => (
              <details key={f.q} className="group px-5 sm:px-6 py-5">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-semibold text-[#1C1C1A]">
                  {f.q}
                  <span className="text-[#C8A97A] text-2xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-[#4A4540] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#6B6560]">
            More answers in our <Link href="/faq" className="underline text-[#4A6741]">FAQ</Link>.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="text-xl text-[#1C1C1A] mb-4" style={{ fontFamily: serif }}>Helpful guides</h2>
          <ul className="space-y-2">
            {ARTICLES.slice(0, 4).map((a) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`} className="text-[#4A6741] underline underline-offset-2 hover:text-[#C8A97A]">{a.title}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-[#E8DDD0] pt-10">
          <h2 className="text-lg text-[#1C1C1A] mb-4" style={{ fontFamily: serif }}>We also deliver to</h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {neighbours.map((l) => (
              <li key={l.slug}>
                <Link href={`/water-hyacinth-products/${l.slug}`} className="text-[#6B6560] hover:text-[#1C1C1A] underline-offset-2 hover:underline">
                  {l.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/water-hyacinth-products" className="text-[#4A6741] font-semibold">All states →</Link>
            </li>
          </ul>
          <p className="mt-8 text-xs text-[#9E9088]">
            {BUSINESS.name} · {BUSINESS.address.streetAddress}, {BUSINESS.address.addressLocality}, {BUSINESS.address.addressRegion} · {BUSINESS.phone}
          </p>
        </section>
      </div>
    </main>
  );
}
