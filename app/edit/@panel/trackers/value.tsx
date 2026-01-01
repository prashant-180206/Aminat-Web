"use client";

import React from "react";
import { useScene } from "@/hooks/SceneContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UpdateSliderPopover from "./updatePopover";
// import UpdateSliderPopover from "./UpdateSliderPopover";

const ValueTrackersPanelTab = () => {
  const { scene, valRefresh } = useScene();

  const trackers = scene?.trackerManager.getAllTrackerMetas() || [];

  return (
    <div className="flex flex-col gap-4 ">
      {trackers.map((tm) => (
        <Card key={tm.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              Tracker: <span className="font-mono">{tm.id}</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Slider info */}
            <div className="text-sm text-muted-foreground">
              Slider:{" "}
              <span className="font-medium">
                {tm.slider ? "Present" : "Not Present"}
              </span>
            </div>

            <Separator />

            {/* Updaters */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground">
                Updaters
              </div>

              {tm.tracker.getUpdaterIds().length === 0 && (
                <div className="text-xs text-muted-foreground italic">
                  No updaters attached
                </div>
              )}

              {tm.tracker.getUpdaterIds().map((id) => (
                <div
                  key={id}
                  className="flex items-center justify-between rounded border px-2 py-1"
                >
                  <span className="text-xs font-mono">{id}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      tm.tracker.removeUpdater(id);
                      valRefresh();
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {tm.slider && (
                <UpdateSliderPopover
                  initialMin={tm.slider.getMin()}
                  initialMax={tm.slider.getMax()}
                  initialRank={tm.slider.rank}
                  onApply={({ min, max, rank }) => {
                    tm.slider?.update({ min, max, rank });
                    valRefresh();
                  }}
                />
              )}

              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  scene?.trackerManager.remove(tm.id);
                  valRefresh();
                }}
              >
                Remove Tracker
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ValueTrackersPanelTab;
