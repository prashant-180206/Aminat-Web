"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Trash2 } from "lucide-react";
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
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-b-0">
        <div className="group flex items-center hover:bg-muted/50 rounded px-2 py-1">
          <AccordionTrigger className="flex-1 py-1 hover:no-underline">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium truncate max-w-[100px]">{type}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{label}s</span>
            </div>
          </AccordionTrigger>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        <AccordionContent className="px-2 pb-2 pt-0">
          <div className="text-xs space-y-1 text-muted-foreground ml-2">
            <div>
              <span className="font-medium">ID:</span> {id}
            </div>
            <div>
              <span className="font-medium">Target:</span> {mobjId}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
