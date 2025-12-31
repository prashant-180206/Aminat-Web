"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

type PopoverSliderInputProps = {
  label: string;
  value: number;
  onChange: (val: number) => void;
  refreshFunc?: () => void;
  min?: number;
  max?: number;
  step?: number;
  icon?: React.ReactNode;
  unit?: string;
  buttonWidth?: string;
};

export const PopoverSliderInput: React.FC<PopoverSliderInputProps> = ({
  label,
  value,
  onChange,
  refreshFunc,
  min = 0,
  max = 100,
  step = 1,
  icon,
  unit = "",
  buttonWidth = "w-20",
}) => {
  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <span className="text-sm font-medium">{label}</span>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-2 text-xs ${buttonWidth} justify-between`}
          >
            {icon}
            {value}
            {unit}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xs font-mono">
              {value}
              {unit}
            </span>
          </div>

          <Slider
            min={min}
            max={max}
            step={step}
            defaultValue={[value]}
            onValueChange={(v) => {
              onChange(v[0]);
              refreshFunc?.();
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
