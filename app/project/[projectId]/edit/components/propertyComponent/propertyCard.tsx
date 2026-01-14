/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ColorDisc } from "@/components/colordisc";
import { Label } from "@/components/ui/label";
import { PointInput } from "../input/pairInput";
import { PopoverSliderInput } from "../input/popoverSlider";
import { SquareDashedTopSolid } from "lucide-react";
import { NumberStepperInput } from "../input/numberInput";
import { PROPERTY_REGISTRY } from "./registry";
import { ParameterRangeInput } from "../input/paramrangeInput";

type Props = {
  item: {
    property: string;
    type: string;
    value: any;
    onChange: (val: any) => void;
  };

  refreshFunc: () => void;
};

export const PropertyInput: React.FC<Props> = ({ item, refreshFunc }) => {
  const { type, value, onChange, property } = item;

  /* ---------------- property-based registry ---------------- */

  if (PROPERTY_REGISTRY[property]) {
    return PROPERTY_REGISTRY[property]({
      property,
      value,
      onChange,
      refreshFunc,
    });
  }

  if (property.endsWith("thickness")) {
    return (
      <div className="flex">
        <PopoverSliderInput
          label="Thickness"
          value={value}
          onChange={onChange}
          refreshFunc={refreshFunc}
          min={0}
          max={30}
          step={1}
          icon={<SquareDashedTopSolid className="h-4 w-4" />}
          unit="px"
        />
      </div>
    );
  }

  /* ---------------- type-based logic (unchanged) ---------------- */

  if (type === "boolean") {
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id={`my-checkbox-${property}`}
          defaultChecked={value}
          onCheckedChange={(v) => onChange(v as boolean)}
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

  if (type === "color") {
    return (
      <div className="flex rounded-full border-2 border-foreground/40">
        <ColorDisc
          value={value}
          onChange={(val) => onChange(val)}
          refreshFunc={refreshFunc}
          size={6}
        />
      </div>
    );
  }

  if (type === "point") {
    return (
      <div className="flex">
        <PointInput
          property={property}
          value={value}
          onChange={onChange}
          refreshFunc={refreshFunc}
        />
      </div>
    );
  }

  if (type === "range") {
    return (
      <div className="flex">
        <ParameterRangeInput
          value={value}
          // property={property}
          onChange={onChange}
          refreshFunc={refreshFunc}
        />
      </div>
    );
  }

  if (type === "number") {
    return (
      <div className="flex">
        <NumberStepperInput value={value} onChange={onChange} />
      </div>
    );
  }

  /* ---------------- fallback ---------------- */

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
