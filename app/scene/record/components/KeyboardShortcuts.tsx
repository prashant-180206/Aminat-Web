"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";

const KeyboardShortcuts = () => {
  const shortcuts = [
    {
      key: "→",
      label: "Arrow Right",
      action: "Play next animation",
      icon: <ArrowRight className="w-4 h-4" />,
    },
    {
      key: "←",
      label: "Arrow Left",
      action: "Reverse animation",
      icon: <ArrowLeft className="w-4 h-4" />,
    },
    {
      key: "R",
      label: "R Key",
      action: "Reset all animations",
      icon: <RotateCcw className="w-4 h-4" />,
    },
  ];

  return (
    <Card className="p-4 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          ⌨️ Keyboard Shortcuts
        </h3>
        <div className="grid gap-2">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded bg-background/50 hover:bg-background/80 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-fit">
                {shortcut.icon}
                <Badge variant="outline" className="font-mono text-xs">
                  {shortcut.key}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {shortcut.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default KeyboardShortcuts;
