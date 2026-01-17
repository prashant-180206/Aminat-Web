"use client";

import React from "react";
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

interface SliderSettingsPopoverProps {
  trackerId: string;
  onSliderAdded?: () => void;
}

const SliderSettingsPopover = ({
  trackerId,
  onSliderAdded,
}: SliderSettingsPopoverProps) => {
  const [sliderInput, setSliderInput] = React.useState<{
    min: number;
    max: number;
    rank: number;
  }>({ min: 0, max: 1, rank: 0 });

  // Import scene inside component to avoid circular dependencies
  const { scene, valToggle, valRefresh } = useScene();
  void valToggle;

  const updaterIds =
    scene?.trackerManager.getTracker(trackerId)?.tracker.getUpdaterIds() ?? [];

  const makeSlider = () => {
    if (!scene) return;

    const success = scene.trackerAnimator.addSliderAppearAnimation(
      trackerId,
      sliderInput,
    );

    if (!success) {
      toast.error("Failed to create slider");
      return;
    }
    scene.animManager.animate();
    toast.success("Slider created");
    onSliderAdded?.();
    valRefresh();
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
        <Card className="border-none shadow-none gap-2 py-2">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <h4 className="text-sm font-semibold">Slider Settings</h4>
          </div>

          {/* Range Inputs */}
          <div className="px-4 py-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs mb-2">Min Value</Label>
                <NumberStepperInput
                  value={sliderInput.min}
                  onChange={(v) => {
                    if (!isNaN(v)) {
                      setSliderInput((prev) => ({
                        ...prev,
                        min: v,
                      }));
                    }
                  }}
                />
              </div>
              <div>
                <Label className="text-xs mb-2">Max Value</Label>{" "}
                <NumberStepperInput
                  value={sliderInput.max}
                  onChange={(v) => {
                    if (!isNaN(v)) {
                      setSliderInput((prev) => ({
                        ...prev,
                        max: v,
                      }));
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col mt-4 pt-4 items-start justify-center border-t ">
              <Label className="text-xs mb-2">Rank</Label>
              <NumberStepperInput
                value={sliderInput.rank}
                onChange={(v) => {
                  if (!isNaN(v)) {
                    setSliderInput((prev) => ({
                      ...prev,
                      rank: v,
                    }));
                  }
                }}
              />
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
