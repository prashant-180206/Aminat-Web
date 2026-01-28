"use client";
import { Button } from "@/components/ui/button";
import { useScene } from "@/hooks/SceneContext";
import React from "react";

export default function SettingsPage() {
  const { scene, activeMobject } = useScene();

  const duplicate = () => {
    const m1 = activeMobject;
    if (!scene || !m1) return;
    const m2 = scene.addMobject(m1.type());
    const f = m1.features.getData();
    m2.features.update({
      ...f,
      position: { x: f.position.x + 1, y: f.position.y + 1 },
    });
    // m2.copyFrom(m1);
  };
  return (
    <div className="h-full w-full flex flex-col bg-card overflow-auto no-scrollbar">
      {/* Header */}
      <div className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border-b bg-muted/30 flex-shrink-0">
        <h1 className="font-semibold text-xs sm:text-sm md:text-base leading-tight">
          Settings
        </h1>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-3 md:p-4 flex flex-col gap-2 sm:gap-3 md:gap-4 overflow-y-auto text-xs sm:text-sm">
        <Button onClick={duplicate} size="sm" className="w-full justify-start">
          Duplicate Active Mobject
        </Button>
        <p className="text-muted-foreground text-[10px] sm:text-xs">
          Coming soon.
        </p>
      </div>
    </div>
  );
}
