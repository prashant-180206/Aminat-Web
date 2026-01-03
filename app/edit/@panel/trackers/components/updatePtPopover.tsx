"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { NumberStepperInput } from "../../../components/input/numberInput";
import { Settings2 } from "lucide-react";

type Props = {
  initialX: { min: number; max: number };
  initialY: { min: number; max: number };
  initialRank: number;
  onApply: (data: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    rank: number;
  }) => void;
};

const PtUpdateSliderPopover: React.FC<Props> = ({
  initialX,
  initialY,
  initialRank,
  onApply,
}) => {
  const [minX, setMinX] = React.useState(initialX.min);
  const [maxX, setMaxX] = React.useState(initialX.max);
  const [minY, setMinY] = React.useState(initialY.min);
  const [maxY, setMaxY] = React.useState(initialY.max);
  const [rank, setRank] = React.useState(initialRank);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          // variant="outline"
          className=" flex-1 border text-primary border-primary bg-card hover:bg-accent"
          size="sm"
        >
          <Settings2 />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="space-y-3 w-auto flex-1 grid grid-cols-2 gap-4 p-4">
        <div className="space-y-1">
          <Label>Min X</Label>
          <NumberStepperInput value={minX} onChange={setMinX} />
        </div>

        <div className="space-y-1">
          <Label>Max X</Label>
          <NumberStepperInput value={maxX} onChange={setMaxX} />
        </div>
        <div className="space-y-1">
          <Label>Min Y</Label>
          <NumberStepperInput value={minY} onChange={setMinY} />
        </div>

        <div className="space-y-1">
          <Label>Max Y</Label>
          <NumberStepperInput value={maxY} onChange={setMaxY} />
        </div>
        <div className="space-y-1">
          <Label>Rank</Label>
          <NumberStepperInput value={rank} onChange={setRank} />
        </div>

        <Button
          className="w-full mt-4"
          onClick={() => onApply({ minX, maxX, minY, maxY, rank })}
        >
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default PtUpdateSliderPopover;
