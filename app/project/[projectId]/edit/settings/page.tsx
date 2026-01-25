"use client";
import { Button } from "@/components/ui/button";
import { useScene } from "@/hooks/SceneContext";
import React from "react";

export default function SettingsPage() {
  const { scene, activeMobject } = useScene();

  const duplicate = () => {
    const m1 = activeMobject;
    if (!scene || !m1) return;
    const m2 = scene.addMobject(m1.type());
    const f = m1.features.getData();
    m2.features.update({
      ...f,
      position: { x: f.position.x + 1, y: f.position.y + 1 },
    });
    // m2.copyFrom(m1);
  };
  return (
    <div className="w-[250px] p-4 text-sm">
      <h1 className="font-semibold mb-2">Settings</h1>
      <Button onClick={duplicate}>Duplicate Active Mobject</Button>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  );
}
