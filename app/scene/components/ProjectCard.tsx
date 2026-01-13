"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2, Edit, Play } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";

interface ProjectCardProps {
  project: {
    _id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    scenes: Array<{ _id: string; title: string }>;
  };
  onProjectDeleted?: () => void;
}

export function ProjectCard({ project, onProjectDeleted }: ProjectCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Failed to delete project");
        return;
      }

      toast.success("Project deleted successfully");
      setDeleteOpen(false);
      onProjectDeleted?.();
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const sceneCount = project.scenes?.length || 0;
  const createdDate = new Date(project.createdAt);

  return (
    <>
      <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground line-clamp-1">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {project.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/scene/edit?projectId=${project._id}`}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Project
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Project Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>
            {sceneCount} scene{sceneCount !== 1 ? "s" : ""}
          </span>
          <span>{format(createdDate, "MMM dd, yyyy")}</span>
        </div>

        {/* Action Button */}
        <Link href={`/scene/edit?projectId=${project._id}`}>
          <Button className="w-full gap-2">
            <Play className="w-4 h-4" />
            Open Project
          </Button>
        </Link>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will permanently delete &quot;{project.name}
              &quot; and all its scenes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
