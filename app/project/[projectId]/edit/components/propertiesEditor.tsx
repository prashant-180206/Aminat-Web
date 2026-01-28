"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useScene } from "@/hooks/SceneContext";
import { Copy, Spotlight, SquarePlay, Trash2 } from "lucide-react";
import { MText } from "@/core/classes/mobjects/text/text";

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
  const duplicate = () => {
    const m1 = activeMobject;
    if (!scene || !m1) return;
    const m2 = scene.addMobject(m1.type());
    const f = m1.features.getData();
    m2.features.update({
      ...f,
      position: { x: f.position.x + 1, y: f.position.y + 1 },
    });
  };

  const quickAnimate = () => {
    if (!scene || !activeMobject) return;
    let funcname = "Create";
    if (activeMobject instanceof MText) {
      funcname = "WriteText";
    }
    const anim = activeMobject.animgetter.getAnimMeta(funcname);
    if (!anim) return;
    const res = anim.func({ duration: 2, easing: "EaseInOut" });
    if (!res) return;
    scene.animManager.addAnimations(res);
  };
  const quickFocus = () => {
    if (!scene || !activeMobject) return;
    const anim = activeMobject.animgetter.getAnimMeta("Focus");
    if (!anim) return;
    const res = anim.func({ duration: 1, easing: "EaseInOut" });
    if (!res) return;
    scene.animManager.addAnimations(res);
  };

  return (
    <div className="w-full max-w-5xl px-2 md:px-6 py-2 md:py-6">
      {/* Canvas-style container */}
      <div className="rounded-lg md:rounded-xl bg-muted/20 border p-2 md:p-3">
        <div className="flex flex-wrap items-center gap-2 md:gap-4 justify-center">
          <div className="flex bg-card rounded-md md:rounded-lg h-7 md:h-8 border px-2 md:px-4 items-center text-xs md:text-sm">
            <span className="hidden sm:inline">ID : </span>
            {activeMobject.id()}
          </div>

          {...activeMobject
            .getUIComponents()
            .map(({ name, component }) => <div key={name}>{component}</div>)}

          <Button
            variant="secondary"
            size="sm"
            className="gap-1 md:gap-2 h-7 md:h-8 px-2 md:px-3"
            onClick={() => {
              if (scene && scene.activeMobject) {
                duplicate();
              }
            }}
          >
            <Copy className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline text-xs">Duplicate</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1 md:gap-2 h-7 md:h-8 px-2 md:px-3"
            onClick={() => {
              if (scene && scene.activeMobject) {
                quickAnimate();
              }
            }}
          >
            <SquarePlay className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline text-xs">Animate</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1 md:gap-2 h-7 md:h-8 px-2 md:px-3"
            onClick={() => {
              if (scene && scene.activeMobject) {
                quickFocus();
              }
            }}
          >
            <Spotlight className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline text-xs">Focus</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="gap-1 md:gap-2 h-7 md:h-8 px-2 md:px-3"
            onClick={() => {
              if (scene && scene.activeMobject) {
                scene.removeMobject(activeMobject.id());
                setActiveMobject(null);
                setActiveMobjectId(null);
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline text-xs">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesEditor;
