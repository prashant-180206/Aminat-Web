import React from "react";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface ScenePlaceholderProps {
  title?: string;
  description?: string;
}

export default function ScenePlaceholder({
  title = "No scene for this tutorial",
  description = "This lesson focuses on text-based explanation and practice. Scene support can be added later.",
}: ScenePlaceholderProps) {
  return (
    <Card className="p-6 flex flex-col items-center justify-center text-center gap-2">
      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
        <Sparkles className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground max-w-sm">{description}</p>
    </Card>
  );
}
