"use client";

import React from "react";
import { PtTrackerMeta } from "@/core/types/tracker";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import PtTrackerItem from "./PtTrackerItem";
import { useScene } from "@/hooks/SceneContext";

interface PtTrackersListProps {
  trackers: PtTrackerMeta[];
  selectedTracker: string | null;
  onTrackerSelect: (id: string) => void;
  onTrackerRemove: (id: string) => void;
}

const PtTrackersList = ({
  trackers,
  selectedTracker,
  onTrackerSelect,
  onTrackerRemove,
}: PtTrackersListProps) => {
  const { scene } = useScene();

  const handleRemoveTracker = (name: string) => {
    if (!scene) return;
    scene.trackerManager.remove(name);
    toast.info("Point tracker removed");
    onTrackerRemove(name);
  };

  return (
    <Card className="p-3 flex flex-col gap-2">
      <Label>Existing Point Trackers</Label>

      {trackers.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No point trackers created
        </p>
      )}

      {trackers.map((tracker) => (
        <PtTrackerItem
          key={tracker.id}
          trackerId={tracker.id}
          trackerValue={{
            x: tracker.tracker.x.tracker.value,
            y: tracker.tracker.y.tracker.value,
          }}
          isSelected={selectedTracker === tracker.id}
          onSelect={onTrackerSelect}
          onRemove={handleRemoveTracker}
        />
      ))}
    </Card>
  );
};

export default PtTrackersList;
