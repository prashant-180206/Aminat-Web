"use client";

import { createContext, useContext, useState } from "react";
import Scene from "@/core/classes/scene";
import { Mobject } from "@/core/types/mobjects";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/core/config";

interface LearnSceneContextType {
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

const LearnSceneContext = createContext<LearnSceneContextType | null>(null);

export function LearnSceneProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scene, setScene] = useState<Scene | null>(null);
  const [activeMobject, setActiveMobject] = useState<Mobject | null>(null);
  const [activeMobjectId, setActiveMobjectId] = useState<string | null>(null);
  const [mobjToggle, setMobjToggle] = useState(true);
  const [animToggle, setAnimToggle] = useState(true);
  const [valToggle, setValToggle] = useState(true);

  const setSceneContainer = (container: HTMLDivElement) => {
    if (!scene) {
      const newScene = new Scene({
        container: container,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
      });
      setScene(newScene);

      newScene.addMobjectFunction((mobj: Mobject) => {
        mobj.on("click", () => {
          newScene.activeMobject = mobj;
          setActiveMobject(mobj);
          setActiveMobjectId(mobj.id());
          setMobjToggle((prev) => !prev);
        });
        newScene.activeMobject = mobj;
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
    <LearnSceneContext.Provider
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
    </LearnSceneContext.Provider>
  );
}

export function useLearnScene() {
  const ctx = useContext(LearnSceneContext);
  if (!ctx)
    throw new Error("useLearnScene must be used inside <LearnSceneProvider>");
  return ctx;
}
