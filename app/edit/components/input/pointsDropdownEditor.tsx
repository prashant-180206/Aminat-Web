"use client";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { on } from "events";

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Points ({localPoints.length})
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-3 flex flex-col gap-3 w-64">
        {localPoints.map((pt, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input
              type="number"
              value={pt.x}
              onChange={(e) => {
                const next = [...localPoints];
                next[idx] = { ...pt, x: Number(e.target.value) };
                setLocalPoints(next);
              }}
            />
            <Input
              type="number"
              value={pt.y}
              onChange={(e) => {
                const next = [...localPoints];
                next[idx] = { ...pt, y: Number(e.target.value) };
                setLocalPoints(next);
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setLocalPoints(localPoints.filter((_, i) => i !== idx))
              }
            >
              ✕
            </Button>
          </div>
        ))}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            const last = localPoints[localPoints.length - 1];
            setLocalPoints([
              ...localPoints,
              last ? { ...last } : { x: 0, y: 0 },
            ]);
          }}
        >
          + Add Point
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PointsDropdownEditor;
