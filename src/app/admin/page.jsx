import AdminDashBoardClient from "@/components/admin/AdminDashBoardClient";
import { getDashboardData } from "@/lib/dashboardData";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };

// Filters live in the URL: ?range=today|7d|30d|90d|12m|all|custom&from=YYYY-MM-DD&to=YYYY-MM-DD
export default async function AdminDashboardPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const data = await getDashboardData({
    range: typeof sp.range === "string" ? sp.range : undefined,
    filter: typeof sp.filter === "string" ? sp.filter : undefined, // old links (?filter=sevenDays)
    from: typeof sp.from === "string" ? sp.from : undefined,
    to: typeof sp.to === "string" ? sp.to : undefined,
  });
  return <AdminDashBoardClient data={data} />;
}
