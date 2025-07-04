// app/utils/auth.ts
"use client";

import { getLoggedInUser } from "./storage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user?.id) {
      router.replace("/auth");
    }
  }, []);
}

export function useRedirectIfLoggedIn() {
  const router = useRouter();

  useEffect(() => {
    const user = getLoggedInUser();
    if (user?.id) {
      router.replace("/");
    }
  }, []);
}
