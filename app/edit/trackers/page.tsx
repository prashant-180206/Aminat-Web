"use client";

import React from "react";
import { TrackerMeta } from "@/core/types/tracker";
import { useScene } from "@/hooks/SceneContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Combobox } from "@/components/combobox";

const TrackersTab = () => {
  const { scene, activeMobject } = useScene();

  const [trackers, setTrackers] = React.useState<TrackerMeta[]>([]);
  const [trackerName, setTrackerName] = React.useState("");
  const [trackerValue, setTrackerValue] = React.useState(0);
  const [selectedTracker, setSelectedTracker] = React.useState<string | null>(
    null
  );
  const [selectedFunc, setSelectedFunc] = React.useState<string | null>(
    activeMobject?.trackerconnector.getConnectorFuncNames()[0] ?? null
  );
  const [expression, setExpression] = React.useState("t");

  const fetchTrackers = React.useCallback(() => {
    if (!scene) return;
    setTrackers(scene.trackerManager.getAllTrackerMetas());
  }, [scene]);

  React.useEffect(() => {
    fetchTrackers();
  }, [fetchTrackers]);

  const addTracker = () => {
    if (!scene || !trackerName.trim()) return;
    scene.trackerManager.addValueTracker(trackerName, trackerValue);
    toast.success("Tracker created");
    setTrackerName("");
    setTrackerValue(0);
    fetchTrackers();
  };

  const removeTracker = (name: string) => {
    if (!scene) return;
    scene.trackerManager.remove(name);
    toast.info("Tracker removed");
    fetchTrackers();
  };

  const connectFuncs = () => {
    if (!activeMobject || !selectedFunc || !expression) return;

    const success = scene?.ConnectValueTrackerToMobject(
      selectedTracker || "",
      activeMobject.id(),
      selectedFunc,
      expression
    );

    if (success) {
      toast.success("Function connected to tracker");
    } else {
      toast.error("Failed to connect function to tracker");
    }
  };

  const makeSlider = (trackerName: string) => {
    if (!scene) return;

    const { success, slider } = scene.trackerManager.addSlider(trackerName, {
      min: 0,
      max: 1,
    });

    if (!success || !slider) {
      toast.error("Failed to create slider");
      return;
    }

    scene.layer.add(slider);
    slider.appearAnim().play();
    toast.success("Slider created");
  };

  const connectorNames =
    activeMobject?.trackerconnector.getConnectorFuncNames() ?? [];

  return (
    <div className="w-[260px] h-screen p-4 flex flex-col gap-4 text-sm overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base">Trackers</h2>
        <Button size="sm" variant="outline" onClick={fetchTrackers}>
          Refresh
        </Button>
      </div>

      <Separator />

      {/* Add Tracker */}
      <Card className="p-3 flex flex-col gap-2">
        <Label>Add Tracker</Label>
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

      {/* Connector Functions */}
      <Card className="p-3 flex flex-col gap-2">
        <Combobox
          options={connectorNames.map((f) => ({
            label: f,
            value: f,
          }))}
          value={selectedFunc}
          onChange={setSelectedFunc}
        />
        <Input
          placeholder="Write an Exp in terms of t "
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
        />
        <Button onClick={connectFuncs}>Apply to Connector</Button>
      </Card>

      {/* Trackers List */}
      <Card className="p-3 flex flex-col gap-2">
        <Label>Existing Trackers</Label>

        {trackers.length === 0 && (
          <p className="text-xs text-muted-foreground">No trackers created</p>
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
            <span className="truncate">{tracker.id}</span>

            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  makeSlider(tracker.id);
                }}
              >
                +
              </Button>
              <Button
                size="icon"
                variant="ghost"
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

export default TrackersTab;
