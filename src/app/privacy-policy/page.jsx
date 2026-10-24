import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | KrisluxECO",
  description: "Learn how KrisluxECO collects, uses, and safeguards your personal and commercial data.",
};

export default function PrivacyPolicyPage() {
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
            Legal &amp; Compliance Document
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: October 2026 &bull; Effective Date: October 2026
          </p>
        </header>

        {/* Content Body */}
        <div className="space-y-8 text-base text-gray-700 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Overview &amp; Scope
            </h2>
            <p>
              KrisluxECO (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy and ensuring the security of your personal and business data. This Privacy Policy outlines how we collect, store, handle, and protect your information when you visit our website (<strong>krisluxeco.com</strong>), place retail or wholesale orders, submit custom design or bulk inquiries, or interact with our customer service team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-3">
              We collect only the essential information necessary to provide handcrafted sustainable goods, process transactions, and fulfill institutional orders:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Contact Information:</strong> Full name, email address, phone number, and physical billing/shipping address.
              </li>
              <li>
                <strong>B2B &amp; Commercial Details:</strong> Company or brand name, GSTIN (for Indian tax invoicing), business delivery locations, and estimated order volumes.
              </li>
              <li>
                <strong>Customization Assets:</strong> Vector brand logos, artwork, or dimensional briefs submitted for bespoke bulk orders.
              </li>
              <li>
                <strong>Transaction Records:</strong> Order reference numbers, payment status confirmation, and dispatch receipts. We do <em>not</em> store full credit/debit card numbers or bank credentials on our servers.
              </li>
              <li>
                <strong>Technical Information:</strong> Basic device data, IP address, browser type, and page interaction timestamps collected strictly for performance optimization and fraud prevention.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. How We Use Your Information
            </h2>
            <p className="mb-3">Your data is utilized strictly for legitimate business and fulfillment purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To prepare commercial wholesale quotes, digital proforma invoices, and sample shipments.</li>
              <li>To schedule dispatch, courier delivery, and freight cargo through authorized logistics partners.</li>
              <li>To communicate order status updates, tracking numbers, and delivery verifications via email, SMS, or WhatsApp.</li>
              <li>To provide customer support and respond to custom design requests.</li>
              <li>To comply with statutory legal, tax, and GST reporting obligations under Indian law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Zero Data Commercialization Policy
            </h2>
            <p>
              We firmly uphold a <strong>zero data sale</strong> principle. We never sell, rent, trade, or monetize your personal or commercial contact information to third-party advertisers, data aggregators, or marketing networks under any circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Data Sharing with Authorized Partners
            </h2>
            <p className="mb-3">
              We share data only with trusted, bound service providers strictly required to complete your transactions:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Logistics &amp; Courier Partners:</strong> Third-party carriers (e.g., Delhivery, BlueDart, India Post, or international freight forwarders) receive shipping addresses and recipient phone numbers strictly to complete delivery.
              </li>
              <li>
                <strong>Payment Processors:</strong> Certified, PCI-DSS compliant payment gateways that process secure digital transactions.
              </li>
              <li>
                <strong>Government &amp; Regulatory Authorities:</strong> Where mandated by law, court order, or official tax audit processes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Cookies &amp; Telemetry
            </h2>
            <p>
              Our website uses basic, privacy-conscious session cookies strictly to keep your shopping cart intact, maintain authentication state, and measure anonymous website load times. We do not deploy invasive third-party cross-site advertising trackers or tracking pixels. You may disable cookies in your browser settings, though certain checkout features may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Data Security &amp; Storage
            </h2>
            <p>
              All communications between your browser and our servers are encrypted using standard Transport Layer Security (TLS/HTTPS). Internal database records are stored in secure cloud environments with multi-factor authentication and role-based staff access restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Your Rights
            </h2>
            <p className="mb-3">As a customer or commercial client, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request a copy of the personal information we hold regarding your account.</li>
              <li>Request correction or updating of any inaccurate contact or shipping details.</li>
              <li>Request complete deletion or anonymization of your personal data, subject to statutory tax and financial retention laws.</li>
              <li>Opt out of non-transactional marketing communications at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Updates to this Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect operational, legal, or regulatory changes. The &ldquo;Last Updated&rdquo; date at the top of this document indicates when changes became effective. Continued use of our site signifies acceptance of any updated terms.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8 mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              10. Contact Us &amp; Grievance Redressal
            </h2>
            <p className="mb-4">
              For any privacy inquiries, data deletion requests, or grievances regarding our handling of your information, please contact our administrative team:
            </p>
            <div className="bg-gray-50 border border-gray-200 p-5 rounded text-sm text-gray-800 space-y-1">
              <p><strong>KrisluxECO</strong></p>
              <p>Registered Office: Teghra, Begusarai, Bihar, India - 851112</p>
              <p>Incubation Partner: Incubation Centre, IIT Patna, Bihta, Bihar</p>
              <p>Email: <a href="mailto:krisluxeco@gmail.com" className="text-gray-900 underline">krisluxeco@gmail.com</a></p>
              <p>Phone / WhatsApp: <a href="tel:+919798611931" className="text-gray-900 underline">+91 97986 11931</a></p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
