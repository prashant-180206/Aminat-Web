/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ColorDisc } from "@/components/colordisc";
import PointsDropdownEditor from "./pointsDropdownEditor";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type Props = {
  item: any;
};

export const PropertyInput: React.FC<Props> = ({ item }) => {
  const { type, value, onChange, property } = item;

  if (type === "boolean") {
    return (
      <div className="flex items-center w-20">
        <Checkbox
          id={`my-checkbox-${property}`}
          defaultChecked={value}
          onCheckedChange={(v) => {
            onChange(v as boolean);
          }}
          className="data-[state=checked]:bg-red-700" // Color checked state only
        />
        <Label
          htmlFor={`my-checkbox-${property}`}
          className="text-sm font-medium"
        >
          {property}
        </Label>
      </div>
    );
  }

  if (type === "number" && property !== "opacity") {
    return (
      <div className="w-20">
        <p>{property}</p>
        <Input
          type="number"
          placeholder={value?.toFixed?.(2) ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    );
  }
  if (property == "opacity") {
    return (
      <div className="w-20">
        <Slider
          defaultValue={[value]}
          onValueChange={(v) => onChange(v)}
          step={0.05}
          min={0}
          max={1}
        />
      </div>
    );
  }

  if (type === "color") {
    return (
      <div className="w-10 h-10 p-0">
        <ColorDisc value={value} onChange={(val) => onChange(val)} />
      </div>
    );
  }

  if (type === "point") {
    return (
      <div className="flex flex-row gap-2 w-50">
        {/* <p>{property}</p> */}
        <Input
          type="number"
          placeholder={value.x.toFixed(2)}
          onChange={(e) => onChange({ x: Number(e.target.value), y: value.y })}
        />
        <Input
          type="number"
          placeholder={value.y.toFixed(2)}
          onChange={(e) => onChange({ x: value.x, y: Number(e.target.value) })}
        />
      </div>
    );
  }

  if (type === "point_array") {
    return <PointsDropdownEditor points={value} onChange={onChange} />;
  }

  if (type === "range") {
    return (
      <div className="flex flex-row gap-2 w-50">
        <Input
          type="number"
          placeholder={value[0].toFixed(2)}
          onChange={(e) => onChange([Number(e.target.value), value[1]])}
        />
        <Input
          type="number"
          placeholder={value[1].toFixed(2)}
          onChange={(e) => onChange([value[0], Number(e.target.value)])}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-40">
      <p className="text-amber-200">{property} qwertt</p>
      <Input
        placeholder={property}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
