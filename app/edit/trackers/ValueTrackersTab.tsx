"use client";

import React from "react";
import { TrackerMeta } from "@/core/types/tracker";
import { useScene } from "@/hooks/SceneContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Combobox } from "@/components/combobox";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";

const ValueTrackersTab = () => {
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

  const [sliderInput, setSliderInput] = React.useState<{
    min: number;
    max: number;
  }>({ min: 0, max: 1 });

  const [updaterIds, setUpdaterIds] = React.useState<string[]>([]);

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
    if (!activeMobject || !selectedFunc || !expression || !scene) return;

    const { success, id } = scene.ConnectValueTrackerToMobject(
      selectedTracker || "",
      activeMobject.id(),
      selectedFunc,
      expression
    );

    setUpdaterIds((prev) => (id ? [...prev, id] : prev));

    if (success) {
      toast.success("Function connected to tracker");
    } else {
      toast.error("Failed to connect function to tracker");
    }
  };

  const makeSlider = (trackerName: string) => {
    if (!scene) return;

    const { success, slider } = scene.trackerManager.addSlider(
      trackerName,
      sliderInput
    );

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
    <div className="flex flex-col gap-4">
      {/* Add Tracker */}
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

      {/* Connector Functions */}
      <Card className="p-3 flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          Connect to Mobject
        </Label>
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
        <Button size="sm" onClick={connectFuncs}>
          Apply to Connector
        </Button>
      </Card>

      {/* Trackers List */}
      <Card className="p-3 flex flex-col gap-2">
        <Label>Existing Value Trackers</Label>

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
            <span className="truncate text-xs">{tracker.id}</span>

            <div className="flex gap-1">
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

                <PopoverContent
                  className="w-64 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Card className="border-none shadow-none">
                    {/* Header */}
                    <div className="px-4 py-3 border-b">
                      <h4 className="text-sm font-semibold">Slider Settings</h4>
                    </div>

                    {/* Range Inputs */}
                    <div className="px-4 py-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Min Value</Label>
                          <Input
                            placeholder="Min"
                            type="number"
                            value={sliderInput.min}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (!isNaN(val)) {
                                setSliderInput((prev) => ({
                                  ...prev,
                                  min: val,
                                }));
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Max Value</Label>{" "}
                          <Input
                            placeholder="Max"
                            type="number"
                            value={sliderInput.max}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (!isNaN(val)) {
                                setSliderInput((prev) => ({
                                  ...prev,
                                  max: val,
                                }));
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-4 py-2 border-t flex justify-between items-center">
                      <Button
                        variant="secondary"
                        className="h-7 "
                        onClick={(e) => {
                          e.stopPropagation();
                          makeSlider(tracker.id);
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

export default ValueTrackersTab;
