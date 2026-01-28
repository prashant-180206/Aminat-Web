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
      <div className="flex items-center justify-between px-2 md:px-4 h-8 md:h-10">
        {/* Left - Selected Object Info */}
        <div className="flex items-center gap-2 md:gap-4 text-sm text-muted-foreground">
          {activeMobject ? (
            <span className="flex items-center gap-1 md:gap-2">
              <Badge
                variant="secondary"
                className="text-[10px] md:text-xs px-1.5 py-0"
              >
                {activeMobject.getType()}
              </Badge>
              <span className="text-[10px] md:text-xs truncate max-w-[100px] sm:max-w-none">
                <span className="hidden sm:inline">ID: </span>
                {activeMobject.id()}
              </span>
            </span>
          ) : (
            <span className="text-[10px] md:text-xs">No object</span>
          )}
        </div>

        {/* Center - Stats */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-xs text-muted-foreground">
          <span>
            {mobjectCount} Object{mobjectCount !== 1 ? "s" : ""}
          </span>
          <span>•</span>
          <span>
            {animationGroups} Anim{animationGroups !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Right - Help */}
        <div className="text-[10px] md:text-xs text-muted-foreground">
          <span className="hidden lg:inline">Press </span>
          <kbd className="px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs bg-muted rounded border">
            ?
          </kbd>
          <span className="hidden lg:inline"> for shortcuts</span>
        </div>
      </div>
    </footer>
  );
};

export default EditorFooter;
