"use client";

import React from "react";
import { PtTrackerMeta } from "@/core/types/tracker";
import { useScene } from "@/hooks/SceneContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Combobox } from "@/components/combobox";

const PointValueTrackersTab = () => {
  const { scene, activeMobject } = useScene();

  const [trackers, setTrackers] = React.useState<PtTrackerMeta[]>([]);
  const [trackerName, setTrackerName] = React.useState("");
  const [trackerPointX, setTrackerPointX] = React.useState(0);
  const [trackerPointY, setTrackerPointY] = React.useState(0);
  const [selectedTracker, setSelectedTracker] = React.useState<string | null>(
    null
  );
  const [selectedFuncX, setSelectedFuncX] = React.useState<string | null>(
    activeMobject?.trackerconnector.getConnectorFuncNames()[0] ?? null
  );
  const [selectedFuncY, setSelectedFuncY] = React.useState<string | null>(
    activeMobject?.trackerconnector.getConnectorFuncNames()[0] ?? null
  );
  const [expressionX, setExpressionX] = React.useState("t");
  const [expressionY, setExpressionY] = React.useState("t");

  const fetchTrackers = React.useCallback(() => {
    if (!scene) return;
    setTrackers(scene.trackerManager.getAllPtTrackerMetas());
  }, [scene]);

  React.useEffect(() => {
    fetchTrackers();
  }, [fetchTrackers]);

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
    fetchTrackers();
  };

  const removeTracker = (name: string) => {
    if (!scene) return;
    scene.removePointValueTracker(name);
    toast.info("Point tracker removed");
    fetchTrackers();
  };

  const connectFuncs = () => {
    if (
      !activeMobject ||
      !selectedFuncX ||
      !selectedFuncY ||
      !expressionX ||
      !expressionY
    )
      return;

    const success = scene?.ConnectPtValueTrackerToMobject(
      selectedTracker || "",
      activeMobject.id(),
      selectedFuncX,
      selectedFuncY,
      expressionX,
      expressionY
    );

    if (success) {
      toast.success("Point tracker function connected");
    } else {
      toast.error("Failed to connect point tracker function");
    }
  };

  const makePtSlider = (trackerName: string) => {
    if (!scene) return;

    const { success, slider } = scene.trackerManager.addPtSlider(
      trackerName,
      {
        min: 0,
        max: 1,
      },
      {
        min: 0,
        max: 1,
      }
    );

    if (!success || !slider) {
      toast.error("Failed to create point slider");
      return;
    }

    scene.layer.add(slider);
    slider.appearAnim().play();
    toast.success("Point slider created");
  };

  const connectorNames =
    activeMobject?.trackerconnector.getConnectorFuncNames() ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* Add Point Tracker */}
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

      {/* Connector Functions */}
      <Card className="p-3 flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          Connect to Mobject
        </Label>
        <div className="flex flex-col gap-2">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Function X</Label>
            <Combobox
              options={connectorNames.map((f) => ({
                label: f,
                value: f,
              }))}
              value={selectedFuncX}
              onChange={setSelectedFuncX}
              className=""
            />
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Function Y</Label>
            <Combobox
              options={connectorNames.map((f) => ({
                label: f,
                value: f,
              }))}
              value={selectedFuncY}
              onChange={setSelectedFuncY}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">
              Expression X
            </Label>
            <Input
              placeholder="Exp in terms of t"
              value={expressionX}
              onChange={(e) => setExpressionX(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">
              Expression Y
            </Label>
            <Input
              placeholder="Exp in terms of t"
              value={expressionY}
              onChange={(e) => setExpressionY(e.target.value)}
            />
          </div>
        </div>
        <Button size="sm" onClick={connectFuncs}>
          Apply to Connector
        </Button>
      </Card>

      {/* Point Trackers List */}
      <Card className="p-3 flex flex-col gap-2">
        <Label>Existing Point Trackers</Label>

        {trackers.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No point trackers created
          </p>
        )}

        {trackers.map((tracker) => (
          <div
            key={tracker.id}
            className={`flex items-center justify-between rounded px-2 py-1 cursor-pointer ${
              selectedTracker === tracker.id
                ? "bg-primary/10"
                : "hover:bg-muted"
            }`}
            onClick={() => setSelectedTracker(tracker.id)}
          >
            <div className="flex flex-col gap-0.5">
              <span className="truncate text-xs font-medium">{tracker.id}</span>
              <span className="text-xs text-muted-foreground">
                ({tracker.tracker.x.tracker.value.toFixed(2)},{" "}
                {tracker.tracker.y.tracker.value.toFixed(2)})
              </span>
            </div>

            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  makePtSlider(tracker.id);
                }}
              >
                +
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTracker(tracker.id);
                }}
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default PointValueTrackersTab;
