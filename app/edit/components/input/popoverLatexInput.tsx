"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import dynamic from "next/dynamic";

const EditableMathField = dynamic(
  () => import("react-mathquill").then((mod) => mod.EditableMathField),
  { ssr: false }
);

type PopoverSliderInputProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  refreshFunc?: () => void;
  icon?: React.ReactNode;
};

let mathQuillStylesLoaded = false;

export const PopoverLatexInput: React.FC<PopoverSliderInputProps> = ({
  label,
  value,
  onChange,
  refreshFunc,
  icon,
}) => {
  const [latex, setLatex] = useState(value);

  useEffect(() => {
    if (!mathQuillStylesLoaded) {
      mathQuillStylesLoaded = true;
      import("react-mathquill").then((mod) => mod.addStyles());
    }
  }, []);

  useEffect(() => {
    setLatex(value);
  }, [value]);

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-xs"
          >
            {icon}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4 space-y-4">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{label}</span>
            <span className="text-xs text-muted-foreground truncate">
              {value}
            </span>
          </div>

          {/* Math editor */}
          <div className="rounded-md border bg-background p-2 focus-within:ring-1 focus-within:ring-ring">
            <EditableMathField
              latex={latex}
              onChange={(mf) => setLatex(mf.latex())}
              style={{
                borderRadius: 0,
              }}
            />
          </div>

          {/* Live LaTeX preview */}
          <div className="rounded-md bg-muted p-2 text-xs font-mono max-h-24 overflow-auto">
            {latex || <span className="text-muted-foreground">Empty</span>}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => {
                onChange(latex);
                refreshFunc?.();
              }}
            >
              Apply
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => setLatex(value)}
            >
              Reset
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
