"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
// import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useScene } from "@/hooks/SceneContext";
import { Menu, Film } from "lucide-react";
import { AnimationGroupCard } from "./AnimationGroupCard";

const AnimationSidePanel = () => {
  // reading animToggle is enough to re-render on change
  const { scene, animToggle, animRefresh } = useScene();

  if (!scene) return null;
  void animToggle;

  const activeIndex = scene.animManager.activeIndex ?? -1;
  const groups = scene.animManager.getGroupsWithMeta();

  return (
    <Collapsible
      defaultOpen
      className="relative h-full flex flex-row bg-linear-to-b from-muted/30 to-muted/10 border-r"
    >
      {/* Collapse toggle */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <CollapsibleTrigger asChild className="absolute top-3 right-3 z-10">
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Toggle panel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Sidebar */}
      <CollapsibleContent className="w-[300px] h-screen overflow-auto no-scrollbar">
        <div className="flex flex-col ">
          {/* Header */}
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Film className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-semibold text-lg tracking-tight">
                    Animations
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {groups.length} {groups.length === 1 ? "group" : "groups"}
                  </p>
                </div>
              </div>

              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={animRefresh}
                      className="h-9 w-9"
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh animations</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
            <Separator />
          </div>

          {/* Animation list */}

          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="p-4 rounded-full bg-muted mb-3">
                <Film className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                No animations yet
              </p>
              <p className="text-xs text-muted-foreground">
                Create your first animation to get started
              </p>
            </div>
          ) : (
            groups.map((group, idx) => (
              <AnimationGroupCard
                key={idx}
                groupIndex={idx}
                animations={group}
                isActive={activeIndex === idx}
                isFirst={idx === 0}
                isLast={idx === groups.length - 1}
                onMoveUp={() => {
                  scene.animManager.moveGroup(idx, "up");
                  animRefresh();
                }}
                onMoveDown={() => {
                  scene.animManager.moveGroup(idx, "down");
                  animRefresh();
                }}
                onDeleteAnimation={(animId) => {
                  scene.animManager.removeAnimation(animId);
                  animRefresh();
                }}
              />
            ))
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AnimationSidePanel;
