"use client";

import React from "react";
import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Monitor } from "lucide-react";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "@/core/config";

interface ViewportInfoProps {
  scaleFactor?: number;
}

const ViewportInfo = ({ scaleFactor = 0.6 }: ViewportInfoProps) => {
  const displayWidth = Math.round(DEFAULT_WIDTH * scaleFactor);
  const displayHeight = Math.round(DEFAULT_HEIGHT * scaleFactor);
  const defaultWidth = DEFAULT_WIDTH;
  const defaultHeight = DEFAULT_HEIGHT;

  return (
    <Card className="p-3 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xs font-semibold text-foreground">
            Viewport Settings
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-background/40 rounded p-2">
            <p className="text-muted-foreground font-medium">Scale Factor</p>
            <p className="text-foreground font-semibold">
              {(scaleFactor * 100).toFixed(0)}%
            </p>
          </div>
          <div className="bg-background/40 rounded p-2">
            <p className="text-muted-foreground font-medium">Display Size</p>
            <p className="text-foreground font-semibold">
              {displayWidth}×{displayHeight}px
            </p>
          </div>
          <div className="bg-background/40 rounded p-2 col-span-2">
            <p className="text-muted-foreground font-medium">
              Default Resolution
            </p>
            <p className="text-foreground font-semibold">
              {defaultWidth}×{defaultHeight}px
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ViewportInfo;
