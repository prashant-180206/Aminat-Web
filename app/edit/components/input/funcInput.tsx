"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, X, FunctionSquare } from "lucide-react";
import { parse } from "mathjs";
import { toast } from "sonner";

type Func = {
  Xfunc: string;
  Yfunc: string;
};

type FuncsInputProps = {
  property: string;
  value: Func;
  onChange: (val: Func) => void;
};

export const FuncsInput: React.FC<FuncsInputProps> = ({
  property,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Func>(value);

  const apply = () => {
    try {
      const tValue = 1;

      const evalExpr = (expr: string) => {
        const substituted = expr.replace("t", `(${tValue})`);
        const node = parse(substituted);
        node.evaluate();
      };

      evalExpr(draft.Xfunc);
      evalExpr(draft.Yfunc);

      // ✅ both valid
      onChange(draft);
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Invalid function expression");
      //   console.error("Invalid function expression", err);
      // ❌ do nothing if invalid
    }
  };

  const cancel = () => {
    setDraft(value);
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <span className="text-sm font-medium">{property}</span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-xs"
          >
            <FunctionSquare className="h-4 w-4" />
            {value.Xfunc || "x"} , {value.Yfunc || "y"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 space-y-3">
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground">
                X function
              </label>
              <Input
                defaultValue={draft.Xfunc}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, Xfunc: e.target.value }))
                }
                placeholder="e.g. x + sin(t)"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Y function
              </label>
              <Input
                defaultValue={draft.Yfunc}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, Yfunc: e.target.value }))
                }
                placeholder="e.g. y + cos(t)"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={cancel}>
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
