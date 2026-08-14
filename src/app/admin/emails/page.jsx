import React from "react";
import EmailDashboardClient from "@/components/admin/EmailDashboardClient";

export const metadata = {
  title: "Email Management | KrisluxECO Admin",
  description: "Manage incoming and outgoing emails",
};

export default function EmailsPage() {
  return <EmailDashboardClient />;
}
