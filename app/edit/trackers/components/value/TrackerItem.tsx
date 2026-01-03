"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import SliderSettingsPopover from "./SliderSettingsPopover";
import { useScene } from "@/hooks/SceneContext";
// import { useScene } from "@/hooks/SceneContext";

interface TrackerItemProps {
  trackerId: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

const TrackerItem = ({
  trackerId,
  isSelected,
  onSelect,
  onRemove,
}: TrackerItemProps) => {
  const { scene } = useScene();
  return (
    <div
      className={`flex items-center justify-between rounded px-2 py-1 cursor-pointer ${
        isSelected ? "bg-primary/10" : "hover:bg-muted"
      }`}
      onClick={() => onSelect(trackerId)}
    >
      <span className="truncate text-xs">{trackerId}</span>

      <div className="flex gap-1">
        <SliderSettingsPopover trackerId={trackerId} />

        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            scene?.animManager.removeAnimation(`slider_appear_${trackerId}`);
            onRemove(trackerId);
          }}
        >
          ×
        </Button>
      </div>
    </div>
  );
};

export default TrackerItem;
