"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";
import { AnimationCard } from "./AnimationCard";
import { AnimMeta } from "@/core/types/animation";

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
  return (
    <div
      className={`mb-1 mx-1 border rounded-md  ${
        isActive ? "border-primary bg-primary/5" : "border-border/50"
      }`}
    >
      {/* Group Header */}
      <div className="flex items-center justify-between px-2 py-1 border-b">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{groupIndex}</span>
          <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
            {animations.length}
          </Badge>
          {isActive && (
            <Badge className="text-[10px] px-1 py-0 h-4">Active</Badge>
          )}
        </div>

        {/* Reorder Controls */}
        <div className="flex gap-0.5">
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5"
            onClick={onMoveUp}
            disabled={isFirst}
          >
            <ArrowUp className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5"
            onClick={onMoveDown}
            disabled={isLast}
          >
            <ArrowDown className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Animations List */}
      <div className="py-1">
        {animations.map((anim) => (
          <AnimationCard
            key={anim.id}
            id={anim.id}
            type={anim.type}
            mobjId={anim.targetId}
            label={anim.label}
            onDelete={() => onDeleteAnimation(anim.id)}
          />
        ))}
      </div>
    </div>
  );
};
