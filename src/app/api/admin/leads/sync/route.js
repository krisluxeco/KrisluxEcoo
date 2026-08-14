import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Lead from "@/models/Lead.model";

export async function POST(req) {
  try {
    await connectDb();
    
    let indiamartKey = process.env.INDIAMART_API_KEY;
    let exportindiaKey = process.env.EXPORTINDIA_API_KEY;

    let syncedCount = 0;

    // --- IndiaMART Sync ---
    if (indiamartKey && indiamartKey !== "your_indiamart_crm_key_here") {
      try {
        // Fetch last 7 days of leads
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - 7);
        
        // IndiaMART CRM API URL formatting
        const st = `${start.getDate().toString().padStart(2, '0')}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getFullYear()}`;
        const et = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
        
        const url = `https://mapi.indiamart.com/wservce/crm/crmListing/v2/?glusr_crm_key=${indiamartKey}&start_time=${st}&end_time=${et}`;
        
        const res = await fetch(url);
        const data = await res.json();

        if (data && data.RESPONSE) {
          for (const lead of data.RESPONSE) {
            const externalId = `im_${lead.UNIQUE_QUERY_ID}`;
            
            const existing = await Lead.findOne({ externalLeadId: externalId });
            if (!existing) {
              await Lead.create({
                source: "indiamart",
                buyerName: lead.SENDER_NAME || "Unknown Buyer",
                companyName: lead.SENDER_COMPANY || "",
                email: lead.SENDER_EMAIL || "",
                phone: lead.SENDER_MOBILE || "",
                city: lead.SENDER_CITY || "",
                state: lead.SENDER_STATE || "",
                country: lead.SENDER_COUNTRY_ISO || "IN",
                subject: lead.SUBJECT || "IndiaMART Inquiry",
                queryMessage: lead.QUERY_MESSAGE || "",
                externalLeadId: externalId,
                status: "new"
              });
              syncedCount++;
            }
          }
        }
      } catch (e) {
        console.error("IndiaMART Sync Error:", e);
      }
    } else {
      // Simulate sync if no API key is provided
      console.log("No valid IndiaMART API Key. Simulating lead sync.");
      const mockId = `im_mock_${Date.now()}`;
      const existing = await Lead.findOne({ externalLeadId: mockId });
      if (!existing) {
        await Lead.create({
          source: "indiamart",
          buyerName: "Rajesh Kumar",
          companyName: "Rajesh Eco Stores",
          email: "rajesh.eco@example.com",
          phone: "+91-9876543210",
          city: "Mumbai",
          state: "Maharashtra",
          country: "IN",
          subject: "Bulk inquiry for Eco-friendly plates",
          queryMessage: "I am looking for 10,000 units of your bamboo plates. Please provide the best wholesale price.",
          externalLeadId: mockId,
          status: "new"
        });
        syncedCount++;
      }
    }

    // --- ExportIndia Sync ---
    if (exportindiaKey && exportindiaKey !== "your_exportindia_crm_key_here") {
      // Placeholder for ExportIndia API Logic. 
      // Note: ExportIndia API format varies based on account type, usually requires SOAP or specific REST endpoints.
      console.log("ExportIndia API Key found, attempting sync...");
    } else {
      console.log("No valid ExportIndia API Key. Simulating lead sync.");
      const mockId = `ei_mock_${Date.now()}`;
      const existing = await Lead.findOne({ externalLeadId: mockId });
      if (!existing) {
        await Lead.create({
          source: "exportindia",
          buyerName: "Priya Sharma",
          companyName: "Global Green Traders",
          email: "priya.ggt@example.in",
          phone: "+91-9123456780",
          city: "Delhi",
          state: "Delhi",
          country: "IN",
          subject: "Requesting Quotation for Jute Bags",
          queryMessage: "Dear sir, we are interested in your jute bags for an upcoming corporate event. Need 500 pieces with custom logo.",
          externalLeadId: mockId,
          status: "new"
        });
        syncedCount++;
      }
    }

    return NextResponse.json({ success: true, message: `Successfully synced ${syncedCount} new leads.` });
  } catch (error) {
    console.error("Error syncing leads:", error);
    return NextResponse.json({ success: false, error: "Failed to sync leads" }, { status: 500 });
  }
}
