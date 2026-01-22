import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { AnimMeta } from "@/core/types/animation";

interface StagedGroupListProps {
  animGroup: AnimMeta[];
  onRemoveAnim: (animId: string) => void;
}

const StagedGroupList: React.FC<StagedGroupListProps> = ({
  animGroup,
  onRemoveAnim,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <Label className="text-xs font-medium text-muted-foreground">
            Staged Group
          </Label>
        </div>
        <Badge variant="secondary" className="text-xs">
          {animGroup.length}
        </Badge>
      </div>

      {animGroup.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed p-4 text-center">
          <p className="text-xs text-muted-foreground">No animations staged</p>
        </div>
      ) : (
        <div className="space-y-2">
          {animGroup.map((anim, index) => (
            <Card key={anim.id} className="border-muted p-3 px-0">
              <CardContent className="">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {index + 1}
                      </Badge>
                      <span className="text-xs font-medium truncate">
                        {anim.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground overflow-hidden">
                      {anim.label}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onRemoveAnim(anim.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StagedGroupList;
