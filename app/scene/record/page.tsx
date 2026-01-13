"use client";

import React, { useEffect } from "react";
import SceneView from "../scene";
import { useScene } from "@/hooks/SceneContext";
import { toast } from "sonner";
import KeyboardShortcuts from "./components/KeyboardShortcuts";
import RecordingControls from "./components/RecordingControls";
import AnimationProgress from "./components/AnimationProgress";
import ViewportInfo from "./components/ViewportInfo";
import InstructionsPanel from "./components/InstructionsPanel";
import RecordHeader from "./components/RecordHeader";

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

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <RecordHeader />

      {/* Main Content */}
      <div className="flex-1 bg-linear-to-br from-background to-accent/10 overflow-auto">
        <div className="h-full flex flex-col">
          {/* Hero Section - Scene Preview as Main Focus */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="flex flex-col items-center gap-6 w-full">
              {/* Title */}

              {/* Scene Canvas - Main Hero */}
              <div className="flex items-center justify-center">
                <SceneView scaleFactor={SCALE_FACTOR} />
              </div>

              {/* Progress Below Scene */}
              <div className="w-full max-w-2xl">
                <AnimationProgress />
              </div>
            </div>
          </div>

          {/* Bottom Controls & Info Section */}
          <div className="bg-card/50 border-t border-border px-6 py-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Instructions */}
              <div className="lg:col-span-2">
                <InstructionsPanel />
              </div>

              {/* Recording Controls */}
              <RecordingControls />

              {/* Keyboard Shortcuts */}
              <KeyboardShortcuts />

              {/* Viewport Info */}
              <ViewportInfo scaleFactor={SCALE_FACTOR} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordPage;
