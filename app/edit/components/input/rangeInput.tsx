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

type Range = [number, number];

type RangeInputProps = {
  // property: string;
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
    const next: Range = [nextMin, range[1]];
    setRange(next);
    onChange(next);
  };

  const updateMax = (v: number) => {
    const nextMax = Math.max(v, range[0]);
    const next: Range = [range[0], nextMax];
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

type Ranges = {
  xrange: Range;
  yrange: Range;
};

type RangesInputProps = {
  property: string;
  value: Ranges;
  onChange: (val: Ranges) => void;
  refreshFunc: () => void;
  min?: number;
  max?: number;
  step?: number;
};

export const RangesInput: React.FC<RangesInputProps> = ({
  // property,
  value,
  onChange,
  refreshFunc,
  min = -15,
  max = 15,
  step = 0.1,
}) => {
  const [ranges, setRanges] = useState<Ranges>(value);

  // sync with external updates
  useEffect(() => {
    setRanges(value);
  }, [value]);

  const updateXMin = (v: number) => {
    const nextMin = Math.min(v, ranges.xrange[1]);
    const next: Ranges = {
      ...ranges,
      xrange: [nextMin, ranges.xrange[1]],
    };
    setRanges(next);
    onChange(next);
    refreshFunc();
  };

  const updateXMax = (v: number) => {
    const nextMax = Math.max(v, ranges.xrange[0]);
    const next: Ranges = {
      ...ranges,
      xrange: [ranges.xrange[0], nextMax],
    };
    setRanges(next);
    onChange(next);
    refreshFunc();
  };

  const updateYMin = (v: number) => {
    const nextMin = Math.min(v, ranges.yrange[1]);
    const next: Ranges = {
      ...ranges,
      yrange: [nextMin, ranges.yrange[1]],
    };
    setRanges(next);
    onChange(next);
    refreshFunc();
  };

  const updateYMax = (v: number) => {
    const nextMax = Math.max(v, ranges.yrange[0]);
    const next: Ranges = {
      ...ranges,
      yrange: [ranges.yrange[0], nextMax],
    };
    setRanges(next);
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
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 space-y-6">
          {/* X Range */}
          <div className="space-y-4">
            <div className="text-xs font-medium">X Range</div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Min</span>
                <span className="font-mono">{ranges.xrange[0].toFixed(1)}</span>
              </div>

              <Slider
                value={[ranges.xrange[0]]}
                min={min}
                max={max}
                step={step}
                onValueChange={(v) => updateXMin(v[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Max</span>
                <span className="font-mono">{ranges.xrange[1].toFixed(1)}</span>
              </div>

              <Slider
                value={[ranges.xrange[1]]}
                min={min}
                max={max}
                step={step}
                onValueChange={(v) => updateXMax(v[0])}
              />
            </div>
          </div>

          {/* Y Range */}
          <div className="space-y-4">
            <div className="text-xs font-medium">Y Range</div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Min</span>
                <span className="font-mono">{ranges.yrange[0].toFixed(1)}</span>
              </div>

              <Slider
                value={[ranges.yrange[0]]}
                min={min}
                max={max}
                step={step}
                onValueChange={(v) => updateYMin(v[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Max</span>
                <span className="font-mono">{ranges.yrange[1].toFixed(1)}</span>
              </div>

              <Slider
                value={[ranges.yrange[1]]}
                min={min}
                max={max}
                step={step}
                onValueChange={(v) => updateYMax(v[0])}
              />
            </div>
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
