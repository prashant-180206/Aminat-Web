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

type NumberInputItem = {
  label: string;
  value: number;
  onChange: (val: number) => void;
};

export const NumberInputs = ({
  inputs,
  icon,
  message,
}: {
  inputs: NumberInputItem[];
  icon: React.ReactNode;
  message?: string;
}) => {
  // 🔹 local state
  const [localValues, setLocalValues] = React.useState<number[]>(
    inputs.map((i) => i.value),
  );

  // 🔹 keep local state in sync if parent values change
  React.useEffect(() => {
    setLocalValues(inputs.map((i) => i.value));
  }, [inputs]);

  const handleChange = (index: number, value: number) => {
    setLocalValues((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    // propagate to parent
    inputs[index].onChange(value);
  };

  return (
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
          {inputs.map(({ label }, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{label}</span>

              <NumberStepperInput
                value={localValues[idx]}
                onChange={(val) => handleChange(idx, val)}
              />
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};
