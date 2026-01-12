"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUp, ArrowDown, Grip } from "lucide-react";
import { AnimationCard } from "./AnimationCard";
import { AnimMeta } from "@/core/types/animation";
// import { useScene } from "@/hooks/SceneContext";
// import { useScene } from "@/hooks/SceneContext";

interface AnimationGroupCardProps {
  groupIndex: number;
  animations: AnimMeta[];
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDeleteAnimation: (animId: string) => void;
}

export const AnimationGroupCard = ({
  groupIndex,
  animations,
  isActive,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDeleteAnimation,
}: AnimationGroupCardProps) => {
  // const { scene } = useScene();
  return (
    <Card
      className={`mb-4 mx-2 overflow-hidden transition-all duration-300 gap-0 p-0 shadow-2xl ${
        isActive
          ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20"
          : "border-border/50 hover:border-border"
      }`}
    >
      {/* Group Header */}
      <CardHeader className="p-3 bg-linear-to-r from-muted/50 to-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-background/80 shadow-sm">
              <Grip className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Group {groupIndex}
              </h3>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-5 bg-background/60"
              >
                {animations.length} {animations.length === 1 ? "item" : "items"}
              </Badge>
              {isActive && (
                <Badge className="text-[10px] px-1.5 py-0 h-5 bg-primary shadow-sm">
                  Active
                </Badge>
              )}
            </div>
          </div>

          {/* Reorder Controls */}
          <TooltipProvider>
            <div className="flex gap-0.5 bg-background/60 rounded-md p-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-background"
                    onClick={onMoveUp}
                    disabled={isFirst}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Move group up</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-background"
                    onClick={onMoveDown}
                    disabled={isLast}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Move group down</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </CardHeader>

      {/* Animations List */}
      <CardContent className="p-2 space-y-2 bg-background">
        {animations.map((anim) => (
          <div key={anim.id}>
            <AnimationCard
              id={anim.id}
              type={anim.type}
              mobjId={anim.targetId}
              label={anim.label}
              onDelete={() => onDeleteAnimation(anim.id)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
