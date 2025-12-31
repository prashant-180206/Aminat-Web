"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useScene } from "@/hooks/SceneContext";
import { Menu, Trash2, Layers } from "lucide-react";
import React from "react";

const MobjectsSidePanel = () => {
  const { scene, setActiveMobject, setActiveMobjectId, activeMobjectId } =
    useScene();

  const mobjects = scene?.getMobjectsData() || [];

  return (
    <Collapsible
      defaultOpen
      className="relative h-full flex flex-row bg-card border-r"
    >
      {/* Collapsed Toggle */}
      <CollapsibleTrigger asChild className="absolute top-2 right-2 z-10">
        <Button size="icon" variant="ghost" className="rounded-full shadow-sm">
          <Menu className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>

      {/* Sidebar Content */}
      <CollapsibleContent className="w-[280px] h-full">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <h1 className="font-semibold tracking-wide">Objects</h1>
            </div>
            <Badge variant="secondary" className="text-xs">
              {mobjects.length}
            </Badge>
          </div>

          {/* List */}
          <ScrollArea className="flex-1 px-3 py-3">
            {mobjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Layers className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No objects yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create objects from the sidebar
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {mobjects.map((mobj) => (
                  <div
                    key={mobj.id}
                    className={`group rounded-lg border transition-all ${
                      activeMobjectId === mobj.id
                        ? "bg-primary/10 border-primary shadow-sm"
                        : "bg-card hover:bg-accent border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2 p-3">
                      {/* Select Button */}
                      <button
                        onClick={() => {
                          if (!scene) return;
                          scene.activeMobject = scene.getMobjectById(mobj.id);
                          setActiveMobjectId(mobj.id);
                          setActiveMobject(scene.getMobjectById(mobj.id));
                        }}
                        className="flex-1 flex flex-col items-start text-left"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-sm font-medium truncate">
                            {mobj.type}
                          </span>
                          {activeMobjectId === mobj.id && (
                            <Badge
                              variant="default"
                              className="text-xs px-1.5 py-0"
                            >
                              Active
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground truncate">
                          {mobj.id}
                        </span>
                      </button>

                      {/* Remove Button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          scene?.removeMobject(mobj.id);
                          if (activeMobjectId === mobj.id) {
                            setActiveMobject(null);
                            setActiveMobjectId(null);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <Separator />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MobjectsSidePanel;
