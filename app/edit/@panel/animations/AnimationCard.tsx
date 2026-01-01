"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2, Clock, Target, Layers } from "lucide-react";
import { useScene } from "@/hooks/SceneContext";

interface AnimationCardProps {
  id: string;
  type: string;
  mobjId: string;

  label: string;
  onDelete: () => void;
}

export const AnimationCard = ({
  id,
  type,
  mobjId,
  label,
  onDelete,
}: AnimationCardProps) => {
  const { animToggle } = useScene();
  void animToggle;
  return (
    <Card className="group hover:shadow-md transition-all duration-200 p-0 hover:border-primary/50">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            {/* Animation ID */}
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold truncate">{id}</h4>
            </div>

            {/* <Button onClick={}>play</Button> */}

            {/* Animation Details */}
            <div className="space-y-1.5">
              <TooltipProvider>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-3 w-3" />
                        <span className="truncate max-w-[120px]">{type}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Animation Type</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5">
                        <Target className="h-3 w-3" />
                        <span className="truncate max-w-[120px]">{mobjId}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Target Object</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Clock className="h-3 w-3" />
                        {label}s
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Duration</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>

          {/* Delete Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete animation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};
