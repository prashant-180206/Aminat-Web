"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { SlidersHorizontal } from "lucide-react";

type Range = [number, number, number];

type RangeInputProps = {
  value: Range;
  onChange: (val: Range) => void;
  refreshFunc: () => void;
  min?: number;
  max?: number;
  step?: number;
};

export const RangeInput: React.FC<RangeInputProps> = ({
  // property,
  value,
  onChange,
  refreshFunc,
  min = -15,
  max = 15,
  step = 0.1,
}) => {
  const [range, setRange] = useState<Range>(value);

  // keep local state in sync if parent updates externally
  useEffect(() => {
    setRange(value);
  }, [value]);

  const updateMin = (v: number) => {
    const nextMin = Math.min(v, range[1]);
    const next: Range = [nextMin, range[1], range[2]];
    setRange(next);
    onChange(next);
  };

  const updateMax = (v: number) => {
    const nextMax = Math.max(v, range[0]);
    const next: Range = [range[0], nextMax, range[2]];
    setRange(next);
    onChange(next);
  };
  const updateStep = (v: number) => {
    const nextStep = v;
    const next: Range = [range[0], range[1], nextStep];
    setRange(next);
    onChange(next);
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      {/* <span className="text-sm font-medium">{property}</span> */}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-xs font-mono "
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 space-y-5">
          {/* Min slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Min</span>
              <span className="font-mono">{range[0].toFixed(1)}</span>
            </div>

            <Slider
              value={[range[0]]}
              min={min}
              max={max}
              step={step}
              onValueChange={(v) => {
                updateMin(v[0]);
                refreshFunc();
              }}
            />
          </div>

          {/* Max slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Max</span>
              <span className="font-mono">{range[1].toFixed(1)}</span>
            </div>

            <Slider
              value={[range[1]]}
              min={min}
              max={max}
              step={step}
              onValueChange={(v) => {
                updateMax(v[0]);
                refreshFunc();
              }}
            />
          </div>

          {/* Step slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Step</span>
              <span className="font-mono">{range[2].toFixed(1)}</span>
            </div>

            <Slider
              value={[range[2]]}
              min={0}
              max={3}
              step={0.1}
              onValueChange={(v) => {
                updateStep(v[0]);
                refreshFunc();
              }}
            />
          </div>

          {/* Global bounds */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{min.toFixed(1)}</span>
            <span>{max.toFixed(1)}</span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
