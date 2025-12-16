"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";

type Point = { x: number; y: number };

type PointInputProps = {
  property: string;
  value: Point; // initial value
  onChange: (val: Point) => void;
};

export const PointInput: React.FC<PointInputProps> = ({
  property,
  value,
  onChange,
}) => {
  // initialize once from props
  const [point, setPoint] = useState<Point>(() => ({
    x: value?.x ?? 0,
    y: value?.y ?? 0,
  }));

  const updatePoint = (partial: Partial<Point>) => {
    const newPoint = { ...point, ...partial };
    setPoint(newPoint);
    onChange(newPoint);
  };

  return (
    <div className="flex flex-row gap-2 w-60 items-center">
      <p>{property + " :"}</p>
      <Input
        type="number"
        defaultValue={point.x.toFixed(2)}
        onChange={(e) => updatePoint({ x: Number(e.target.value) })}
        className="w-14"
        id={`point-input-${property}-x`}
      />
      <Input
        type="number"
        defaultValue={point.y.toFixed(2)}
        onChange={(e) => updatePoint({ y: Number(e.target.value) })}
        className="w-14"
        id={`point-input-${property}-y`}
      />
    </div>
  );
};
