"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, X, FunctionSquare } from "lucide-react";

export const StringInputs = ({
  inputs,
  onApply,
  message = "Edit functions",
}: {
  inputs: {
    label: string;
    value: string;
  }[];
  onApply: (vals: string[]) => void;
  message?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [drafts, setDrafts] = useState<string[]>(inputs.map((i) => i.value));

  const apply = () => {
    onApply(drafts);
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <div className="inline-block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-xs"
                  >
                    <FunctionSquare className="h-4 w-4" />
                  </Button>
                </div>
              </PopoverTrigger>
            </TooltipTrigger>

            <TooltipContent side="top" align="center">
              {message}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <PopoverContent className="w-64 space-y-3">
          <div className="space-y-2">
            {inputs.map((input, idx) => (
              <div key={input.label}>
                <label className="text-xs text-muted-foreground">
                  {input.label}
                </label>
                <Input
                  value={drafts[idx]}
                  onChange={(e) =>
                    setDrafts((d) => {
                      const next = [...d];
                      next[idx] = e.target.value;
                      return next;
                    })
                  }
                  placeholder="e.g. x + sin(t)"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>

            <Button size="sm" onClick={apply}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
