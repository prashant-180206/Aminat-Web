"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useScene } from "@/hooks/SceneContext";
import { Trash2 } from "lucide-react";

const PropertiesEditor = () => {
  // const properties = usePropertyDescriptors();
  const {
    scene,
    setActiveMobject,
    setActiveMobjectId,
    activeMobject,
    mobjToggle,
  } = useScene();
  void mobjToggle;

  if (!activeMobject) {
    return <div></div>;
  }

  return (
    <div className="w-full max-w-5xl  px-6 py-6">
      {/* Canvas-style container */}
      <div className="rounded-xl bg-muted/20 border p-2">
        <div className="flex flex-wrap items-center gap-4 justify-center">
          <div className="flex bg-card rounded-lg h-8 border px-4 items-center">
            ID : {activeMobject.id()}
          </div>
          <div className="flex flex-row gap-2">
            {activeMobject.getUIComponents().map(({ name, component }) => (
              <div key={name}>{component}</div>
            ))}
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => {
              if (scene && scene.activeMobject) {
                scene.removeMobject(scene.activeMobject.id());
                setActiveMobject(null);
                setActiveMobjectId(null);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesEditor;
