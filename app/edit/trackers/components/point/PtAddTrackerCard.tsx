"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useScene } from "@/hooks/SceneContext";

interface PtAddTrackerCardProps {
  onTrackerAdded: () => void;
}

const PtAddTrackerCard = ({ onTrackerAdded }: PtAddTrackerCardProps) => {
  const [trackerName, setTrackerName] = React.useState("");
  const [trackerPointX, setTrackerPointX] = React.useState(0);
  const [trackerPointY, setTrackerPointY] = React.useState(0);

  const { scene } = useScene();

  const addTracker = () => {
    if (!scene || !trackerName.trim()) return;
    scene.addPointValueTracker(trackerName, {
      x: trackerPointX,
      y: trackerPointY,
    });
    toast.success("Point tracker created");
    setTrackerName("");
    setTrackerPointX(0);
    setTrackerPointY(0);
    onTrackerAdded();
  };

  return (
    <Card className="p-3 flex flex-col gap-2">
      <Label>Add Point Tracker</Label>
      <Input
        placeholder="Tracker name"
        value={trackerName}
        onChange={(e) => setTrackerName(e.target.value)}
      />
      <div className="flex gap-2">
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">X</Label>
          <Input
            type="number"
            placeholder="X value"
            value={trackerPointX}
            onChange={(e) => setTrackerPointX(Number(e.target.value))}
          />
        </div>
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">Y</Label>
          <Input
            type="number"
            placeholder="Y value"
            value={trackerPointY}
            onChange={(e) => setTrackerPointY(Number(e.target.value))}
          />
        </div>
      </div>
      <Button size="sm" onClick={addTracker}>
        Create
      </Button>
    </Card>
  );
};

export default PtAddTrackerCard;
