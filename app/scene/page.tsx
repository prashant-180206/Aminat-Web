"use client";

import React from "react";
import { useRequireAuth } from "@/hooks/useAuth";
import { SceneHeader } from "./components/SceneHeader";
import { ProjectsGrid } from "./components/ProjectsGrid";
import { SceneFooter } from "./components/SceneFooter";
import { Skeleton } from "@/components/ui/skeleton";

export default function ScenePage() {
  const { isLoading: authLoading } = useRequireAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SceneHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-12 w-1/4 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SceneHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <ProjectsGrid />
      </main>
      <SceneFooter />
    </div>
  );
}
