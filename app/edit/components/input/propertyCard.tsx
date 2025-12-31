/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ColorDisc } from "@/components/colordisc";
import PointsDropdownEditor from "./pointsDropdownEditor";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { PointInput } from "./pointInput";
import { RangeInput } from "./rangeInput";
import { FuncsInput } from "./funcInput";
import { PopoverSliderInput } from "./thicknessInput";
import { ZIndexInput } from "./zIndexInput";
import {
  Expand,
  RotateCw,
  SquareDashedTopSolid,
  SquareRoundCorner,
} from "lucide-react";
// import { useScene } from "@/hooks/SceneContext";
// import { usePropertyDescriptors } from "./propertyDescriptor";

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

  if (property === "zindex") {
    return (
      <div className="flex">
        <ZIndexInput
          property={property}
          value={value}
          onChange={onChange}
          refreshFunc={refreshFunc}
        />
      </div>
    );
  }

  if (type === "curvefuncs") {
    return (
      <div className="flex">
        <FuncsInput property={property} value={value} onChange={onChange} />
      </div>
    );
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
  if (property === "cornerRadius") {
    return (
      <div className="flex">
        <PopoverSliderInput
          label="Corner Radius"
          value={value}
          onChange={onChange}
          refreshFunc={refreshFunc}
          min={0}
          max={50}
          step={1}
          icon={<SquareRoundCorner className="h-4 w-4" />}
          unit="px"
        />
      </div>
    );
  }
  if (property === "rotation") {
    return (
      <div className="flex">
        <PopoverSliderInput
          label="Rotation"
          value={value}
          onChange={onChange}
          refreshFunc={refreshFunc}
          min={0}
          max={360}
          step={1}
          icon={<RotateCw className="h-4 w-4" />}
          unit="deg"
        />
      </div>
    );
  }
  if (property === "scale") {
    return (
      <div className="flex">
        <PopoverSliderInput
          label="Scale"
          value={value}
          onChange={onChange}
          refreshFunc={refreshFunc}
          min={0}
          max={5}
          step={0.1}
          icon={<Expand className="h-4 w-4" />}
          unit="x"
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
        <ColorDisc
          value={value}
          onChange={(val) => onChange(val)}
          refreshFunc={refreshFunc}
        />
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
          refreshFunc={refreshFunc}
        />
      </div>
    );
  }

  if (type === "point_array") {
    return <PointsDropdownEditor points={value} onChange={onChange} />;
  }

  if (type === "range") {
    return (
      <div className="flex">
        <RangeInput
          value={value}
          property={property}
          onChange={onChange}
          refreshFunc={refreshFunc}
        />
      </div>
    );
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
