/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ColorDisc } from "@/components/colordisc";
import PointsDropdownEditor from "./input/pointsDropdownEditor";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { PointInput } from "./input/pointInput";
import { RangeInput } from "./input/rangeInput";

type Props = {
  item: {
    property: string;
    type: string;
    value: any;
    onChange: (val: any) => void;
  };
};

export const PropertyInput: React.FC<Props> = ({ item }) => {
  const { type, value, onChange, property } = item;

  if (type === "boolean") {
    return (
      <div className="flex items-center gap-2 ">
        <Checkbox
          id={`my-checkbox-${property}`}
          defaultChecked={value}
          onCheckedChange={(v) => {
            onChange(v as boolean);
          }}
        />
        <Label
          htmlFor={`my-checkbox-${property}`}
          className="text-sm font-medium"
        >
          {property[4].toUpperCase() + property.slice(5)}
        </Label>
      </div>
    );
  }

  if (type === "number" && property !== "opacity") {
    return (
      <div className="flex flex-row gap-2 items-center">
        <p>{property + " :"}</p>
        <Input
          type="number"
          defaultValue={value ? value?.toFixed?.(2) : 0}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-20 py-0"
        />
      </div>
    );
  }
  if (property == "opacity") {
    return (
      <div className="flex flex-row gap-2">
        <p>{property + " :"}</p>
        <Slider
          defaultValue={[value]}
          onValueChange={(v) => onChange(v)}
          step={0.05}
          min={0}
          max={1}
          className="w-25 flex-1 h-7"
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
      <div>
        <PointInput
          property={property}
          value={value}
          onChange={(val) => onChange(val)}
        />
      </div>
    );
  }

  if (type === "point_array") {
    return <PointsDropdownEditor points={value} onChange={onChange} />;
  }

  if (type === "range") {
    return <RangeInput value={value} property={property} onChange={onChange} />;
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      <p>{property + " :"}</p>
      <Input
        placeholder={property}
        onChange={(e) => onChange(e.target.value)}
        className="w-40"
      />
    </div>
  );
};
