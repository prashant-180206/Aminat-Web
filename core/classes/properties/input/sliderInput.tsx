import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import React from "react";

const SliderInput = ({
  fields,
  icon,
}: {
  fields: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    step?: number;
  }[];
  icon?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between gap-2 w-full">
      {/* <span className="text-sm font-medium">{label}</span> */}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-2 text-xs  justify-between`}
          >
            {icon}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 space-y-3">
          {fields.map(({ label, value, onChange, min, max, step }) => (
            <div className="flex flex-col gap-4" key={label}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-mono">{value.toFixed(2)}</span>
              </div>
              <Slider
                min={min || 0}
                max={max || 1}
                step={step || 0.01}
                defaultValue={[value]}
                onValueChange={(v) => {
                  onChange(v[0]);
                }}
              />
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SliderInput;
