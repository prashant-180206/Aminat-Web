"use client";

import { useSession } from "next-auth/react";
import type { UserRole } from "@/types/next-auth";

export function useRole() {
  const { data: session } = useSession();
  return session?.user?.role || "student";
}

export function useHasRole(allowedRoles: UserRole[]) {
  const role = useRole();
  return allowedRoles.includes(role);
}

export function useIsTeacher() {
  return useHasRole(["teacher", "admin"]);
}

export function useIsAdmin() {
  return useHasRole(["admin"]);
}

export function useIsStudent() {
  return useHasRole(["student"]);
}
