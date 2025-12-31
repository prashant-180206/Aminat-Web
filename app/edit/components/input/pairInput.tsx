"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { NumberStepperInput } from "./numberInput";
import { LucideIcon } from "lucide-react";

type PairInputProps<T extends Record<string, number>> = {
  property: string;
  value: T;
  keys: [keyof T, keyof T];
  labels: [string, string];
  icon: LucideIcon;
  onChange: (val: T) => void;
  refreshFunc: () => void;
  min?: number;
  max?: number;
};

export function PairInput<T extends Record<string, number>>({
  // property,
  value,
  keys,
  labels,
  icon: Icon,
  onChange,
  refreshFunc,
  min = -999,
  max = 999,
}: PairInputProps<T>) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const update = (key: keyof T, v: number) => {
    const next = {
      ...value,
      [key]: clamp(v),
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
            className="flex items-center h-8 text-xs font-mono "
          >
            <Icon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-44 space-y-3">
          {/* First */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{labels[0]}</span>
            <NumberStepperInput
              value={value[keys[0]]}
              onChange={(v) => update(keys[0], v)}
            />
          </div>

          {/* Second */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{labels[1]}</span>
            <NumberStepperInput
              value={value[keys[1]]}
              onChange={(v) => update(keys[1], v)}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

import { Move } from "lucide-react";
// import { PairInput } from "./pairInput";

type Point = { x: number; y: number };

export const PointInput = (props: {
  property: string;
  value: Point;
  onChange: (v: Point) => void;
  refreshFunc: () => void;
}) => (
  <PairInput<Point>
    {...props}
    keys={["x", "y"]}
    labels={["X", "Y"]}
    icon={Move}
    min={-999}
    max={999}
  />
);

import { Maximize2 } from "lucide-react";
// import { PairInput } from "./pairInput";

type Dimensions = { width: number; height: number };

export const DimensionsInput = (props: {
  property: string;
  value: Dimensions;
  onChange: (v: Dimensions) => void;
  refreshFunc: () => void;
}) => (
  <PairInput<Dimensions>
    {...props}
    keys={["width", "height"]}
    labels={["W", "H"]}
    icon={Maximize2}
    min={0}
    max={9999}
  />
);
