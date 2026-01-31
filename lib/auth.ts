import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types/next-auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/signin");
  }
  return session;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth();
  const userRole = session.user.role;

  if (!allowedRoles.includes(userRole)) {
    redirect("/auth/signin?error=unauthorized");
  }

  return session;
}

export async function requireTeacher() {
  return requireRole(["teacher", "admin"]);
}

export async function requireAdmin() {
  return requireRole(["admin"]);
}

export { authOptions };
