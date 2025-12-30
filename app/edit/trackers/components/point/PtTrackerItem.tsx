"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import PtSliderSettingsPopover from "./PtSliderSettingsPopover";

interface PtTrackerItemProps {
  trackerId: string;
  trackerValue: { x: number; y: number };
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

const PtTrackerItem = ({
  trackerId,
  trackerValue,
  isSelected,
  onSelect,
  onRemove,
}: PtTrackerItemProps) => {
  return (
    <div
      className={`flex items-center justify-between rounded px-2 py-1 cursor-pointer ${
        isSelected ? "bg-primary/10" : "hover:bg-muted"
      }`}
      onClick={() => onSelect(trackerId)}
    >
      <div className="flex flex-col gap-0.5">
        <span className="truncate text-xs font-medium">{trackerId}</span>
        <span className="text-xs text-muted-foreground">
          ({trackerValue.x.toFixed(2)}, {trackerValue.y.toFixed(2)})
        </span>
      </div>

      <div className="flex gap-1">
        <PtSliderSettingsPopover trackerId={trackerId} />

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

export default PtTrackerItem;
