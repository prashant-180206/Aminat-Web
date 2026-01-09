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
import UpdateSliderPopover from "./components/updatePopover";
import { PencilOff, Trash2, Activity } from "lucide-react";
import AnimateSliderPopover from "./components/animateSliderPopover";
import { toast } from "sonner";
import { TrackerAnimator } from "@/core/utils/valAnimation";
// import { getAnimationforTracker } from "@/core/utils/valAnimation";

const ValueTrackersPanelTab = () => {
  const { scene, valRefresh, animRefresh } = useScene();

  const trackers = scene?.trackerManager.getAllTrackerMetas() || [];

  if (trackers.length === 0) {
    return (
      <div className="px-2 text-xs italic text-muted-foreground">
        No value trackers present
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
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Activity size={14} />
                  Updaters
                </div>

                {tm.tracker.getUpdaterIds().length === 0 ? (
                  <div className="pl-5 text-xs italic text-muted-foreground">
                    No updaters attached
                  </div>
                ) : (
                  tm.tracker.getUpdaterIds().map((id) => (
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
                              tm.tracker.removeUpdater(id);
                              valRefresh();
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          Remove updater
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ))
                )}
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
                      {/* <div> */}
                      <UpdateSliderPopover
                        initialMin={tm.slider.getMin()}
                        initialMax={tm.slider.getMax()}
                        initialRank={tm.slider.rank}
                        onApply={({ min, max, rank }) => {
                          tm.slider?.update({ min, max, rank });
                          valRefresh();
                        }}
                      />
                      {/* </div> */}
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Update slider settings
                    </TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* <div> */}
                    <AnimateSliderPopover
                      onApply={({ duration, target, easing }) => {
                        const anim = TrackerAnimator.getAnimationforTracker(
                          tm.tracker,
                          target,
                          tm.id,
                          duration,
                          easing
                        );
                        if (!anim) {
                          toast.error("Failed to create animation for slider.");
                          return;
                        }
                        scene?.animManager.addAnimations(anim);
                        toast.success("Animation added to queue.");
                        scene?.animManager.animate();
                        valRefresh();
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
                        const { success, anim } =
                          TrackerAnimator.getSliderDisappearAnimation(tm);
                        if (!success || !anim) {
                          toast.error(
                            "Failed to create hide slider animation."
                          );
                          return;
                        }

                        scene?.animManager.addAnimations(anim);
                        toast.success("Hide slider animation added to queue.");
                        scene?.animManager.animate();
                        valRefresh();
                      }}
                    >
                      <PencilOff size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Hide slider</TooltipContent>
                </Tooltip>

                {/* Delete Tracker */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        scene?.removeTracker(tm.id);
                        toast.success(`Deleted tracker ${tm.id}`);
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
        <Separator orientation="horizontal" />
      </Accordion>
    </TooltipProvider>
  );
};

export default ValueTrackersPanelTab;
