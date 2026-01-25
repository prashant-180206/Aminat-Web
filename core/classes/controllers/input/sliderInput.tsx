"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SliderField = {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

type SliderInputProps = {
  fields: SliderField[];
  icon?: React.ReactNode;
  message?: string;
};

const SliderInput: React.FC<SliderInputProps> = ({ fields, icon, message }) => {
  const [localValues, setLocalValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    fields.forEach((f) => (initial[f.label] = f.value));
    return initial;
  });

  const updateValue = (
    label: string,
    v: number,
    onChange: (v: number) => void,
  ) => {
    setLocalValues((prev) => ({ ...prev, [label]: v }));
    onChange(v);
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <Popover>
        {message ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-xs justify-between"
                >
                  {icon}
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>{message}</TooltipContent>
          </Tooltip>
        ) : (
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-xs justify-between"
            >
              {icon}
            </Button>
          </PopoverTrigger>
        )}

        <PopoverContent className="w-64 space-y-4">
          {fields.map(({ label, onChange, min, max, step }) => {
            const local = localValues[label];

            return (
              <div className="flex flex-col gap-3" key={label}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs font-mono">{local?.toFixed(2)}</span>
                </div>

                <Slider
                  min={min ?? 0}
                  max={max ?? 1}
                  step={step ?? 0.01}
                  value={[local]}
                  onValueChange={(v) => updateValue(label, v[0], onChange)}
                />
              </div>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SliderInput;
