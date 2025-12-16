"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";

type Range = [number, number];

type RangeInputProps = {
  property: string;
  value: Range; // initial value: [min, max]
  onChange: (val: Range) => void;
};

export const RangeInput: React.FC<RangeInputProps> = ({
  property,
  value,
  onChange,
}) => {
  // initialize once from props
  const [range, setRange] = useState<Range>(() => [
    value?.[0] ?? 0,
    value?.[1] ?? 0,
  ]);

  const updateRange = (partial: Partial<Range>) => {
    const newRange: Range = [partial[0] ?? range[0], partial[1] ?? range[1]];
    setRange(newRange);
    onChange(newRange);
  };

  return (
    <div className="flex flex-row gap-2 items-center ">
      <p>{property + " :"}</p>
      <Input
        type="number"
        defaultValue={range[0].toFixed(2)}
        onChange={(e) => updateRange([Number(e.target.value), undefined])}
        className="w-24"
        id={`range-input-${property}-0`}
      />
      <Input
        type="number"
        defaultValue={range[1].toFixed(2)}
        onChange={(e) => updateRange([undefined, Number(e.target.value)])}
        className="w-24"
        id={`range-input-${property}-1`}
      />
    </div>
  );
};
