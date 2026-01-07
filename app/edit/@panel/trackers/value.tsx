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
import { getAnimationforTracker } from "@/core/utils/valAnimation";

const ValueTrackersPanelTab = () => {
  const { scene, valRefresh } = useScene();

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
                        const anim = getAnimationforTracker(
                          tm.tracker,
                          target,
                          duration
                        );
                        if (!anim) {
                          toast.error("Failed to create animation for slider.");
                          return;
                        }
                        scene?.animManager.addAnimations({
                          id: `${tm.id}_animate_to_${target}`,
                          anim,
                          type: "Value Animation",
                          mobjId: tm.id,
                          label: `Animate ${tm.id} to ${target}`,
                          tweenMeta: { duration, easing },
                        });
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

                {/* Delete Tracker */}
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
        <Separator orientation="horizontal" />
      </Accordion>
    </TooltipProvider>
  );
};

export default ValueTrackersPanelTab;
