"use client";
import React from "react";
import SceneView from "./scene";
import { Button } from "@/components/ui/button";
import { useScene } from "@/hooks/SceneContext";
// import { getScene } from "@/lib/scene";

const Edit = () => {
  const { scene } = useScene();
  return (
    <div>
      <SceneView />
      <div className="konva-container"></div>
      <Button
        onClick={() => {
          scene?.addMobject("circle");
        }}
      >
        Click me
      </Button>
    </div>
  );
};

export default Edit;
