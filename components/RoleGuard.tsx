"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { UserRole } from "@/types/next-auth";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
  redirectTo = "/auth/signin",
}: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push(redirectTo);
      return;
    }

    const userRole = session.user.role;
    if (!allowedRoles.includes(userRole)) {
      router.push(redirectTo);
    }
  }, [session, status, allowedRoles, redirectTo, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!session || !allowedRoles.includes(session.user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface TeacherGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function TeacherGuard({ children, fallback }: TeacherGuardProps) {
  return (
    <RoleGuard allowedRoles={["teacher", "admin"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AdminGuard({ children, fallback }: TeacherGuardProps) {
  return (
    <RoleGuard allowedRoles={["admin"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}
