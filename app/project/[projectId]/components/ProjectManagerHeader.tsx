/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Save, Sparkles, Trash2, Edit, Layers } from "lucide-react";
import { useScene } from "@/hooks/SceneContext";
import RenameDialog from "./RenameDialog";
import NewSceneDialog from "./NewSceneDialog";
import SaveSceneDialog from "./SaveSceneDialog";
import LoadSceneDialog from "./LoadSceneDialog";
import DeleteDialog from "./DeleteDialog";
import { ProjectDoc, SceneDoc } from "./types";
import LocalFileDropdown from "./LocalFileDropdown";

interface ProjectManagerHeaderProps {
  projectId?: string;
}

const ProjectManagerHeader: React.FC<ProjectManagerHeaderProps> = ({
  projectId,
}) => {
  const params = useParams<{ projectId: string }>();
  const resolvedProjectId = projectId ?? params?.projectId;
  const router = useRouter();
  const { scene } = useScene();

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSceneOpen, setNewSceneOpen] = useState(false);
  const [newSceneTitle, setNewSceneTitle] = useState("");
  const [saveSceneOpen, setSaveSceneOpen] = useState(false);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [loadSceneOpen, setLoadSceneOpen] = useState(false);
  const canPersistScene = useMemo(() => Boolean(scene), [scene]);

  const projectQuery = useQuery({
    queryKey: ["project", resolvedProjectId],
    enabled: Boolean(resolvedProjectId),
    queryFn: async () => {
      const res = await fetch(`/api/projects/${resolvedProjectId}`);
      if (!res.ok) {
        toast.error("Failed to load project details");
        throw new Error("Failed to fetch project");
      }
      const data = await res.json();
      setNewName(data.project?.name ?? "");
      setNewDescription(data.project?.description ?? "");
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });

  const scenesQuery = useQuery({
    queryKey: ["project", resolvedProjectId, "scenes"],
    enabled: Boolean(resolvedProjectId),
    queryFn: async () => {
      const res = await fetch(`/api/projects/${resolvedProjectId}/scenes`);
      if (!res.ok) {
        toast.error("Failed to load scenes");
        throw new Error("Failed to fetch scenes");
      }
      return res.json();
    },
    staleTime: 60 * 1000,
  });

  const project: ProjectDoc | null = projectQuery.data?.project ?? null;
  const scenes: SceneDoc[] = scenesQuery.data?.scenes ?? [];

  const handleRename = async () => {
    if (!resolvedProjectId) return;
    try {
      const res = await fetch(`/api/projects/${resolvedProjectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Rename failed");
      toast.success("Project updated");
      setRenameOpen(false);
      projectQuery.refetch();
    } catch (e: any) {
      toast.error(e.message || "Failed to update project");
    }
  };

  const handleDelete = async () => {
    if (!resolvedProjectId) return;
    try {
      const res = await fetch(`/api/projects/${resolvedProjectId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Delete failed");
      toast.success("Project deleted");
      setConfirmDeleteOpen(false);
      router.push("/project");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  const handleCreateScene = async () => {
    if (!scene || !resolvedProjectId) {
      toast.error("Scene not ready");
      return;
    }
    try {
      const payload = {
        title: newSceneTitle || `Scene ${scenes.length + 1}`,
        data: scene.storeAsObj(),
      };
      const res = await fetch(`/api/projects/${resolvedProjectId}/scenes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Create scene failed");
      toast.success("Scene created");
      setNewSceneTitle("");
      setNewSceneOpen(false);
      scenesQuery.refetch();
    } catch (e: any) {
      toast.error(e.message || "Failed to create scene");
    }
  };

  const handleSaveSceneTo = async () => {
    if (!scene || !selectedSceneId || !resolvedProjectId) {
      toast.error("Select a scene to save");
      return;
    }
    try {
      const payload = {
        title:
          scenes.find((s) => s._id === selectedSceneId)?.title || "Untitled",
        data: scene.storeAsObj(),
      };
      const res = await fetch(
        `/api/projects/${resolvedProjectId}/scenes/${selectedSceneId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");
      toast.success("Scene saved");
      setSaveSceneOpen(false);
      setSelectedSceneId(null);
      scenesQuery.refetch();
    } catch (e: any) {
      toast.error(e.message || "Failed to save scene");
    }
  };

  const handleLoadScene = async (sceneId: string) => {
    if (!scene || !resolvedProjectId) {
      toast.error("Scene not ready");
      return;
    }
    try {
      const res = await fetch(
        `/api/projects/${resolvedProjectId}/scenes/${sceneId}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load scene");
      scene.loadFromObj(data.scene?.data);
      toast.success("Scene loaded into editor");
      setLoadSceneOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to load scene");
    }
  };

  return (
    <header className="w-full bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg shrink-0"
          >
            <Sparkles className="w-5 h-5 text-brand-from" />
            <span className="bg-linear-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
              Animat
            </span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <div className="truncate">
            <span className="text-sm font-medium truncate">
              {projectQuery.isLoading ? "Loading…" : project?.name ?? "Project"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Project
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setConfirmDeleteOpen(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/project/${resolvedProjectId}/edit`}>
                  Open Editor
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/project/${resolvedProjectId}/record`}>
                  Open Recorder
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Layers className="mr-2 h-4 w-4" />
                Scenes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56">
              <DropdownMenuItem
                disabled={!canPersistScene}
                onClick={() => setNewSceneOpen(true)}
              >
                <Save className="mr-2 h-4 w-4" />
                New from current
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!canPersistScene}
                onClick={() => setSaveSceneOpen(true)}
              >
                <Save className="mr-2 h-4 w-4" />
                Save to existing…
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {scenes.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No scenes
                </div>
              ) : (
                scenes.map((s) => (
                  <DropdownMenuItem
                    key={s._id}
                    onClick={() => {
                      setLoadSceneOpen(true);
                    }}
                  >
                    {s.title}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <LocalFileDropdown />
          <Link href="/project">
            <Button variant="ghost" size="sm">
              Projects
            </Button>
          </Link>
        </div>
      </div>
      <RenameDialog
        open={renameOpen}
        name={newName}
        description={newDescription}
        onOpenChange={setRenameOpen}
        onSave={handleRename}
        onNameChange={setNewName}
        onDescriptionChange={setNewDescription}
      />
      <NewSceneDialog
        open={newSceneOpen}
        title={newSceneTitle}
        onOpenChange={setNewSceneOpen}
        onTitleChange={setNewSceneTitle}
        onCreate={handleCreateScene}
        disabled={!canPersistScene}
      />
      <SaveSceneDialog
        open={saveSceneOpen}
        scenes={scenes}
        selectedId={selectedSceneId}
        onOpenChange={setSaveSceneOpen}
        onSelect={setSelectedSceneId}
        onSave={handleSaveSceneTo}
        disabled={!canPersistScene}
      />
      <LoadSceneDialog
        open={loadSceneOpen}
        scenes={scenes}
        onOpenChange={setLoadSceneOpen}
        onSelect={handleLoadScene}
      />
      <DeleteDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onDelete={handleDelete}
      />
    </header>
  );
};

export default ProjectManagerHeader;
