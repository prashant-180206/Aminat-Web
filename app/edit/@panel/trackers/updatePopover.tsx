"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

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
        <Button variant="outline" size="sm">
          Update Slider
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 space-y-3">
        <div className="space-y-1">
          <Label>Min</Label>
          <Input
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
          />
        </div>

        <div className="space-y-1">
          <Label>Max</Label>
          <Input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
          />
        </div>

        <div className="space-y-1">
          <Label>Rank</Label>
          <Input
            type="number"
            value={rank}
            onChange={(e) => setRank(Number(e.target.value))}
          />
        </div>

        <Button className="w-full" onClick={() => onApply({ min, max, rank })}>
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default UpdateSliderPopover;
