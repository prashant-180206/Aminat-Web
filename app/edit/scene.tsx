"use client";

import { useEffect, useRef } from "react";
import Scene from "@/core/classes/scene";
import { useScene } from "@/hooks/SceneContext";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/core/config";
import { Mobject } from "@/core/types/mobjects";
import { LatexShape } from "@/core/latexmanager";
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

      const equation = new LatexShape("\\int_0^\\infty x^2 dx", {
        x: 50,
        y: 50,
        fontSize: 40,
        color: "blue",
        draggable: true, // Now it's a first-class Konva object!
      });

      scene.layer.add(equation);
      scene.layer.draw();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerref} className=" inline-block overflow-hidden" />;
}
