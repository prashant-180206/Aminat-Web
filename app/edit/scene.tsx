"use client";

import { useEffect, useRef } from "react";
import Scene from "@/core/classes/scene";
import { useScene } from "@/hooks/SceneContext";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/core/config";
// import { useScene } from "@/context/SceneContext";

export default function SceneView() {
  const { setScene } = useScene();
  const containerref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerref.current) {
      const scene = new Scene({
        container: containerref.current,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
      });
      setScene(scene);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerref} className=" inline-block " />;
}
