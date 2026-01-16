"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label as UILabel } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NumberStepperInput } from "./numberstepper";
import { ColorDisc } from "@/components/colordisc";
import { Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "../label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  value: Label;
  onChange: (next: Partial<Label>) => void;
  message?: string;
};

export function LabelPopover({ value, onChange, message = "Label " }: Props) {
  const [localOffset, setLocalOffset] = React.useState(value.offset);

  return (
    <Popover>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Tag className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>

          {message && (
            <TooltipContent side="top" align="center">
              <span>{message}</span>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <PopoverContent className="w-50 space-y-2">
        <div>
          <UILabel>Label Text</UILabel>
          <Input
            type="text"
            defaultValue={value.labelText}
            onChange={(e) => onChange({ labelText: e.target.value })}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        </div>

        <div className="flex items-center justify-between">
          <UILabel>Visible</UILabel>
          <Switch
            defaultChecked={value.visible}
            onCheckedChange={(v) => onChange({ visible: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Offset X</span>
          <NumberStepperInput
            value={localOffset.x}
            onChange={(v) => {
              const next = { ...localOffset, x: v };
              setLocalOffset(next);
              onChange({ offset: next });
            }}
            step={10}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Offset Y</span>
          <NumberStepperInput
            value={localOffset.y}
            onChange={(v) => {
              const next = { ...localOffset, y: v };
              setLocalOffset(next);
              onChange({ offset: next });
            }}
            step={10}
          />
        </div>

        <div className="flex items-center justify-between">
          <UILabel>Font size</UILabel>
          <NumberStepperInput
            value={value.fontsize}
            onChange={(v) => onChange({ fontsize: v })}
          />
        </div>

        <div>
          <UILabel>Color</UILabel>
          <ColorDisc
            value={value.color}
            onChange={(v) => onChange({ color: v })}
          />
        </div>

        <div>
          <UILabel>Position</UILabel>
          <Select
            defaultValue={value.position}
            onValueChange={(v) =>
              onChange({ position: v as Label["position"] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="start">Start</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="end">End</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
