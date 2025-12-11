// context/SceneContext.tsx
"use client";

import { createContext, useContext, useState } from "react";
import Scene from "@/core/classes/scene";

interface SceneContextType {
  scene: Scene | null;
  setScene: (scene: Scene) => void;
}

const SceneContext = createContext<SceneContextType | null>(null);

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [scene, setSceneState] = useState<Scene | null>(null);

  const setScene = (s: Scene) => setSceneState(s);

  return (
    <SceneContext.Provider value={{ scene, setScene }}>
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useScene must be used inside <SceneProvider>");
  return ctx;
}
