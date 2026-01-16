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
import { CirclePlay } from "lucide-react";
import { Combobox } from "@/components/combobox";
import { easingMap } from "@/core/maps/easingMap";
import { NumberStepperInput } from "@/core/classes/properties/input/numberstepper";

type Props = {
  onApply: (data: {
    duration: number;
    targetX: number;
    targetY: number;
    easing: string;
  }) => void;
};

const AnimatePtSliderPopover: React.FC<Props> = ({ onApply }) => {
  const [duration, setDuration] = React.useState(1);
  const [targetX, setTargetX] = React.useState(1);
  const [targetY, setTargetY] = React.useState(1);
  const [easing, setEasing] = React.useState(Object.keys(easingMap)[3]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          // variant="outline"
          className=" flex-1 border text-primary border-primary bg-card hover:bg-accent"
          size="sm"
        >
          <CirclePlay />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="space-y-3 w-auto flex-1">
        <div className="space-y-1">
          <Label>Duration</Label>
          <NumberStepperInput value={duration} onChange={setDuration} />
        </div>

        <div className="space-y-1">
          <Label>TargetX</Label>
          <NumberStepperInput value={targetX} onChange={setTargetX} />
        </div>

        <div className="space-y-1">
          <Label>TargetY</Label>
          <NumberStepperInput value={targetY} onChange={setTargetY} />
        </div>

        <Label className="text-xs">Easing</Label>
        <Combobox
          options={Object.keys(easingMap).map((val) => ({
            label: val,
            value: val,
          }))}
          value={easing}
          onChange={(val) => setEasing(val)}
        />

        <Button
          className="w-full"
          onClick={() => onApply({ duration, targetX, targetY, easing })}
        >
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default AnimatePtSliderPopover;
