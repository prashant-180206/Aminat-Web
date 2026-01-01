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

  const reset = () => {
    scene?.animManager.resetAll();
    animRefresh();
  };

  const finish = () => {
    scene?.animManager.finishAll();
    animRefresh();
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-sm">
      {/* Reverse */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={reverse}>
            <Rewind className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Play reverse</TooltipContent>
      </Tooltip>

      {/* Play (Primary) */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={play}>
            <Play className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Play animation</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Reset */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reset all animations</TooltipContent>
      </Tooltip>

      {/* Finish */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={finish}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Finish instantly</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Controller;
