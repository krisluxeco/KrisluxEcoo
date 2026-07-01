import { auth } from "@/auth";
import AdminShell from "@/components/admin/AdminShell";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/login");
  }

  return <AdminShell>{children}</AdminShell>;
}