// context/SceneContext.tsx
"use client";

import { createContext, useContext, useState } from "react";
import Scene from "@/core/classes/scene";
import { Mobject } from "@/core/types/mobjects";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/core/config";

interface SceneContextType {
  scene: Scene | null;
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
  setSceneContainer?: (container: HTMLDivElement) => void;
}

const SceneContext = createContext<SceneContextType | null>(null);

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [scene, setScene] = useState<Scene | null>(null);
  const [activeMobject, setActiveMobject] = useState<Mobject | null>(null);
  const [activeMobjectId, setActiveMobjectId] = useState<string | null>(null);
  const [mobjToggle, setMobjToggle] = useState(true);
  const [animToggle, setAnimToggle] = useState(true);
  const [valToggle, setValToggle] = useState(true);

  const setSceneContainer = (container: HTMLDivElement) => {
    if (!scene) {
      const scene = new Scene({
        container: container,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
      });
      setScene(scene);

      scene.addMobjectFunction((mobj: Mobject) => {
        mobj.on("dragmove", mobj.UpdateFromKonvaProperties);
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
    if (scene) {
      scene.setContainer(container);
    }
  };

  const mobjRefresh = () => setMobjToggle((prev) => !prev);
  const animRefresh = () => setAnimToggle((prev) => !prev);
  const valRefresh = () => setValToggle((prev) => !prev);

  return (
    <SceneContext.Provider
      value={{
        scene,
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
        setSceneContainer,
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
