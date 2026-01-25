"use client";

import React from "react";
import { useScene } from "@/hooks/SceneContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PencilOff, Trash2, MoveHorizontal, MoveVertical } from "lucide-react";
import PtUpdateSliderPopover from "./components/updatePtPopover";
import AnimatePtSliderPopover from "./components/animatePtSlider";
import { toast } from "sonner";

const PtValueTrackersPanelTab = () => {
  const { scene, valRefresh, animRefresh } = useScene();

  const trackers = scene?.trackerManager.getAllPtTrackerMetas() || [];

  const cm = scene?.connManager;

  if (trackers.length === 0) {
    return (
      <div className="px-2 text-xs italic text-muted-foreground">
        No point value trackers present
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Accordion type="multiple" className="w-full space-y-2">
        {trackers.map((tm) => (
          <AccordionItem
            key={tm.id}
            value={tm.id}
            className="rounded-md border"
          >
            <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline">
              <div className="flex w-full items-center justify-between gap-3 pr-4 text-left">
                <span className="truncate font-mono text-sm text-primary">
                  {tm.id}
                </span>
                <span className="text-xs text-muted-foreground">
                  Slider {tm.slider ? "✅" : "❎"}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="space-y-3 px-3 pb-3">
              <Separator />

              {/* ================= UPDATERS ================= */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-muted-foreground">
                  Updaters
                </div>

                {/* X AXIS */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MoveHorizontal size={14} />X Axis
                  </div>

                  {tm.tracker.x.getUpdaterIds().length === 0 ? (
                    <div className="pl-5 text-xs italic text-muted-foreground">
                      No X updaters
                    </div>
                  ) : (
                    tm.tracker.x.getUpdaterIds().map((id) => (
                      <div
                        key={id}
                        className="flex items-center justify-between rounded border px-2 py-1 text-xs"
                      >
                        <span className="truncate font-mono">{id}</span>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                cm?.removeXPtValueTrackerConnection(id);
                                valRefresh();
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            Remove X updater
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ))
                  )}
                </div>

                {/* Y AXIS */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MoveVertical size={14} />Y Axis
                  </div>

                  {tm.tracker.y.getUpdaterIds().length === 0 ? (
                    <div className="pl-5 text-xs italic text-muted-foreground">
                      No Y updaters
                    </div>
                  ) : (
                    tm.tracker.y.getUpdaterIds().map((id) => (
                      <div
                        key={id}
                        className="flex items-center justify-between rounded border px-2 py-1 text-xs"
                      >
                        <span className="truncate font-mono">{id}</span>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                cm?.removeYPtValueTrackerConnection(id);
                                valRefresh();
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            Remove Y updater
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <Separator />

              {/* ================= ACTIONS ================= */}
              <div
                className={`grid ${
                  tm.slider ? "grid-cols-4" : "grid-cols-3"
                } gap-2`}
              >
                {tm.slider && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PtUpdateSliderPopover
                        initialX={{
                          min: tm.slider.getMinX(),
                          max: tm.slider.getMaxX(),
                        }}
                        initialY={{
                          min: tm.slider.getMinY(),
                          max: tm.slider.getMaxY(),
                        }}
                        initialRank={tm.slider.getRank()}
                        onApply={({ minX, maxX, minY, maxY, rank }) => {
                          tm.slider!.update({
                            minX,
                            maxX,
                            minY,
                            maxY,
                            rank,
                          });
                          valRefresh();
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Update slider settings
                    </TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* <div> */}
                    <AnimatePtSliderPopover
                      onApply={({ duration, targetX, targetY, easing }) => {
                        const success = scene?.trackerAnimator.animatePtTracker(
                          tm.id,
                          { x: targetX, y: targetY },
                          duration,
                          easing,
                        );
                        if (!success) {
                          toast.error("Failed to create animation for slider.");
                          return;
                        }
                        toast.success("Animation added to queue.");
                        valRefresh();
                        animRefresh();
                      }}
                    />
                    {/* </div> */}
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Animate Slider / Tracker
                  </TooltipContent>
                </Tooltip>

                {/* Hide Slider */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const success =
                          scene?.trackerAnimator.addPtSliderDisappearAnimation(
                            tm.id,
                          );
                        if (!success) {
                          toast.error(
                            "Failed to create hide slider animation.",
                          );
                          return;
                        }
                        toast.success("Hide slider animation added to queue.");
                        valRefresh();
                        animRefresh();
                      }}
                    >
                      <PencilOff size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Hide slider</TooltipContent>
                </Tooltip>

                {/* Delete */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        scene?.removeTracker(tm.id);
                        valRefresh();
                        animRefresh();
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Delete tracker</TooltipContent>
                </Tooltip>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
        <Separator />
      </Accordion>
    </TooltipProvider>
  );
};

export default PtValueTrackersPanelTab;
