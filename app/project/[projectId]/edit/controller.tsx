"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useScene } from "@/hooks/SceneContext";
import { Play, RotateCcw, Rewind } from "lucide-react";
import { toast } from "sonner";

const Controller = () => {
  const { scene, animRefresh } = useScene();

  const play = () => {
    const result = scene?.animManager.animate();
    if (!result) toast.error("All animations have been played");
    animRefresh();
  };

  const reverse = () => {
    const res = scene?.animManager.reverseAnimate();
    if (!res) toast.error("All animations have been reversed");
    animRefresh();
  };

  const reset = () => {
    scene?.animManager.resetAll();
    animRefresh();
  };

  return (
    <div className="flex items-center gap-0.5 rounded-md border bg-background px-0.5 md:px-1 shadow-sm">
      {/* Reverse */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={reverse}
            className="h-7 w-7 md:h-8 md:w-8 p-0"
          >
            <Rewind className="h-3 w-3 md:h-3.5 md:w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Reverse</TooltipContent>
      </Tooltip>

      {/* Play */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={play}
            className="h-7 w-7 md:h-8 md:w-8 p-0"
          >
            <Play className="h-3 w-3 md:h-3.5 md:w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Play</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="mx-0.5 h-3 md:h-4" />

      {/* Reset */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={reset}
            className="h-7 w-7 md:h-8 md:w-8 p-0"
          >
            <RotateCcw className="h-3 w-3 md:h-3.5 md:w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Reset</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Controller;
