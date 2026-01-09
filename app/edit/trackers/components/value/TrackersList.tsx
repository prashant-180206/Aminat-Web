"use client";

import React from "react";
import { TrackerMeta } from "@/core/types/tracker";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import TrackerItem from "./TrackerItem";
import { useScene } from "@/hooks/SceneContext";

interface TrackersListProps {
  trackers: TrackerMeta[];
  selectedTracker: string | null;
  onTrackerSelect: (id: string) => void;
  onTrackerRemove: (id: string) => void;
}

const TrackersList = ({
  trackers,
  selectedTracker,
  onTrackerSelect,
  onTrackerRemove,
}: TrackersListProps) => {
  const { scene, valToggle, valRefresh, animRefresh } = useScene();
  void valToggle;

  const handleRemoveTracker = (name: string) => {
    if (!scene) return;
    scene.removeTracker(name);
    toast.success(`Removed tracker: ${name}`);
    onTrackerRemove(name);
    valRefresh();
    animRefresh();
  };

  return (
    <Card className="p-3 flex flex-col gap-2">
      <Label>Existing Value Trackers</Label>

      {trackers.length === 0 && (
        <p className="text-xs text-muted-foreground">No trackers created</p>
      )}

      {trackers.map((tracker) => (
        <TrackerItem
          key={tracker.id}
          trackerId={tracker.id}
          isSelected={selectedTracker === tracker.id}
          onSelect={onTrackerSelect}
          onRemove={handleRemoveTracker}
        />
      ))}
    </Card>
  );
};

export default TrackersList;
