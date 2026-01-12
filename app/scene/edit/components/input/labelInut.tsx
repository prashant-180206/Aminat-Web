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
import { Label, Point } from "@/core/types/properties";
import { NumberStepperInput } from "./numberInput";
import { ColorDisc } from "@/components/colordisc";
import { Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
// import { refresh } from "next/cache";

type Props = {
  value: Label;
  onChange: (next: Label) => void;
  refreshFunc: () => void;
  //   trigger?: React.ReactNode;
};

export function LabelPopover({ value, onChange, refreshFunc }: Props) {
  const update = <K extends keyof Label>(key: K, v: Label[K]) => {
    onChange({ ...value, [key]: v });
    refreshFunc();
  };

  const updateOffset = (key: keyof Point, v: number) => {
    onChange({
      ...value,
      offset: { ...value.offset, [key]: v },
    });
    refreshFunc();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Tag className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-50 space-y-2">
        <div>
          <UILabel>Label Text</UILabel>
          <Input
            type="text"
            value={value.labelText}
            onChange={(e) => update("labelText", e.target.value)}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        </div>
        <div className="flex items-center justify-between">
          <UILabel>Visible</UILabel>
          <Switch
            defaultChecked={value.visible}
            onCheckedChange={(v) => update("visible", v)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Offset X</span>
          <NumberStepperInput
            value={value.offset.x}
            onChange={(v) => updateOffset("x", v)}
            step={10}
          />
        </div>

        {/* Second */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Offset Y</span>
          <NumberStepperInput
            value={value.offset.y}
            onChange={(v) => updateOffset("y", v)}
            step={10}
          />
        </div>

        <div className="flex">
          <UILabel>Font size</UILabel>
          <NumberStepperInput
            value={value.fontsize}
            onChange={(v) => update("fontsize", v)}
          />
        </div>

        <div>
          <UILabel>Color</UILabel>
          <ColorDisc value={value.color} onChange={(v) => update("color", v)} />
        </div>

        <div className="flex gap-2">
          <div>
            <UILabel>Position</UILabel>
            <Select
              value={value.position}
              onValueChange={(v) => update("position", v as Label["position"])}
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
