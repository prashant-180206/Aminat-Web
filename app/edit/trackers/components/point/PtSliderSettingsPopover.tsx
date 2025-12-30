"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { toast } from "sonner";
import { useScene } from "@/hooks/SceneContext";

interface PtSliderSettingsPopoverProps {
  trackerId: string;
  onSliderAdded?: () => void;
}

const PtSliderSettingsPopover = ({
  trackerId,
  onSliderAdded,
}: PtSliderSettingsPopoverProps) => {
  const [sliderInputX, setSliderInputX] = React.useState<{
    min: number;
    max: number;
  }>({ min: 0, max: 1 });

  const [sliderInputY, setSliderInputY] = React.useState<{
    min: number;
    max: number;
  }>({ min: 0, max: 1 });

  const { scene } = useScene();

  const makePtSlider = () => {
    if (!scene) return;

    const { success, slider } = scene.trackerManager.addPtSlider(
      trackerId,
      sliderInputX,
      sliderInputY
    );

    if (!success || !slider) {
      toast.error("Failed to create point slider");
      return;
    }

    scene.layer.add(slider);
    slider.appearAnim().play();
    toast.success("Point slider created");
    onSliderAdded?.();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex h-6 w-6 items-center justify-center rounded-md 
               hover:bg-muted transition text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          +
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0" onClick={(e) => e.stopPropagation()}>
        <Card className="border-none shadow-none">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <h4 className="text-sm font-semibold">Point Slider Settings</h4>
          </div>

          {/* Range Inputs */}
          <div className="px-4 py-3 space-y-3">
            {/* X Range */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                X Range
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Min</Label>
                  <Input
                    placeholder="Min"
                    type="number"
                    value={sliderInputX.min}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val)) {
                        setSliderInputX((prev) => ({
                          ...prev,
                          min: val,
                        }));
                      }
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs">Max</Label>
                  <Input
                    placeholder="Max"
                    type="number"
                    value={sliderInputX.max}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val)) {
                        setSliderInputX((prev) => ({
                          ...prev,
                          max: val,
                        }));
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Y Range */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Y Range
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Min</Label>
                  <Input
                    placeholder="Min"
                    type="number"
                    value={sliderInputY.min}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val)) {
                        setSliderInputY((prev) => ({
                          ...prev,
                          min: val,
                        }));
                      }
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs">Max</Label>
                  <Input
                    placeholder="Max"
                    type="number"
                    value={sliderInputY.max}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val)) {
                        setSliderInputY((prev) => ({
                          ...prev,
                          max: val,
                        }));
                      }
                    }}
                  />
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
