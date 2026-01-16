import React from "react";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { NumberStepperInput } from "./numberstepper";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const NumberInputs = ({
  inputs,
  icon,
  message,
}: {
  inputs: {
    label: string;
    value: number;
    onChange: (val: number) => void;
  }[];
  icon: React.ReactNode;
  message?: string;
}) => (
  <div className="flex items-center justify-between gap-2 w-full">
    <Popover>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center h-8 text-xs font-mono"
              >
                {icon}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>

          <TooltipContent side="top" align="center">
            <span>{message || "Select value"}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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
