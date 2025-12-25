"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useScene } from "@/hooks/SceneContext";
import { AnimInfo, AnimMeta } from "@/core/types/animation";
import { toast } from "sonner";
import { Combobox } from "@/components/combobox";
import { easingMap } from "@/core/maps/easingMap";
import { Separator } from "@/components/ui/separator";

const AnimationsTab: React.FC = () => {
  const { scene, activeMobjectId, activeMobject } = useScene();

  const animNames = activeMobject?.animgetter.getAnimNames() || [];

  const [selectedAnim, setSelectedAnim] = useState<string | null>(null);
  const [animMeta, setAnimMeta] = useState<AnimMeta | null>(null);

  const [inputData, setInputData] = useState<
    Record<string, "string" | "number">
  >({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [inputObject, setInputObject] = useState<Record<string, any>>({
    duration: 1,
    easing: Object.keys(easingMap)[3],
  });
  const [animGroup, setAnimGroup] = useState<AnimInfo[]>([]);

  const selectAnim = (name: string) => {
    setSelectedAnim(name);
    const meta = activeMobject?.animgetter.getAnimMeta(name) || null;
    setAnimMeta(meta);
    if (!meta) return;

    setInputData(meta.input);
    setInputObject({
      easing: Object.keys(easingMap)[3],
    });
  };

  useEffect(() => {
    if (!animNames.length) return;
    selectAnim(animNames[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMobjectId]);

  const addAnim = () => {
    if (!animMeta) return;
    const res = animMeta.func(inputObject);
    if (!res) return;

    setAnimGroup((prev) => [...prev, res]);
    toast.success("Animation staged");
  };

  const addAnimGroup = () => {
    if (!scene || animGroup.length === 0) return;
    scene.addAnimations(...animGroup);
    setAnimGroup([]);
    toast.success("Animation group added to timeline");
  };

  return (
    <div className="w-[250px] p-4 flex flex-col gap-4 text-sm h-screen no-scrollbar overflow-y-auto">
      {/* Target */}
      <div className="rounded-md bg-muted px-3 py-2">
        <div className="text-xs text-muted-foreground">Target</div>
        <div className="font-medium truncate">{activeMobjectId}</div>
      </div>

      {/* Animation selector */}
      <div className="flex flex-col gap-2">
        <Label>Animation</Label>
        <Combobox
          options={animNames.map((name) => ({
            label: name,
            value: name,
          }))}
          value={selectedAnim}
          onChange={selectAnim}
          placeholder="Select animation"
        />
      </div>

      <Separator />

      {/* Parameters */}
      {animMeta && (
        <div className="flex flex-col gap-3">
          <div className="text-xs font-medium text-muted-foreground">
            Parameters
          </div>

          {Object.entries(inputData).map(([key, type]) => {
            if (key === "easing") {
              return (
                <div key={key} className="flex flex-col gap-1">
                  <Label>{key}</Label>
                  <Combobox
                    options={Object.keys(easingMap).map((val) => ({
                      label: val,
                      value: val,
                    }))}
                    value={inputObject[key]}
                    onChange={(val) =>
                      setInputObject((prev) => ({ ...prev, [key]: val }))
                    }
                  />
                </div>
              );
            }

            return (
              <div key={key} className="flex flex-col gap-1">
                <Label>{key}</Label>
                <Input
                  type={type === "number" ? "number" : "text"}
                  defaultValue={inputObject[key] ?? "0"}
                  onChange={(e) =>
                    setInputObject((prev) => ({
                      ...prev,
                      [key]:
                        type === "number"
                          ? Number(e.target.value)
                          : e.target.value,
                    }))
                  }
                />
              </div>
            );
          })}
        </div>
      )}

      <Button size="sm" onClick={addAnim}>
        Stage Animation
      </Button>

      <Separator />

      {/* Staged group */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-muted-foreground">
          Current Group
        </div>

        {animGroup.length === 0 && (
          <div className="text-xs text-muted-foreground italic">
            No animations staged
          </div>
        )}

        {animGroup.map((anim) => (
          <div
            key={anim.id}
            className="rounded-md border px-2 py-2 flex flex-col gap-1"
          >
            <div className="font-medium">{anim.label}</div>
            <div className="text-xs text-muted-foreground">
              {anim.type} • {anim.mobjId}
            </div>

            <Button
              // size="xs"
              variant="destructive"
              className="mt-1"
              onClick={() => {
                anim.anim.destroy();
                setAnimGroup((prev) => prev.filter((a) => a.id !== anim.id));
              }}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      <Button onClick={addAnimGroup} disabled={animGroup.length === 0}>
        Add Animation Group
      </Button>
    </div>
  );
};

export default AnimationsTab;
