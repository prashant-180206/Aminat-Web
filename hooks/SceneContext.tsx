// context/SceneContext.tsx
"use client";

import { createContext, useContext, useState } from "react";
import Scene from "@/core/classes/scene";
import { Mobject } from "@/core/types/mobjects";
// import { Mobject } from "@/core/maps/MobjectMap";

// context/SceneContext.tsx
interface SceneContextType {
  scene: Scene | null;
  setScene: (scene: Scene) => void;
  activeMobject: Mobject | null;
  setActiveMobject: (m: Mobject | null) => void;
  activeMobjectId: string | null;
  setActiveMobjectId: (id: string | null) => void;
  mobjRefresh: () => void;
  animRefresh: () => void;
  valRefresh: () => void;
  animToggle: boolean;
  mobjToggle: boolean;
  valToggle: boolean;
}

const SceneContext = createContext<SceneContextType | null>(null);

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [scene, setSceneState] = useState<Scene | null>(null);
  const [activeMobject, setActiveMobject] = useState<Mobject | null>(null);
  const [activeMobjectId, setActiveMobjectId] = useState<string | null>(null);
  const [mobjToggle, setMobjToggle] = useState(true);
  const [animToggle, setAnimToggle] = useState(true);
  const [valToggle, setValToggle] = useState(true);

  const setScene = (s: Scene) => setSceneState(s);
  const mobjRefresh = () => setMobjToggle((prev) => !prev);
  const animRefresh = () => setAnimToggle((prev) => !prev);
  const valRefresh = () => setValToggle((prev) => !prev);

  return (
    <SceneContext.Provider
      value={{
        scene,
        setScene,
        activeMobject,
        setActiveMobject,
        activeMobjectId,
        setActiveMobjectId,
        mobjRefresh,
        animRefresh,
        valRefresh,
        animToggle,
        mobjToggle,
        valToggle,
      }}
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
