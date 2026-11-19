import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { FAQ_SECTIONS, ALL_FAQS } from "@/content/faqs";
import { pageMetadata, faqJsonLd, breadcrumbJsonLd, BUSINESS } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQ — Water Hyacinth Products, Bulk Orders, Delivery & Care",
  description:
    "Answers about KrisluxECO water hyacinth products: what they are made of, bulk and custom orders, MOQ, delivery across India, order tracking, care and hotel or corporate supply.",
  path: "/faq",
  keywords: ["water hyacinth FAQ", "how to clean water hyacinth basket", "bulk order handmade baskets", "water hyacinth delivery India"],
});

const serif = "var(--font-playfair), Georgia, serif";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-32 pb-24">
      <JsonLd
        data={[
          faqJsonLd(ALL_FAQS),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ]}
      />

      <div className="max-w-4xl mx-auto px-5 sm:px-6">
        <header className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-[#C8A97A] font-bold mb-4">Help centre</p>
          <h1 className="text-4xl sm:text-5xl text-[#1C1C1A] leading-tight" style={{ fontFamily: serif }}>
            Frequently asked questions
          </h1>
          <p className="mt-5 text-[#6B6560] max-w-2xl mx-auto leading-relaxed">
            Everything about our handmade water hyacinth products, bulk and custom orders, delivery across India and care.
          </p>
        </header>

        {/* Section jump links */}
        <nav aria-label="FAQ sections" className="flex flex-wrap justify-center gap-2 mb-12">
          {FAQ_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="px-4 py-2 rounded-full border border-[#E8DDD0] bg-white text-xs font-semibold text-[#4A4540] hover:border-[#C8A97A] hover:text-[#1C1C1A] transition-colors"
            >
              {s.title}
            </a>
          ))}
        </nav>

        <div className="space-y-12">
          {FAQ_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="text-2xl text-[#1C1C1A] mb-4" style={{ fontFamily: serif }}>
                {section.title}
              </h2>
              <div className="bg-white border border-[#E8DDD0] divide-y divide-[#F0E9DF]">
                {section.faqs.map((f) => (
                  <details key={f.q} className="group px-5 sm:px-6 py-5">
                    <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-semibold text-[#1C1C1A]">
                      <h3 className="text-base">{f.q}</h3>
                      <span className="text-[#C8A97A] text-2xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-[#4A4540] leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-16 bg-[#1C1C1A] text-white p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl mb-3" style={{ fontFamily: serif }}>
            Still have a question?
          </h2>
          <p className="text-white/70 mb-7">Our team replies on WhatsApp, phone and email.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={BUSINESS.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#1fb757] text-white px-7 py-3 text-xs font-bold uppercase tracking-widest">
              WhatsApp us
            </a>
            <Link href="/user/bulk-order" className="border border-white/40 hover:border-white px-7 py-3 text-xs font-bold uppercase tracking-widest">
              Request a quote
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/50">
            {BUSINESS.phone} · {BUSINESS.email}
          </p>
        </aside>
      </div>
    </main>
  );
}
