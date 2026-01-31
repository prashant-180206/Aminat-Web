import React from "react";
import Navigation from "@/app/components/Navigation";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if user is logged in
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if user is a teacher or admin
  const userRole = session.user.role;
  if (userRole !== "teacher" && userRole !== "admin") {
    redirect("/learn");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">{children}</div>
    </div>
  );
}
