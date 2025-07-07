"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/me", { credentials: "include" });
      if (res.status !== 200) {
        router.replace("/auth");
      }
    }

    checkAuth();
  }, []);
}

export function useRedirectIfLoggedIn() {
  const router = useRouter();

  useEffect(() => {
    // ✅ NEW: delay before checking /api/me
    const timeout = setTimeout(() => {
      async function checkAuth() {
        const res = await fetch("/api/me", { credentials: "include" }); // ✅ use cookie
        if (res.status === 200) {
          router.replace("/"); // ✅ redirect if logged in
        }
      }

      checkAuth();
    }, 300); // ✅ added delay to allow logout cookie removal

    // ✅ cleanup timeout on unmount
    return () => clearTimeout(timeout);
  }, []);
}
