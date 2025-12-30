"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import SliderSettingsPopover from "./SliderSettingsPopover";

interface TrackerItemProps {
  trackerId: string;
  isSelected: boolean;
  updaterIds: string[];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

const TrackerItem = ({
  trackerId,
  isSelected,
  updaterIds,
  onSelect,
  onRemove,
}: TrackerItemProps) => {
  return (
    <div
      className={`flex items-center justify-between rounded px-2 py-1 cursor-pointer ${
        isSelected ? "bg-primary/10" : "hover:bg-muted"
      }`}
      onClick={() => onSelect(trackerId)}
    >
      <span className="truncate text-xs">{trackerId}</span>

      <div className="flex gap-1">
        <SliderSettingsPopover trackerId={trackerId} updaterIds={updaterIds} />

        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
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
