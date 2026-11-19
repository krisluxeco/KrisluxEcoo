// Frequently asked questions — shown on /faq, embedded as FAQPage schema and
// included in /llms.txt so AI assistants can quote accurate answers.
// Keep answers factual; avoid promising prices or timelines that aren't fixed.

export const FAQ_SECTIONS = [
  {
    id: "products",
    title: "About our products",
    faqs: [
      {
        q: "What is KrisluxECO?",
        a: "KrisluxECO is a sustainable Indian brand based in Teghra, Begusarai (Bihar). We make handcrafted products from water hyacinth — baskets, planters, storage, trays, hotel room décor and corporate gifts — woven by women artisans in rural Bihar. The idea started in 2023 at IIT Patna, and we sell to homes, hotels, offices and retailers across India.",
      },
      {
        q: "What is water hyacinth and why is it used for handicrafts?",
        a: "Water hyacinth is a fast-growing invasive water plant that chokes rivers, ponds and wetlands, blocks sunlight and harms fish. Its long stems become strong, flexible fibres when sun-dried, which makes them ideal for weaving. Harvesting it clears waterways and turns a weed into durable, biodegradable products.",
      },
      {
        q: "What products do you make from water hyacinth?",
        a: "Our range includes storage baskets, laundry baskets, planter baskets and pot covers, hanging planters, serving and bathroom trays, hotel room amenities and décor, and gift hampers. You can see the current catalogue on our Products page, and we also make custom designs for bulk orders.",
      },
      {
        q: "Are water hyacinth products durable?",
        a: "Yes. Properly dried and woven water hyacinth is strong and keeps its shape for years with normal indoor use. Like any natural fibre, it should be kept away from constant moisture and direct, prolonged rain.",
      },
      {
        q: "Are your products eco-friendly and plastic-free?",
        a: "Our products are made from a natural plant fibre that is biodegradable at end of life, and we aim to pack in plastic-free materials. Making them also removes an invasive weed from local waterways in Bihar.",
      },
      {
        q: "Who makes KrisluxECO products?",
        a: "Our products are handwoven by women artisans in rural Bihar, including the Begusarai region. Each piece is made by hand, so small variations in colour and weave are natural and part of the character of the product.",
      },
    ],
  },
  {
    id: "ordering",
    title: "Bulk & custom orders",
    faqs: [
      {
        q: "Do you take bulk and wholesale orders?",
        a: "Yes — bulk orders are our main business. We supply hotels, resorts, restaurants, retailers, interior designers and companies. Add products to your quote cart or use the Bulk Order page, and our team will send you a formal quote.",
      },
      {
        q: "What is the minimum order quantity (MOQ)?",
        a: "The minimum order quantity depends on the product and is shown on each product page. For custom designs, the MOQ is confirmed in your quote.",
      },
      {
        q: "Can you make custom designs, sizes or branding?",
        a: "Yes. You can request custom sizes, shapes, colours and designs through the Custom Design page, and upload a reference image or drawing. Our team reviews the request and confirms feasibility, sampling and pricing.",
      },
      {
        q: "How do I get a price quote?",
        a: "Add the products you need to your quote cart and submit the request with your quantities and requirements, or fill in the Bulk Order form. You can add your GSTIN for a business quote. Our concierge team replies with a formal quotation.",
      },
      {
        q: "Can I get a sample before placing a bulk order?",
        a: "Samples can be arranged for bulk enquiries. Mention it in your quote request and our team will confirm the sample options and charges.",
      },
      {
        q: "How long does production take?",
        a: "Because every piece is handmade, production time depends on the product and quantity. Each product page shows an indicative lead time, and the exact timeline is confirmed in your quote.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Delivery & tracking",
    faqs: [
      {
        q: "Do you deliver across India?",
        a: "Yes. We ship from Bihar to all states and union territories in India, including major cities such as Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow and Patna, through trusted courier and logistics partners.",
      },
      {
        q: "How can I track my order?",
        a: "Every order gets a KrisluxECO tracking ID (for example KLX-7QH4M2XA). Enter it on the Track Order page, or open My Orders in your profile, to see each step — from production at the artisan workshop to dispatch and delivery. Once dispatched, you also get the courier name, AWB number and a courier tracking link.",
      },
      {
        q: "Will I get updates about my order?",
        a: "Yes. We email you when your order is received, when production starts, when it is dispatched and when it is delivered.",
      },
    ],
  },
  {
    id: "care",
    title: "Care & use",
    faqs: [
      {
        q: "How do I clean water hyacinth baskets?",
        a: "Dust regularly with a dry cloth or soft brush, or use a vacuum brush attachment. For marks, wipe gently with a slightly damp cloth and let the piece dry completely in a shaded, airy place. Do not soak it or put it in a washing machine.",
      },
      {
        q: "Can water hyacinth products be used outdoors or in bathrooms?",
        a: "They are best for indoor use. In humid spaces like bathrooms, keep good ventilation and let them dry out between uses. Avoid direct rain and constant moisture, which can cause mould on any natural fibre.",
      },
      {
        q: "Can I put plants directly in a water hyacinth planter?",
        a: "Use a waterproof inner pot or liner inside the planter. This protects the woven fibre from water and soil and keeps the planter looking good for longer.",
      },
    ],
  },
  {
    id: "business",
    title: "Hotels, gifting & partners",
    faqs: [
      {
        q: "Do you supply eco-friendly products for hotels and resorts?",
        a: "Yes. We supply hotels, resorts and homestays with sustainable room décor, storage, bathroom trays, laundry baskets and amenity holders, and can customise sizes and finishes to match your interiors.",
      },
      {
        q: "Do you offer sustainable corporate gifts?",
        a: "Yes. We create handmade, plastic-free corporate gifts and hampers for festivals like Diwali, employee onboarding, events and client gifting, with options for custom branding on bulk orders.",
      },
      {
        q: "Can manufacturers or artisan groups partner with KrisluxECO?",
        a: "Yes. Artisan groups, workshops and sustainable brands can share their catalogue with us through the Share Catalog page, and our team will get in touch.",
      },
    ],
  },
];

export const ALL_FAQS = FAQ_SECTIONS.flatMap((s) => s.faqs);
