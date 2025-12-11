"use client";
import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useScene } from "@/hooks/SceneContext";

// Lazy load heavy SceneView
const SceneView = React.lazy(() => import("./scene"));

const Edit = () => {
  const { scene } = useScene();

  return (
    <div className="h-screen w-screen bg-gray-100">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg">Loading scene...</div>
          </div>
        }
      >
        <SceneView />
      </Suspense>

      <Button
        className="absolute bottom-4 left-4 z-50"
        onClick={() => {
          scene?.addMobject("rect");
        }}
      >
        Add Curve
      </Button>
    </div>
  );
};

export default Edit;
