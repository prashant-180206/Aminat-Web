"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ArrowUp, ArrowDown, Move } from "lucide-react";

type Point = {
  x: number;
  y: number;
};

type PointInputProps = {
  property: string;
  value: Point;
  onChange: (val: Point) => void;
  refreshFunc: () => void;
  min?: number;
  max?: number;
  step?: number;
};

export const PointInput: React.FC<PointInputProps> = ({
  property,
  value,
  onChange,
  refreshFunc,
  min = -999,
  max = 999,
  step = 1,
}) => {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const update = (partial: Partial<Point>) => {
    const next = {
      x: partial.x ?? value.x,
      y: partial.y ?? value.y,
    };
    onChange(next);
    refreshFunc();
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <span className="text-sm font-medium">{property}</span>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-xs font-mono"
          >
            <Move className="h-4 w-4" />
            {value.x}, {value.y}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-60 space-y-3">
          {/* X axis */}
          <div className="flex items-center justify-between ">
            <span className="text-xs text-muted-foreground">X</span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => update({ x: clamp(value.x - step) })}
                // className="border-none"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>

              <Input
                type="number"
                value={value.x}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!Number.isNaN(v)) update({ x: clamp(v) });
                }}
                className="h-8 w-20 text-xs font-mono"
              />

              <Button
                variant="outline"
                size="icon"
                onClick={() => update({ x: clamp(value.x + step) })}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Y axis */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs text-muted-foreground">Y</span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => update({ y: clamp(value.y - step) })}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>

              <Input
                type="number"
                value={value.y}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!Number.isNaN(v)) update({ y: clamp(v) });
                }}
                className="h-8 w-20 text-xs font-mono"
              />

              <Button
                variant="outline"
                size="icon"
                onClick={() => update({ y: clamp(value.y + step) })}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
