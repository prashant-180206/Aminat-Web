"use client";

import { useEffect, useRef } from "react";
// import Scene from "@/core/classes/scene";
import { useScene } from "@/hooks/SceneContext";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/core/config";
// import { Mobject } from "@/core/types/mobjects";
// import { useScene } from "@/context/SceneContext";

interface SceneViewProps {
  scaleFactor?: number;
}

export default function SceneView({ scaleFactor = 0.45 }: SceneViewProps) {
  const { setSceneContainer } = useScene();
  const containerref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSceneContainer?.(containerref.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="flex flex-row items-start justify-start bg-card border-2 border-border  overflow-hidden rounded-lg shadow-xl mx-4"
      style={{
        height: DEFAULT_HEIGHT * scaleFactor,
        width: DEFAULT_WIDTH * scaleFactor,
      }}
    >
      <div
        ref={containerref}
        id="canvasParent"
        className="inline-block "
        style={{
          height: DEFAULT_HEIGHT,
          width: DEFAULT_WIDTH,
          transformOrigin: "top left",
          scale: scaleFactor,
        }}
      />
    </div>
  );
}
