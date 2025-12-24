"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useScene } from "@/hooks/SceneContext";
import { AnimInfo, AnimMeta } from "@/core/types/animation";
// import Konva from "@/lib/konva";
import { toast } from "sonner";
import { Combobox } from "@/components/combobox";
import { easingMap } from "@/core/maps/easingMap";

const AnimationsTab: React.FC = () => {
  const { scene, activeMobjectId, activeMobject } = useScene();

  const animNames = activeMobject?.animgetter.getAnimNames() || [];
  const [selectedAnim, setSelectedAnim] = useState<string | null>(
    animNames.length > 0 ? animNames[0] : null
  );
  const [input, setInput] = useState<{ [key: string]: string | number }>({});
  const [animMeta, setAnimMeta] = useState<AnimMeta | null>(
    activeMobject?.animgetter.getAnimMeta(selectedAnim!) || null
  );

  const [animGroup, setAnimGroup] = useState<AnimInfo[]>([]);

  const selectAnim = (name: string) => {
    setSelectedAnim(name);
    const meta = activeMobject?.animgetter.getAnimMeta(name) || null;
    setAnimMeta(meta);
    if (!meta) return;
    setInput(meta.input);
  };

  const addAnim = () => {
    if (!animMeta) return;
    const res = animMeta.func(input);
    if (!res) {
      return;
    }
    const newanimgrp = [...animGroup, res];
    setAnimGroup(newanimgrp);
    // setInput(animMeta.input);
  };

  const addAnimGroup = () => {
    // scene.
    if (!scene) return;
    if (animGroup.length === 0) return;
    // Logic to add the tweens as a Group
    scene.addAnimations(...animGroup);
    setAnimGroup([]);
  };

  return (
    <div className="p-4 flex flex-col gap-3 w-[250px]">
      <p>{"Target : " + activeMobjectId}</p>
      <Combobox
        options={animNames.map((name) => ({ label: name, value: name }))}
        value={selectedAnim}
        onChange={selectAnim}
      />

      {input &&
        Object.entries(input).map(([key, type]) => {
          if (key === "easing") {
            return (
              <Combobox
                key={key}
                options={Object.keys(easingMap).map((val) => ({
                  label: val,
                  value: val,
                }))}
                value={Object.keys(easingMap)[3]}
                onChange={(val) => {
                  setInput((prev) => ({ ...prev, [key]: val }));
                }}
                placeholder={key}
              />
            );
          }
          return (
            <div key={key} className="flex flex-col gap-1 ">
              <Label>{key}</Label>
              <Input
                type={type === "number" ? "number" : "text"}
                defaultValue={type === "number" ? 0 : key}
                onChange={(e) => {
                  const value =
                    type === "number" ? Number(e.target.value) : e.target.value;
                  setInput((prev) => ({ ...prev, [key]: value }));
                }}
              />
            </div>
          );
        })}

      <Button
        onClick={() => {
          addAnim();
          toast.success(
            "Animation group added (not really, this is a placeholder)"
          );
        }}
      >
        Add Animation
      </Button>
      <Button onClick={addAnimGroup}>Add Animation Group</Button>

      {/* <Button
        onClick={() => {
          scene?.playCurrentGroup();
        }}
      >
        Play Current Group
      </Button>
      <Button
        onClick={() => {
          scene?.resetAnimations();
        }}
      >
        Reset All Animations
      </Button> */}
    </div>
  );
};

export default AnimationsTab;
