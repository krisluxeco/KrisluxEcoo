// Courier list + public tracking-link patterns.
// When a courier has no reliable deep link, we fall back to 17TRACK, a free
// universal tracker that detects the courier from the AWB number.

const universal = (awb) => `https://t.17track.net/en#nums=${encodeURIComponent(awb)}`;

export const COURIERS = [
  { key: "delhivery", name: "Delhivery", url: (awb) => `https://www.delhivery.com/track/package/${encodeURIComponent(awb)}` },
  { key: "shiprocket", name: "Shiprocket", url: (awb) => `https://shiprocket.co/tracking/${encodeURIComponent(awb)}` },
  { key: "xpressbees", name: "Xpressbees", url: (awb) => `https://www.xpressbees.com/shipment/tracking?awbNo=${encodeURIComponent(awb)}` },
  { key: "bluedart", name: "Blue Dart", url: universal },
  { key: "dtdc", name: "DTDC", url: universal },
  { key: "ecom", name: "Ecom Express", url: universal },
  { key: "ekart", name: "Ekart", url: universal },
  { key: "indiapost", name: "India Post", url: universal },
  { key: "fedex", name: "FedEx", url: (awb) => `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(awb)}` },
  { key: "dhl", name: "DHL Express", url: (awb) => `https://www.dhl.com/in-en/home/tracking/tracking-express.html?submit=1&tracking-id=${encodeURIComponent(awb)}` },
  { key: "ups", name: "UPS", url: (awb) => `https://www.ups.com/track?tracknum=${encodeURIComponent(awb)}` },
  { key: "aramex", name: "Aramex", url: universal },
  { key: "own", name: "Own vehicle / hand delivery", url: null },
];

export const findCourier = (name = "") =>
  COURIERS.find((c) => c.name.toLowerCase() === String(name).trim().toLowerCase()) || null;

/** Best tracking link for a courier name + AWB. Returns "" when not applicable. */
export const buildTrackingUrl = (courierName, awb) => {
  const code = String(awb || "").trim();
  if (!code) return "";
  const c = findCourier(courierName);
  if (c) return c.url ? c.url(code) : "";
  return universal(code); // unknown / "other" courier
};
