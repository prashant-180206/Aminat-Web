"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "./ProjectCard";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface Project {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  scenes: Array<{ _id: string; title: string }>;
}

export function ProjectsGrid() {
  const {
    data: projectsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) {
        toast.error("Failed to load projects");
        throw new Error("Failed to fetch projects");
      }
      return res.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const projects: Project[] = projectsData?.projects || [];

  const handleProjectCreated = () => {
    refetch();
  };

  const handleProjectDeleted = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
        <CreateProjectDialog onProjectCreated={handleProjectCreated} />
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-4 text-6xl">🎬</div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            No projects yet
          </h2>
          <p className="text-muted-foreground mb-8">
            Create your first animation project to get started
          </p>
          <CreateProjectDialog onProjectCreated={handleProjectCreated} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onProjectDeleted={handleProjectDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
