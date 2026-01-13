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
    <div className="flex items-center gap-0.5 rounded-md border bg-background px-1 py-0.5 shadow-sm">
      {/* Reverse */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={reverse}
            className="h-6 w-6 p-0"
          >
            <Rewind className="h-3.5 w-3.5" />
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
            className="h-6 w-6 p-0"
          >
            <Play className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Play</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="mx-0.5 h-4" />

      {/* Reset */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={reset}
            className="h-6 w-6 p-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Reset</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Controller;
