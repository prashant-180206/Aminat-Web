// context/SceneContext.tsx
"use client";

import { createContext, useContext, useState } from "react";
import Scene from "@/core/classes/scene";
import { Mobject } from "@/core/maps/MobjectMap";

// context/SceneContext.tsx
interface SceneContextType {
  scene: Scene | null;
  setScene: (scene: Scene) => void;
  activeMobject: Mobject | null;
  setActiveMobject: (m: Mobject | null) => void;
}

const SceneContext = createContext<SceneContextType | null>(null);

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [scene, setSceneState] = useState<Scene | null>(null);
  const [activeMobject, setActiveMobject] = useState<Mobject | null>(null);

  const setScene = (s: Scene) => setSceneState(s);

  return (
    <SceneContext.Provider
      value={{ scene, setScene, activeMobject, setActiveMobject }}
    >
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useScene must be used inside <SceneProvider>");
  return ctx;
}
