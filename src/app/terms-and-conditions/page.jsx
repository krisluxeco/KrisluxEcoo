import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | KrisluxECO",
  description: "Terms and conditions governing the purchase, supply, and use of KrisluxECO handcrafted sustainable products.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Simple navigation back */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-4"
          >
            &larr; Back to Home
          </Link>
        </div>

        {/* Document Header */}
        <header className="border-b border-gray-200 pb-8 mb-10">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-2">
            Legal &amp; Supply Terms
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: October 2026 &bull; Effective Date: October 2026
          </p>
        </header>

        {/* Content Body */}
        <div className="space-y-8 text-base text-gray-700 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or placing an order on <strong>krisluxeco.com</strong> (or entering into a direct commercial supply contract with KrisluxECO), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services or submit purchase orders.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Handcrafted Nature &amp; Natural Variations
            </h2>
            <p className="mb-3">
              All KrisluxECO products are artisan-crafted by hand using natural, sun-cured water hyacinth stalks (*Eichhornia crassipes*), bamboo, and natural fibers. Because our products are 100% biological and woven by human hands:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Color Tones:</strong> Natural sun-dried stalk shades range from light wheat to deep amber. Slight organic variations in tone, grain, and sun-drying patina are intrinsic hallmarks of authentic artisanal goods and are not considered manufacturing defects.
              </li>
              <li>
                <strong>Dimensions:</strong> Hand-loomed dimensions may carry minor tolerances of approximately &plusmn;5% to &plusmn;10% from nominal specifications.
              </li>
              <li>
                <strong>Scent &amp; Moisture:</strong> Products possess a subtle natural dried-grass scent that dissipates naturally in dry, ventilated environments. Avoid prolonged exposure to standing water or damp enclosed spaces without air circulation.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Commercial Orders, B2B Quotations &amp; MOQs
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Minimum Order Quantities (MOQ):</strong> Bulk wholesale rates and custom private-label branding apply to specific minimum batch sizes detailed in our commercial proforma estimates.
              </li>
              <li>
                <strong>Quotation Validity:</strong> Official commercial proforma quotations are valid for thirty (30) calendar days from issuance, unless otherwise stated in writing.
              </li>
              <li>
                <strong>Custom Tooling &amp; Sampling:</strong> Pre-production physical samples and custom laser-engraved/debossed prototypes are produced upon receipt of sample development charges, which may be credited against subsequent production runs subject to agreement.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Pricing, Taxes &amp; Payment Terms
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Prices &amp; Currency:</strong> Retail prices are listed in Indian Rupees (INR), inclusive or exclusive of GST as indicated at checkout. Export quotes are issued in USD, EUR, or GBP as agreed.
              </li>
              <li>
                <strong>Standard Bulk Payment Terms:</strong> Standard commercial terms for bulk and custom manufacture are <strong>50% advance mobilization deposit</strong> upon order confirmation and digital drawing sign-off, with the balance <strong>50% payable upon final quality inspection clearance prior to dispatch</strong>.
              </li>
              <li>
                <strong>Letters of Credit:</strong> Irrevocable Letters of Credit (L/C at sight) from prime international banks are accepted for container-load export consignments.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Shipping, Logistics &amp; Title
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Domestic Deliveries:</strong> Dispatches within India are handled via authorized surface or express couriers. Standard domestic transit takes 4 to 9 business days following dispatch.
              </li>
              <li>
                <strong>Export Shipments:</strong> International consignments are shipped under agreed Incoterms (e.g., EXW, FOB Kolkata/Nhava Sheva, or CIF/DAP). Import duties, tariffs, and customs clearances at destination ports are the responsibility of the consignee unless explicitly covered by a DDP contract.
              </li>
              <li>
                <strong>Transfer of Risk:</strong> Risk of loss transfers to the carrier upon handoff at our facility or nominated port. We provide complete transit insurance on commercial consignments upon request.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Inspection Period, Returns &amp; Replacement
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Inspection Window:</strong> Consignments must be inspected within forty-eight (48) hours of receipt. Any damage incurred during transit must be noted on the carrier&apos;s proof of delivery (POD) and reported to us with photographic evidence immediately.
              </li>
              <li>
                <strong>Replacements:</strong> Verified transit-damaged or defective pieces will be replaced or credited in accordance with our quality audit review.
              </li>
              <li>
                <strong>Custom &amp; Bulk Orders:</strong> Custom-branded, monogrammed, or bespoke dimension orders are made specifically to client specifications and cannot be returned or refunded once production has commenced.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Intellectual Property
            </h2>
            <p>
              All designs, brand names, product photography, editorial text, logos, and digital assets on this website are the intellectual property of KrisluxECO or its licensors and are protected under Indian and international copyright and trademark laws. Unauthorized reproduction, scraping, or commercial exploitation is strictly prohibited without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, KrisluxECO shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from the use of, or inability to use, our website or products. Our total liability for any claim arising out of a purchase order shall not exceed the total amount paid by the customer for the specific goods giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any legal dispute, controversy, or claim arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Patna, Bihar, India</strong>.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8 mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              10. Contact Information
            </h2>
            <p className="mb-4">
              If you have any questions or require clarification regarding these Terms and Conditions, please contact our legal and support desk:
            </p>
            <div className="bg-gray-50 border border-gray-200 p-5 rounded text-sm text-gray-800 space-y-1">
              <p><strong>KrisluxECO</strong></p>
              <p>Teghra, Begusarai, Bihar, India - 851112</p>
              <p>Incubation Centre, IIT Patna, Bihta, Bihar</p>
              <p>Email: <a href="mailto:krisluxeco@gmail.com" className="text-gray-900 underline">krisluxeco@gmail.com</a></p>
              <p>Phone / WhatsApp: <a href="tel:+919798611931" className="text-gray-900 underline">+91 97986 11931</a></p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
