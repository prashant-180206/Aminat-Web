"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { NumberStepperInput } from "./numberInput";
import { LineChart } from "lucide-react";

type Point = {
  x: number;
  y: number;
};

type LineEnds = {
  start: Point;
  end: Point;
};

type LineEndsInputProps = {
  property: string;
  value: LineEnds;
  onChange: (val: LineEnds) => void;
  refreshFunc: () => void;
  min?: number;
  max?: number;
};

export const LineEndsInput: React.FC<LineEndsInputProps> = ({
  //   property,
  value,
  onChange,
  refreshFunc,
  min = -999,
  max = 999,
}) => {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const updateStart = (partial: Partial<Point>) => {
    const next: LineEnds = {
      ...value,
      start: {
        x: partial.x ?? value.start.x,
        y: partial.y ?? value.start.y,
      },
    };
    onChange(next);
    refreshFunc();
  };

  const updateEnd = (partial: Partial<Point>) => {
    const next: LineEnds = {
      ...value,
      end: {
        x: partial.x ?? value.end.x,
        y: partial.y ?? value.end.y,
      },
    };
    onChange(next);
    refreshFunc();
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      {/* <span className="text-sm font-medium">{property}</span> */}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-xs font-mono"
          >
            <LineChart className="h-4 w-4" />
            {/* S({value.start.x.toFixed(2)}, {value.start.y.toFixed(2)}) · E(
            {value.end.x.toFixed(2)}, {value.end.y.toFixed(2)}) */}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-44 space-y-4">
          {/* Start point */}
          <div className="space-y-2">
            <div className="text-xs font-medium">Start</div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">X</span>
              <NumberStepperInput
                value={value.start.x}
                onChange={(v) => updateStart({ x: clamp(v) })}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Y</span>
              <NumberStepperInput
                value={value.start.y}
                onChange={(v) => updateStart({ y: clamp(v) })}
              />
            </div>
          </div>

          {/* End point */}
          <div className="space-y-2 pt-2 border-t">
            <div className="text-xs font-medium">End</div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">X</span>
              <NumberStepperInput
                value={value.end.x}
                onChange={(v) => updateEnd({ x: clamp(v) })}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Y</span>
              <NumberStepperInput
                value={value.end.y}
                onChange={(v) => updateEnd({ y: clamp(v) })}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
