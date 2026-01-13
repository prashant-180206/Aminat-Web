"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRequireAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  return { session, status, isLoading: status === "loading" };
}

export function useAuth() {
  const { data: session, status } = useSession();
  return { session, status, isLoading: status === "loading" };
}
