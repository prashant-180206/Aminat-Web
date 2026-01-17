"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ColorDiscProps = {
  value: string;
  onChange: (val: string) => void;
  size?: number;
  message?: string;
};

export const ColorDisc = ({
  message,
  value,
  onChange,
  size = 10,
}: ColorDiscProps) => {
  /* ------------------------------------------------------------ */
  /* Local UI state                                                */
  /* ------------------------------------------------------------ */
  const [localColor, setLocalColor] = useState<string>(() => value);
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

  const commit = (color: string) => {
    setLocalColor(color);
    onChange(color);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                type="button"
                size="icon"
                className="rounded-full"
                style={{
                  backgroundColor: localColor,
                  width: size * 4,
                  height: size * 4,
                }}
              />
            </PopoverTrigger>
          </TooltipTrigger>

          <TooltipContent side="top" align="center">
            <span>{message || "Select color"}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent className="w-52">
        <div className="grid grid-cols-5 gap-2">
          {PRESET_COLORS.map((color) => (
            <Button
              key={color}
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full border"
              style={{ backgroundColor: color }}
              onClick={() => commit(color)}
            />
          ))}

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
              value={localColor}
              onChange={(e) => commit(e.target.value)}
            />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
};
