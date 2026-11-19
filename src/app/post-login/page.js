// app/post-login/page.js
"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PostLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;
      router.replace(role === "admin" ? "/admin" : role === "manufacturer" ? "/manufacturer" : "/");
    } else if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, session, router]);

  return null; // or a small loading spinner
}
