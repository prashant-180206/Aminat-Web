/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ColorDisc } from "@/components/colordisc";
import PointsDropdownEditor from "./input/pointsDropdownEditor";
// import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { DimensionsInput, PointInput } from "./input/pairInput";
import { RangeInput, RangesInput } from "./input/rangeInput";
import { FuncsInput } from "./input/funcInput";
import { PopoverSliderInput } from "./input/popoverSlider";
import { ZIndexInput } from "./input/zIndexInput";
import {
  Expand,
  RotateCw,
  ScanEye,
  SquareDashedTopSolid,
  SquareRoundCorner,
} from "lucide-react";
import { NumberStepperInput } from "./input/numberInput";
import { TextStyleInput } from "./input/textInput";
import { LineEndsInput } from "./input/lineEndInput";
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
        <ZIndexInput value={value} onChange={onChange} />
      </div>
    );
  }

  if (property === "ranges") {
    return (
      <div className="flex">
        <RangesInput
          value={value}
          property={property}
          onChange={onChange}
          refreshFunc={refreshFunc}
        />
      </div>
    );
  }

  if (property === "dimensions") {
    return (
      <div className="flex">
        <DimensionsInput
          value={value}
          property={property}
          onChange={onChange}
          refreshFunc={refreshFunc}
        />
      </div>
    );
  }

  if (property === "textData") {
    return (
      <div className="flex ">
        <TextStyleInput value={value} onChange={onChange} />
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

  if (property == "lineEnds") {
    return (
      <div className="flex">
        <LineEndsInput
          property={property}
          value={value}
          onChange={onChange}
          refreshFunc={refreshFunc}
          min={-999}
          max={999}
        />
      </div>
    );
  }

  if (property == "opacity") {
    return (
      <div className="flex">
        <PopoverSliderInput
          label="Scale"
          value={value}
          onChange={onChange}
          refreshFunc={refreshFunc}
          min={0}
          max={1}
          step={0.01}
          icon={<ScanEye className="h-4 w-4" />}
        />
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

  if (type === "number") {
    return (
      <div className="flex">
        <NumberStepperInput value={value} onChange={onChange} />
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
