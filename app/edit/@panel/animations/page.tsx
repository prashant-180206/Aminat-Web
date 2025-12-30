"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useScene } from "@/hooks/SceneContext";
import { Menu, Trash2 } from "lucide-react";
import React from "react";

const AnimationSidePanel = () => {
  const { scene, setActiveMobject, setActiveMobjectId } = useScene();

  return (
    <Collapsible
      defaultOpen
      className="relative h-full flex flex-row bg-muted/40 border-r "
    >
      {/* Collapsed Toggle */}
      <CollapsibleTrigger asChild className="absolute top-2 right-2 z-10">
        <Button size="icon" variant="secondary" className="rounded-full shadow">
          <Menu className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>

      {/* Sidebar Content */}
      <CollapsibleContent className="w-[250px] h-full">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h1 className="font-semibold tracking-wide">Animation</h1>
          </div>

          {/* List */}
          <ScrollArea className="flex-1 px-2 py-3">
            <div className="space-y-2">
              {scene?.getMobjectsData().map((mobj) => (
                <div
                  key={mobj.id}
                  className="group rounded-md border bg-background px-3 py-2 hover:bg-muted transition"
                >
                  <div className="flex items-center justify-between gap-1 py-2">
                    {/* Select */}
                    <Button
                      onClick={() => {
                        scene.activeMobject = scene.getMobjectById(mobj.id);
                        setActiveMobjectId(mobj.id);
                        setActiveMobject(scene.getMobjectById(mobj.id));
                      }}
                      className="flex flex-col items-start text-left flex-1 bg-transparent hover:bg-transparent"
                    >
                      <span className="text-sm font-medium">{mobj.type}</span>
                      <span className="text-xs text-muted-foreground">
                        ID: {mobj.id}
                      </span>
                    </Button>

                    {/* Remove */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 text-destructive"
                      onClick={() => scene.removeMobject(mobj.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AnimationSidePanel;
