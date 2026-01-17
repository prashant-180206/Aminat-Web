"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
// import { NumberStepperInput } from "../../../components/input/numberInput";
import { Settings2 } from "lucide-react";
import { NumberStepperInput } from "@/core/classes/controllers/input/numberstepper";

type Props = {
  initialMin: number;
  initialMax: number;
  initialRank: number;
  onApply: (data: { min: number; max: number; rank: number }) => void;
};

const UpdateSliderPopover: React.FC<Props> = ({
  initialMin,
  initialMax,
  initialRank,
  onApply,
}) => {
  const [min, setMin] = React.useState(initialMin);
  const [max, setMax] = React.useState(initialMax);
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

      <PopoverContent className="space-y-3 w-auto flex-1">
        <div className="space-y-1">
          <Label>Min</Label>
          <NumberStepperInput value={min} onChange={setMin} />
        </div>

        <div className="space-y-1">
          <Label>Max</Label>
          <NumberStepperInput value={max} onChange={setMax} />
        </div>

        <div className="space-y-1">
          <Label>Rank</Label>
          <NumberStepperInput value={rank} onChange={setRank} />
        </div>

        <Button className="w-full" onClick={() => onApply({ min, max, rank })}>
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default UpdateSliderPopover;
