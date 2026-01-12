import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

type ColorDiscProps = {
  value: string;
  onChange: (val: string) => void;
  refreshFunc?: () => void;
  size?: number;
};

export const ColorDisc = ({
  value,
  onChange,
  refreshFunc,
  size = 10,
}: ColorDiscProps) => {
  const [open, setOpen] = useState(false);
  const PRESET_COLORS = [
    "#000000",
    "#FFFFFF",
    "#EF4444",
    "#F97316",
    "#FACC15",
    "#22C55E",
    "#14B8A6",
    "#3B82F6",
    "#8B5CF6",
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* trigger as a round Button */}
      <PopoverTrigger asChild>
        <Button
          type="button"
          // variant="outline"
          size="icon"
          className={`h-${size} w-${size} rounded-full `}
          style={{
            backgroundColor: value,
          }}
        />
      </PopoverTrigger>

      <PopoverContent className="w-52">
        {/* preset grid using icon-sized Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {PRESET_COLORS.map((color) => (
            <Button
              key={color}
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full border"
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color);
                setOpen(false);
                refreshFunc?.();
              }}
            />
          ))}

          {/* "+" button to pick custom color */}
          <label className="relative">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full border-dashed text-xs"
            >
              +
            </Button>
            <Input
              type="color"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setOpen(false);
                refreshFunc?.();
              }}
            />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
};
