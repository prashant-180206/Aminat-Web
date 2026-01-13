"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Info } from "lucide-react";
import { useScene } from "@/hooks/SceneContext";
import { toast } from "sonner";

const RecordingControls = () => {
  const { scene, animRefresh } = useScene();

  const handlePlay = () => {
    const res = scene?.animManager.animate();
    if (!res) {
      toast.error("All animations have been played");
    }
    animRefresh();
  };

  const handleReverse = () => {
    const res = scene?.animManager.reverseAnimate();
    if (!res) {
      toast.error("All animations have been reversed");
    }
    animRefresh();
  };

  const handleReset = () => {
    scene?.animManager.resetAll();
    animRefresh();
  };

  return (
    <Card className="p-4 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            🎬 Animation Controls
          </h3>
          <Badge variant="secondary" className="text-xs">
            Manual Control
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="w-3 h-3" />
          Step through animations or use keyboard shortcuts
        </p>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handlePlay}
            variant="default"
            size="sm"
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            Play Next
          </Button>

          <Button
            onClick={handleReverse}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Pause className="w-4 h-4" />
            Reverse
          </Button>

          <Button
            onClick={handleReset}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RecordingControls;
