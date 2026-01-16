"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
const DropdownMenuTrigger = dynamic(
  () =>
    import("@/components/ui/dropdown-menu").then(
      (mod) => mod.DropdownMenuTrigger
    ),
  { ssr: false }
);
import { useScene } from "@/hooks/SceneContext";
import { FolderOpen, Save } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";
import { toast } from "sonner";

const LocalFileDropdown = () => {
  const { scene } = useScene();
  const handleFileSave = () => {
    if (!scene) return;
    const data = scene.storeAsObj();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `animat-project-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileOpen = () => {
    if (!scene) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            scene.loadFromObj(data);
          } catch (error) {
            console.error("Failed to load project:", error);
            toast.error("Failed to load project file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          File
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={handleFileOpen}>
          <FolderOpen className="mr-2 h-4 w-4" />
          Open File…
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFileSave}>
          <Save className="mr-2 h-4 w-4" />
          Save File…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocalFileDropdown;
