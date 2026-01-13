"use client";

import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Bold, Italic, Type } from "lucide-react";
import { ColorDisc } from "@/components/colordisc";
import { NumberStepperInput } from "./numberInput";
// import { NumberStepperInput } from "@/components/NumberStepperInput";

type TextStyle = {
  content: string;
  fontsize: number;
  fontfamily: string;
  bold: boolean;
  italic: boolean;
  color: string;
};

type TextStyleInputProps = {
  value: TextStyle;
  onChange: (val: TextStyle) => void;
};

export const TextStyleInput: React.FC<TextStyleInputProps> = ({
  value,
  onChange,
}) => {
  const [local, setLocal] = useState<TextStyle>(value);

  const FONT_FAMILIES = [
    "Inter",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Courier New",
    "Roboto",
    "Montserrat",
  ];

  // keep in sync with external updates
  useEffect(() => {
    setLocal(value);
  }, [value]);

  const update = (partial: Partial<TextStyle>) => {
    const next = { ...local, ...partial };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="flex items-center h-10 gap-1 rounded-md border bg-background p-1">
      {/* Text color */}
      <ColorDisc
        value={local.color}
        onChange={(c) => update({ color: c })}
        refreshFunc={() => {}}
        size={6}
        // className="w-8 h-8 rounded-md border"
      />
      {/* Font size */}
      <NumberStepperInput
        value={local.fontsize}
        min={1}
        max={200}
        step={1}
        onChange={(v) => update({ fontsize: v })}
      />
      {/* Font family */}
      {value.content !== undefined && (
        <Select
          value={local.fontfamily}
          onValueChange={(v) => update({ fontfamily: v })}
        >
          <SelectTrigger className="h-9 w-36 text-xs">
            <Type className="h-4 w-4 mr-1" />
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {/* Bold */}
      {value.content !== undefined && (
        <Toggle
          pressed={local.bold}
          onPressedChange={(v) => update({ bold: v })}
          size="sm"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
      )}
      {/* Italic */}
      {value.content !== undefined && (
        <Toggle
          pressed={local.italic}
          onPressedChange={(v) => update({ italic: v })}
          size="sm"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
      )}
    </div>
  );
};
