"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown, Layers } from "lucide-react";

type ZIndexInputProps = {
  property: string;
  value: number;
  onChange: (val: number) => void;
  refreshFunc: () => void;
  min?: number;
  max?: number;
  step?: number;
};

export const ZIndexInput: React.FC<ZIndexInputProps> = ({
  property,
  value,
  onChange,
  refreshFunc,
  min = 0,
  max = 999,
  step = 1,
}) => {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <span className="text-sm font-medium">{property}</span>

      <div className="flex items-center gap-1">
        {/* Decrease */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            onChange(clamp(value - step));
            refreshFunc();
          }}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>

        {/* Number input */}
        <div className="relative flex items-center">
          <Layers className="absolute left-2 h-3 w-3 text-muted-foreground pointer-events-none" />
          <Input
            type="number"
            value={value}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!Number.isNaN(v)) {
                onChange(clamp(v));
                refreshFunc();
              }
            }}
            className="h-8 w-20 pl-7 text-xs font-mono"
          />
        </div>

        {/* Increase */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            onChange(clamp(value + step));
            refreshFunc();
          }}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
