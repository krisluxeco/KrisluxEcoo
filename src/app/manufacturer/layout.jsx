import { redirect } from "next/navigation";
import { requireManufacturerOrAdmin } from "@/lib/manufacturerAuth";

export const metadata = {
  title: "Artisan Workshop Portal",
  robots: { index: false, follow: false },
};

// Server-side gate: checks the role in the database on every request,
// so a blocked or downgraded workshop loses access immediately.
export default async function ManufacturerLayout({ children }) {
  const { error, status } = await requireManufacturerOrAdmin();
  if (error) {
    redirect(status === 401 ? "/login?callbackUrl=/manufacturer" : "/login?error=AccessDenied");
  }
  return children;
}
