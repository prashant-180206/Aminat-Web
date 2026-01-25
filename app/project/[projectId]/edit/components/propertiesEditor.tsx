"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useScene } from "@/hooks/SceneContext";
import { Copy, SquarePlay, Trash2 } from "lucide-react";
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

  return (
    <div className="w-full max-w-5xl  px-6 py-6">
      {/* Canvas-style container */}
      <div className="rounded-xl bg-muted/20 border p-2">
        <div className="flex flex-wrap items-center gap-4 justify-center">
          <div className="flex bg-card rounded-lg h-8 border px-4 items-center">
            ID : {activeMobject.id()}
          </div>

          {...activeMobject
            .getUIComponents()
            .map(({ name, component }) => <div key={name}>{component}</div>)}

          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => {
              if (scene && scene.activeMobject) {
                duplicate();
              }
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => {
              if (scene && scene.activeMobject) {
                quickAnimate();
              }
            }}
          >
            <SquarePlay className="h-4 w-4" />
          </Button>
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
