"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useScene } from "@/hooks/SceneContext";

interface AddTrackerCardProps {
  onTrackerAdded: () => void;
}

const AddTrackerCard = ({ onTrackerAdded }: AddTrackerCardProps) => {
  const { valRefresh } = useScene();
  const [trackerName, setTrackerName] = React.useState("");
  const [trackerValue, setTrackerValue] = React.useState(0);

  // Import scene context inside component to avoid circular dependencies
  const { scene } = useScene();

  const addTracker = () => {
    if (!scene || !trackerName.trim()) return;
    scene.trackerManager.addValueTracker(trackerName, trackerValue);
    toast.success("Tracker created");
    setTrackerName("");
    setTrackerValue(0);
    onTrackerAdded();
    valRefresh();
  };

  return (
    <Card className="p-3 flex flex-col gap-2">
      <Label>Add Value Tracker</Label>
      <Input
        placeholder="Tracker name"
        value={trackerName}
        onChange={(e) => setTrackerName(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Initial value"
        value={trackerValue}
        onChange={(e) => setTrackerValue(Number(e.target.value))}
      />
      <Button size="sm" onClick={addTracker}>
        Create
      </Button>
    </Card>
  );
};

export default AddTrackerCard;
