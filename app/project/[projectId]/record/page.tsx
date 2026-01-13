"use client";

import React, { useEffect } from "react";
import SceneView from "../../scene";
import { useScene } from "@/hooks/SceneContext";
import { toast } from "sonner";
import KeyboardShortcuts from "./components/KeyboardShortcuts";
import RecordingControls from "./components/RecordingControls";
import InstructionsPanel from "./components/InstructionsPanel";
import TimeLine from "../edit/timeline";
import { TinyRecorderScene } from "../edit/recorder";

const SCALE_FACTOR = 0.6;

const RecordPage = () => {
  const { scene, animToggle, animRefresh } = useScene();
  void animToggle;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger shortcuts for lowercase 'r' or arrows
      if (event.key === "ArrowRight") {
        const res = scene?.animManager.animate();
        if (!res) toast.error("All animations have been played");
        animRefresh();
        event.preventDefault();
      } else if (event.key === "ArrowLeft") {
        const res = scene?.animManager.reverseAnimate();
        if (!res) toast.error("All animations have been reversed");
        animRefresh();
        event.preventDefault();
      } else if (event.key === "r" || event.key === "R") {
        scene?.animManager.resetAll();
        animRefresh();
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    if (scene) scene.editMode = false;

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (scene) scene.editMode = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[calc(100vh-3.6rem)] h-auto bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 bg-linear-to-br from-background to-accent/10 ">
        <div className="h-full flex flex-col">
          {/* Hero Section - Scene Preview as Main Focus */}
          <div className="flex-1 flex items-start justify-center p-6">
            <div className="flex flex-col md:flex-row items-center gap-6 w-full">
              {/* Scene Canvas - Main Hero */}
              <div className="flex flex-col items-center justify-center">
                <SceneView scaleFactor={SCALE_FACTOR} />
                <TimeLine />
              </div>
            </div>
            <div className="gap-2  flex flex-col overflow-auto">
              <TinyRecorderScene />
              <InstructionsPanel />
              <RecordingControls />
              <KeyboardShortcuts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordPage;
