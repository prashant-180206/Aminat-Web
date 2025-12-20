"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useScene } from "@/hooks/SceneContext";

const NumberField: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}> = ({ label, value, onChange, step = 0.1 }) => (
  <div className="flex items-center gap-2">
    <Label className="w-20 text-sm">{label}</Label>
    <Input
      type="number"
      className="w-24 py-1"
      step={step}
      value={Number.isFinite(value) ? value : 0}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
    />
  </div>
);

const AnimationsTab: React.FC = () => {
  const { scene, activeMobjectId } = useScene();
  const [duration, setDuration] = useState<number>(0.6);
  const [toX, setToX] = useState<number>(1);
  const [toY, setToY] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);

  const targetInfo = useMemo(() => {
    if (!scene || !activeMobjectId) return "No selection";
    return `Target: ${activeMobjectId}`;
  }, [scene, activeMobjectId]);

  const ensureTarget = () => scene && activeMobjectId;

  const create = () => {
    if (!ensureTarget()) return;
    scene!.createAnimation(activeMobjectId!, "create", { duration });
  };
  const destroy = () => {
    if (!ensureTarget()) return;
    scene!.createAnimation(activeMobjectId!, "destroy", { duration });
  };
  const move = () => {
    if (!ensureTarget()) return;
    scene!.createAnimation(activeMobjectId!, "move", {
      duration,
      to: { x: toX, y: toY },
    });
  };
  const scaleMove = () => {
    if (!ensureTarget()) return;
    scene!.createAnimation(activeMobjectId!, "scaleMove", {
      duration,
      to: { x: toX, y: toY },
      scale,
    });
  };

  return (
    <div className="p-4 flex flex-col gap-3 w-[300px]">
      <div className="text-xs text-zinc-500">{targetInfo}</div>
      <NumberField
        label="Duration"
        value={duration}
        onChange={setDuration}
        step={0.1}
      />
      <div className="flex gap-3">
        <NumberField label="To X" value={toX} onChange={setToX} step={0.1} />
        <NumberField label="To Y" value={toY} onChange={setToY} step={0.1} />
      </div>
      <NumberField label="Scale" value={scale} onChange={setScale} step={0.1} />

      <div className="grid grid-cols-2 gap-2 mt-2">
        <Button variant="default" onClick={create} disabled={!ensureTarget()}>
          Create
        </Button>
        <Button
          variant="destructive"
          disabled={!ensureTarget()}
          onClick={destroy}
        >
          Destroy
        </Button>
        <Button variant="outline" onClick={move} disabled={!ensureTarget()}>
          Move
        </Button>
        <Button
          variant="outline"
          onClick={scaleMove}
          disabled={!ensureTarget()}
        >
          Scale & Move
        </Button>
      </div>
    </div>
  );
};

export default AnimationsTab;
