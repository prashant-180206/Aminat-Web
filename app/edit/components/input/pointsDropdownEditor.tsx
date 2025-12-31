"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { NumberStepperInput } from "./numberInput";
import { Plus, X } from "lucide-react";

type Point = { x: number; y: number };

type Props = {
  points: Point[];
  onChange: (pts: Point[]) => void;
};

const PointsDropdownEditor = ({ points, onChange }: Props) => {
  const [localPoints, setLocalPoints] = useState<Point[]>(points);

  // scene → editor
  useEffect(() => {
    setLocalPoints(points);
  }, [points]);

  // editor → scene
  useEffect(() => {
    onChange(localPoints);
  }, [localPoints, onChange]);

  const updatePoint = (idx: number, partial: Partial<Point>) => {
    setLocalPoints((prev) => {
      const next = [...prev];
      next[idx] = {
        x: partial.x ?? prev[idx].x,
        y: partial.y ?? prev[idx].y,
      };
      return next;
    });
  };

  const removePoint = (idx: number) => {
    setLocalPoints((prev) => prev.filter((_, i) => i !== idx));
  };

  const addPoint = () => {
    setLocalPoints((prev) => {
      const last = prev[prev.length - 1];
      return [...prev, last ? { ...last } : { x: 0, y: 0 }];
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Points ({localPoints.length})
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-3 w-72 space-y-3">
        {/* Points list */}
        <div className="space-y-2">
          {localPoints.map((pt, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">#{idx}</span>

              <div className="flex items-center gap-2">
                <NumberStepperInput
                  value={pt.x}
                  onChange={(v) => updatePoint(idx, { x: v })}
                />
                <NumberStepperInput
                  value={pt.y}
                  onChange={(v) => updatePoint(idx, { y: v })}
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removePoint(idx)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add point */}
        <Button
          variant="secondary"
          size="sm"
          className="w-full gap-2"
          onClick={addPoint}
        >
          <Plus className="h-4 w-4" />
          Add Point
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PointsDropdownEditor;
