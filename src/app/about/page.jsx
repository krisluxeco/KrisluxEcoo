import { redirect } from "next/navigation";

export default function RootAboutPage() {
  redirect("/user/about");
}
