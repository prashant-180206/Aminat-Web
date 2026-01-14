import React from "react";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { NumberStepperInput } from "./numberstepper";

export const NumberInputs = ({
  inputs,
  icon,
}: {
  inputs: {
    label: string;
    value: number;
    onChange: (val: number) => void;
  }[];
  icon: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-2 w-full">
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center h-8 text-xs font-mono "
        >
          {icon}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-44 space-y-3">
        {inputs.map(({ label, value, onChange }, idx) => (
          <div className="flex items-center justify-between" key={idx}>
            <span className="text-xs text-muted-foreground">{label}</span>
            <NumberStepperInput value={value} onChange={onChange} />
          </div>
        ))}
      </PopoverContent>
    </Popover>
  </div>
);
