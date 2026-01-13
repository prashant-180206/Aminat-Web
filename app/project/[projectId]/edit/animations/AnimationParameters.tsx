/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/combobox";
import { easingMap } from "@/core/maps/easingMap";
import { AnimFuncMeta } from "@/core/types/animation";

interface AnimationParametersProps {
  animMeta: AnimFuncMeta | null;
  inputObject: Record<string, any>;
  onInputChange: (key: string, value: any) => void;
}

const AnimationParameters: React.FC<AnimationParametersProps> = ({
  animMeta,
  inputObject,
  onInputChange,
}) => {
  if (!animMeta) return null;

  const inputData = animMeta.input;

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs font-medium text-muted-foreground">
        Parameters
      </Label>

      {Object.entries(inputData).map(([key, type]) => {
        if (key === "easing") {
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <Label className="text-xs">{key}</Label>
              <Combobox
                options={Object.keys(easingMap).map((val) => ({
                  label: val,
                  value: val,
                }))}
                value={inputObject[key]}
                onChange={(val) => onInputChange(key, val)}
              />
            </div>
          );
        }

        return (
          <div key={key} className="flex flex-col gap-1.5">
            <Label className="text-xs">{key}</Label>
            <Input
              type={type === "number" ? "number" : "text"}
              defaultValue={inputObject[key] ?? "0"}
              onChange={(e) =>
                onInputChange(
                  key,
                  type === "number" ? Number(e.target.value) : e.target.value
                )
              }
              className="h-9"
            />
          </div>
        );
      })}
    </div>
  );
};

export default AnimationParameters;
