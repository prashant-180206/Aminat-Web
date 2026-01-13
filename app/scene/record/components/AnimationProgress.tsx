"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useScene } from "@/hooks/SceneContext";
import { BarChart3 } from "lucide-react";

const AnimationProgress = () => {
  const { scene } = useScene();
  const progress = (scene?.animManager.getProgress() as number) * 100 || 0;

  return (
    <Card className="p-4 bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold text-foreground">
            Animation Progress
          </h3>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Timeline</span>
            <span className="text-xs font-semibold text-foreground">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AnimationProgress;
