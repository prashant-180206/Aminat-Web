"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

type NumberStepperInputProps = {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export const NumberStepperInput: React.FC<NumberStepperInputProps> = ({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
}) => {
  const [local, setLocal] = useState<number>(value);

  // keep local state in sync with external updates
  useEffect(() => {
    setLocal(value);
  }, [value]);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const commit = (v: number) => {
    const next = clamp(v);
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="flex items-center justify-between rounded-md border border-foreground/30 bg-background h-9">
      {/* Decrease */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => commit(local - step)}
      >
        <Minus className="h-4 w-4" />
      </Button>

      {/* Number input */}
      <Input
        type="number"
        value={local}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isNaN(v)) commit(v);
        }}
        onBlur={() => commit(local)}
        className="h-8 w-12 text-center text-sm font-mono border-0 focus-visible:ring-0"
      />

      {/* Increase */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => commit(local + step)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
