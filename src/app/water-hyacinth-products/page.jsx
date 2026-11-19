import Link from "next/link";
import { MapPin } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { LOCATIONS } from "@/content/locations";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Water Hyacinth Products Across India — Delivery to Every State",
  description:
    "Handmade water hyacinth baskets, planters, hotel décor and corporate gifts from Bihar, delivered to every Indian state and union territory — Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Patna and more.",
  path: "/water-hyacinth-products",
  keywords: ["water hyacinth products India", "buy water hyacinth basket online India", "pan India delivery handicrafts"],
});

const serif = "var(--font-playfair), Georgia, serif";

function Group({ title, items }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl text-[#1C1C1A] mb-5" style={{ fontFamily: serif }}>{title}</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((l) => (
          <li key={l.slug}>
            <Link
              href={`/water-hyacinth-products/${l.slug}`}
              className="block bg-white border border-[#E8DDD0] hover:border-[#C8A97A] p-4 transition-colors h-full"
            >
              <span className="font-semibold text-[#1C1C1A]">{l.name}</span>
              <span className="block text-xs text-[#9E9088] mt-1">{l.cities.slice(0, 4).join(" · ")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function LocationsIndexPage() {
  const states = LOCATIONS.filter((l) => l.type === "state");
  const uts = LOCATIONS.filter((l) => l.type === "ut");
  const bihar = LOCATIONS.find((l) => l.home);

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-32 pb-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Delivery across India", path: "/water-hyacinth-products" },
        ])}
      />
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <header className="mb-12 max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#C8A97A] font-bold mb-4">
            <MapPin size={14} /> Pan-India delivery
          </p>
          <h1 className="text-4xl sm:text-5xl text-[#1C1C1A] leading-tight" style={{ fontFamily: serif }}>
            Water hyacinth products, delivered across India
          </h1>
          <p className="mt-6 text-lg text-[#4A4540] leading-relaxed">
            Handwoven by women artisans in Begusarai, Bihar, our baskets, planters, trays, hotel décor and corporate gifts reach
            homes, hotels and offices in every state and union territory. Choose your region for local details.
          </p>
        </header>

        {bihar && (
          <Link
            href={`/water-hyacinth-products/${bihar.slug}`}
            className="block mb-12 bg-[#1C1C1A] text-white p-6 sm:p-8 hover:bg-[#2a2a27] transition-colors"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#C8A97A] mb-2">Our home state</p>
            <p className="text-2xl sm:text-3xl" style={{ fontFamily: serif }}>Bihar — where every piece is made</p>
            <p className="text-white/60 text-sm mt-2">{bihar.cities.join(" · ")}</p>
          </Link>
        )}

        <Group title="States" items={states.filter((l) => !l.home)} />
        <Group title="Union territories" items={uts} />
      </div>
    </main>
  );
}
