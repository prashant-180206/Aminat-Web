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
import { Play, RotateCcw, Rewind, SkipForward } from "lucide-react";

const Controller = () => {
  const { scene, animRefresh } = useScene();

  const play = () => {
    scene?.animManager.animate();
    animRefresh();
  };

  const reverse = () => {
    scene?.animManager.reverseAnimate();
    animRefresh();
  };

  const reset = async () => {
    await scene?.animManager.resetAll();
    animRefresh();
  };

  const finish = () => {
    scene?.animManager.finishAll();
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

      {/* Finish */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={finish}
            className="h-6 w-6 p-0"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Finish</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Controller;
