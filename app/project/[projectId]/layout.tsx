import React from "react";
import dynamic from "next/dynamic";

const ProjectManagerHeader = dynamic(
  () => import("./components/ProjectManagerHeader")
);

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <ProjectManagerHeader projectId={projectId} />
      {children}
    </div>
  );
}
