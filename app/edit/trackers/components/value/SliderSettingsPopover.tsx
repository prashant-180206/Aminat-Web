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

interface SliderSettingsPopoverProps {
  trackerId: string;
  updaterIds: string[];
  onSliderAdded?: () => void;
}

const SliderSettingsPopover = ({
  trackerId,
  updaterIds,
  onSliderAdded,
}: SliderSettingsPopoverProps) => {
  const [sliderInput, setSliderInput] = React.useState<{
    min: number;
    max: number;
  }>({ min: 0, max: 1 });

  // Import scene inside component to avoid circular dependencies
  const { scene } = useScene();

  const makeSlider = () => {
    if (!scene) return;

    const { success, slider } = scene.trackerManager.addSlider(
      trackerId,
      sliderInput
    );

    if (!success || !slider) {
      toast.error("Failed to create slider");
      return;
    }

    scene.layer.add(slider);
    slider.appearAnim().play();
    toast.success("Slider created");
    onSliderAdded?.();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md 
               hover:bg-muted transition"
          onClick={(e) => e.stopPropagation()}
        >
          ⚙️
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0" onClick={(e) => e.stopPropagation()}>
        <Card className="border-none shadow-none">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <h4 className="text-sm font-semibold">Slider Settings</h4>
          </div>

          {/* Range Inputs */}
          <div className="px-4 py-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Min Value</Label>
                <Input
                  placeholder="Min"
                  type="number"
                  value={sliderInput.min}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) {
                      setSliderInput((prev) => ({
                        ...prev,
                        min: val,
                      }));
                    }
                  }}
                />
              </div>
              <div>
                <Label className="text-xs">Max Value</Label>{" "}
                <Input
                  placeholder="Max"
                  type="number"
                  value={sliderInput.max}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) {
                      setSliderInput((prev) => ({
                        ...prev,
                        max: val,
                      }));
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 py-2 border-t flex justify-between items-center">
            <Button
              variant="secondary"
              className="h-7 "
              onClick={(e) => {
                e.stopPropagation();
                makeSlider();
              }}
            >
              Add Slider
            </Button>
          </div>

          {/* Updaters */}
          {updaterIds.length > 0 && (
            <div className="px-4 py-3 border-t space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Linked Updaters
              </p>

              <div className="space-y-1">
                {updaterIds.map((id) => (
                  <div
                    key={id}
                    className="text-xs px-2 py-1 rounded-md bg-muted"
                  >
                    {id}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default SliderSettingsPopover;
