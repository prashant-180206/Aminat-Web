"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { toast } from "sonner";
import { useScene } from "@/hooks/SceneContext";
import { NumberStepperInput } from "@/core/classes/controllers/input/numberstepper";
// import { NumberStepperInput } from "@/app/scene/edit/components/input/numberInput";

interface PtSliderSettingsPopoverProps {
  trackerId: string;
  onSliderAdded?: () => void;
}

const PtSliderSettingsPopover = ({
  trackerId,
  onSliderAdded,
}: PtSliderSettingsPopoverProps) => {
  const { valToggle, valRefresh } = useScene();
  void valToggle;
  const [sliderInputX, setSliderInputX] = React.useState<{
    min: number;
    max: number;
  }>({ min: 0, max: 1 });

  const [sliderInputY, setSliderInputY] = React.useState<{
    min: number;
    max: number;
  }>({ min: 0, max: 1 });

  const [rank, setRank] = useState<number>(0);
  const { scene } = useScene();

  const makePtSlider = () => {
    if (!scene) return;

    const success = scene.trackerAnimator.addPtSliderAppearAnimation(
      trackerId,
      {
        minX: sliderInputX.min,
        maxX: sliderInputX.max,
        minY: sliderInputY.min,
        maxY: sliderInputY.max,
        rank,
      },
    );

    if (!success) {
      toast.error("Failed to create point slider");
      return;
    }
    toast.success("Point slider created");
    onSliderAdded?.();
    valRefresh();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          +
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0" onClick={(e) => e.stopPropagation()}>
        <Card className="border-none shadow-none p-2">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <h4 className="text-sm font-semibold">Point Slider Settings</h4>
          </div>

          {/* Range Inputs */}
          <div className="px-4 py-0 space-y-3">
            {/* X Range */}
            <div className="gap-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                X Range
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="">
                  <Label className="text-xs mb-2">Min</Label>
                  <NumberStepperInput
                    value={sliderInputX.min}
                    onChange={(v) => {
                      if (!isNaN(v)) {
                        setSliderInputX((prev) => ({
                          ...prev,
                          min: v,
                        }));
                      }
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs mb-2">Max</Label>
                  <NumberStepperInput
                    value={sliderInputX.max}
                    onChange={(v) => {
                      if (!isNaN(v)) {
                        setSliderInputX((prev) => ({
                          ...prev,
                          max: v,
                        }));
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Y Range */}
            <div className="gap-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Y Range
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs mb-2">Min</Label>
                  <NumberStepperInput
                    value={sliderInputY.min}
                    onChange={(v) => {
                      if (!isNaN(v)) {
                        setSliderInputY((prev) => ({
                          ...prev,
                          min: v,
                        }));
                      }
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs mb-2">Max</Label>
                  <NumberStepperInput
                    value={sliderInputY.max}
                    onChange={(v) => {
                      if (!isNaN(v)) {
                        setSliderInputY((prev) => ({
                          ...prev,
                          max: v,
                        }));
                      }
                    }}
                  />
                </div>
              </div>
              <div className="gap-2 mt-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs mb-2">Rank</Label>
                    <NumberStepperInput
                      value={sliderInputY.min}
                      onChange={(v) => {
                        setRank(v);
                      }}
                    />
                  </div>
                  {/* <div></div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 py-2 border-t flex justify-between items-center">
            <Button
              variant="secondary"
              className="h-7"
              onClick={(e) => {
                e.stopPropagation();
                makePtSlider();
              }}
            >
              Add Slider
            </Button>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default PtSliderSettingsPopover;
