import { Expand, RotateCw, ScanEye, SquareRoundCorner } from "lucide-react";
import { DimensionsInput } from "../input/pairInput";
import { PopoverSliderInput } from "../input/popoverSlider";
import { RangesInput } from "../input/rangeInput";
import { TextStyleInput } from "../input/textInput";
import { ZIndexInput } from "../input/zIndexInput";
import { LineEndsInput } from "../input/lineEndInput";
import { FuncsInput } from "../input/funcInput";
import PointsDropdownEditor from "../input/pointsDropdownEditor";

/* eslint-disable @typescript-eslint/no-explicit-any */
type PropertyRenderer = (args: {
  property: string;
  value: any;
  onChange: (val: any) => void;
  refreshFunc: () => void;
}) => React.ReactNode;

export const PROPERTY_REGISTRY: Record<string, PropertyRenderer> = {
  zindex: ({ value, onChange }) => (
    <div className="flex">
      <ZIndexInput value={value} onChange={onChange} />
    </div>
  ),

  ranges: ({ value, property, onChange, refreshFunc }) => (
    <div className="flex">
      <RangesInput
        value={value}
        property={property}
        onChange={onChange}
        refreshFunc={refreshFunc}
      />
    </div>
  ),

  dimensions: ({ value, property, onChange, refreshFunc }) => (
    <div className="flex">
      <DimensionsInput
        value={value}
        property={property}
        onChange={onChange}
        refreshFunc={refreshFunc}
      />
    </div>
  ),

  textData: ({ value, onChange }) => (
    <div className="flex">
      <TextStyleInput value={value} onChange={onChange} />
    </div>
  ),

  cornerRadius: ({ value, onChange, refreshFunc }) => (
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
  ),

  rotation: ({ value, onChange, refreshFunc }) => (
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
  ),

  scale: ({ value, onChange, refreshFunc }) => (
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
  ),

  lineEnds: ({ value, property, onChange, refreshFunc }) => (
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
  ),

  opacity: ({ value, onChange, refreshFunc }) => (
    <div className="flex">
      <PopoverSliderInput
        label="Opacity"
        value={value}
        onChange={onChange}
        refreshFunc={refreshFunc}
        min={0}
        max={1}
        step={0.01}
        icon={<ScanEye className="h-4 w-4" />}
      />
    </div>
  ),

  funcs: ({ value, onChange }) => (
    <div className="flex">
      <FuncsInput value={value} onChange={onChange} />
    </div>
  ),

  points: ({ value, onChange }) => (
    <PointsDropdownEditor points={value} onChange={onChange} />
  ),
};
