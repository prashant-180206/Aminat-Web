"use client";

import React, { useState } from "react";
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
import { NumberStepperInput } from "./numberstepper";

type TextStyle = {
  // content: string;
  fontsize: number;
  fontfamily: string;
  bold: boolean;
  italic: boolean;
  color: string;
};

type TextStyleInputProps = {
  value: TextStyle;
  onChange: (val: Partial<TextStyle>) => void;
  isSvg?: boolean;
};

export const TextStyleInput: React.FC<TextStyleInputProps> = ({
  value,
  onChange,
  isSvg = false,
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

  return (
    <div className="flex items-center h-8 gap-1 rounded-md border-foreground/30 border bg-background p-1 overflow-hidden">
      {/* Text color */}
      <ColorDisc
        value={local.color}
        onChange={(c) => {
          setLocal({ ...local, color: c });
          onChange({ color: c });
        }}
        refreshFunc={() => {}}
        size={6}
        // className="w-8 h-8 rounded-md border"
      />
      {/* Font size */}
      <NumberStepperInput
        value={local.fontsize}
        min={1}
        max={200}
        step={4}
        onChange={(v) => {
          setLocal({ ...local, fontsize: v });
          onChange({ fontsize: v });
        }}
      />
      {/* Font family */}

      {!isSvg && (
        <Select
          value={local.fontfamily}
          onValueChange={(v) => {
            setLocal({ ...local, fontfamily: v });
            onChange({ fontfamily: v });
          }}
        >
          <SelectTrigger className=" border-none w-36 text-xs h-8 ">
            <Type className="h-4 w-4 mr-1" />
            <SelectValue className="text-sm" placeholder="Font" />
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

      <Toggle
        pressed={local.bold}
        onPressedChange={(v) => {
          setLocal({ ...local, bold: v });
          onChange({ bold: v });
        }}
        size="sm"
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      <Toggle
        pressed={local.italic}
        onPressedChange={(v) => {
          setLocal({ ...local, italic: v });
          onChange({ italic: v });
        }}
        size="sm"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
    </div>
  );
};
