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

const PtValueTrackersPanelTab = () => {
  const { scene, valRefresh } = useScene();

  const trackers = scene?.trackerManager.getAllPtTrackerMetas() || [];

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
                                tm.tracker.x.removeUpdater(id);
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
                                tm.tracker.y.removeUpdater(id);
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
                  tm.slider ? "grid-cols-3" : "grid-cols-2"
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

                {/* Hide Slider */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const anim = tm.slider?.disappearAnim();
                        if (!anim) return;

                        scene?.animManager.addAnimations({
                          id: `slider_disappear_${tm.id}`,
                          anim,
                          type: "Slider Disappear",
                          mobjId: tm.id,
                          label: `Slider Disappear Animation for ${tm.id}`,
                          tweenMeta: { duration: 1 },
                        });

                        scene?.animManager.animate();
                        valRefresh();
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
                        scene?.trackerManager.remove(tm.id);
                        scene?.animManager.removeAnimation(
                          `slider_appear_${tm.id}`
                        );
                        scene?.animManager.removeAnimation(
                          `slider_disappear_${tm.id}`
                        );
                        valRefresh();
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
