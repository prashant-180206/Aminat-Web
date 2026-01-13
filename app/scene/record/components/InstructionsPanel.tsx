"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Lightbulb } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const InstructionsPanel = () => {
  return (
    <div className="space-y-2">
      <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
          Preview and test your animations before recording. Use the controls to
          step through each animation frame by frame.
        </AlertDescription>
      </Alert>

      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors p-2 rounded hover:bg-accent">
          <Lightbulb className="w-4 h-4" />
          How to Use This Page
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <Card className="p-4 bg-accent/30">
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                  1
                </span>
                <div>
                  <strong className="text-foreground">View Your Scene</strong>
                  <p className="text-xs mt-1">
                    The animation preview is displayed above at 60% scale
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                  2
                </span>
                <div>
                  <strong className="text-foreground">
                    Control Animations
                  </strong>
                  <p className="text-xs mt-1">
                    Use the animation controls or keyboard shortcuts to step
                    through animations
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                  3
                </span>
                <div>
                  <strong className="text-foreground">Track Progress</strong>
                  <p className="text-xs mt-1">
                    Monitor the animation timeline to see your current position
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                  4
                </span>
                <div>
                  <strong className="text-foreground">Record Video</strong>
                  <p className="text-xs mt-1">
                    When ready, record the scene to generate a video file
                  </p>
                </div>
              </li>
            </ol>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default InstructionsPanel;
