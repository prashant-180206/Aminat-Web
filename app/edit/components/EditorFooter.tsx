"use client";

import React from "react";
import { useScene } from "@/hooks/SceneContext";
import { Badge } from "@/components/ui/badge";

const EditorFooter = () => {
  const { scene, activeMobject } = useScene();

  const mobjectCount = scene?.mobjManager.mobjectsMeta.length || 0;
  const animationGroups = scene?.animManager.getOrder().length || 0;

  return (
    <footer className="w-full bg-card border-t border-border">
      <div className="flex items-center justify-between px-4 h-10">
        {/* Left - Selected Object Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {activeMobject ? (
            <span className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {activeMobject.getType()}
              </Badge>
              <span className="text-xs">ID: {activeMobject.id()}</span>
            </span>
          ) : (
            <span className="text-xs">No object selected</span>
          )}
        </div>

        {/* Center - Stats */}
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <span>
            {mobjectCount} Object{mobjectCount !== 1 ? "s" : ""}
          </span>
          <span>•</span>
          <span>
            {animationGroups} Animation Group{animationGroups !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Right - Help */}
        <div className="text-xs text-muted-foreground">
          <span className="hidden sm:inline">Press </span>
          <kbd className="px-2 py-0.5 text-xs bg-muted rounded border">?</kbd>
          <span className="hidden sm:inline"> for shortcuts</span>
        </div>
      </div>
    </footer>
  );
};

export default EditorFooter;
