"use client";
import React from "react";
import { usePropertyDescriptors } from "./input/propertyDescriptor";
import { PropertyInput } from "./propertyCard";
import { Button } from "@/components/ui/button";
import { useScene } from "@/hooks/SceneContext";

const PropertiesEditor = () => {
  const properties = usePropertyDescriptors();
  const { scene, setActiveMobject } = useScene();

  return (
    <div className="w-5/6 flex flex-row flex-wrap gap-4 mb-4 justify-center items-center">
      {properties.map((item, index) => (
        <PropertyInput key={index} item={item} />
      ))}

      <Button
        variant={"destructive"}
        onClick={() => {
          if (scene && scene.activeMobject) {
            scene.removeMobject(scene.activeMobject.id());
            setActiveMobject(null);
          }
        }}
      >
        Remove
      </Button>
    </div>
  );
};

export default PropertiesEditor;
