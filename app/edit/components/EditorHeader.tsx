"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  Save,
  FolderOpen,
  FileText,
  Play,
  Download,
} from "lucide-react";
import { useScene } from "@/hooks/SceneContext";

const EditorHeader = () => {
  const { scene } = useScene();

  const handleNew = () => {
    if (confirm("Create a new project? Unsaved changes will be lost.")) {
      window.location.reload();
    }
  };

  const handleSave = () => {
    if (scene) {
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
    }
  };

  const handleOpen = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && scene) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            scene.loadFromObj(data);
          } catch (error) {
            console.error("Failed to load project:", error);
            alert("Failed to load project file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    // Placeholder for future video export functionality
    alert("Video export coming soon!");
  };

  const handlePlayAll = () => {
    scene?.animManager.animate();
  };

  const handleResetAll = () => {
    scene?.animManager.resetAll();
  };

  return (
    <header className="w-full bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Sparkles className="w-5 h-5 text-brand-from" />
          <span className="bg-linear-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
            Animat
          </span>
          <span className="text-xs text-muted-foreground font-normal ml-1">
            Editor
          </span>
        </Link>

        {/* File Menu */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                File
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={handleNew}>
                <FileText className="mr-2 h-4 w-4" />
                New Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpen}>
                <FolderOpen className="mr-2 h-4 w-4" />
                Open Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Animation Controls */}
          <div className="flex items-center gap-1 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayAll}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Play
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetAll}>
              Reset
            </Button>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              Exit Editor
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;
