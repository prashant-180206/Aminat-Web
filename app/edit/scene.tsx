"use client";

import { useEffect, useRef } from "react";
import Scene from "@/core/classes/scene";
import { useScene } from "@/hooks/SceneContext";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/core/config";
import { Mobject } from "@/core/types/mobjects";
// import { useScene } from "@/context/SceneContext";

export default function SceneView() {
  const { scene, setScene, setActiveMobject, setActiveMobjectId } = useScene();
  const containerref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerref.current && !scene) {
      const scene = new Scene({
        container: containerref.current,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
      });
      setScene(scene);

      scene.addMobjectFunction((mobj: Mobject) => {
        mobj.on("click", () => {
          scene.activeMobject = mobj;
          setActiveMobject(mobj);
          setActiveMobjectId(mobj.id());
          mobj.UpdateFromKonvaProperties();
        });
        scene.activeMobject = mobj;
        setActiveMobject(mobj);
        setActiveMobjectId(mobj.id());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerref}
      className=" inline-block "
      style={{
        height: DEFAULT_HEIGHT,
        width: DEFAULT_WIDTH,
        transformOrigin: "top left",
        scale: "0.45",
      }}
    />
  );
}
