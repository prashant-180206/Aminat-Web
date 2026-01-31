"use client";

import { useEffect, useRef } from "react";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/core/config";
import { useLearnScene } from "@/hooks/LearnSceneContext";

interface LearnSceneViewProps {
  scaleFactor?: number;
}

export default function LearnSceneView({
  scaleFactor = 0.45,
}: LearnSceneViewProps) {
  const { setSceneContainer } = useLearnScene();
  const containerref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSceneContainer?.(containerref.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="aspect-video w-full max-w-5xl items-start justify-start bg-card border border-border overflow-hidden rounded-lg shadow-xl"
      style={{
        height: DEFAULT_HEIGHT * scaleFactor,
        width: DEFAULT_WIDTH * scaleFactor,
      }}
    >
      <div
        ref={containerref}
        id="learnCanvasParent"
        className=""
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
