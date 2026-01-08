import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";

interface TargetObjectCardProps {
  activeMobjectId: string | null;
  activeMobjectType: string | undefined;
}

const TargetObjectCard: React.FC<TargetObjectCardProps> = ({
  activeMobjectId,
  activeMobjectType,
}) => {
  if (!activeMobjectId) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <p className="text-xs text-muted-foreground">
            Select an object to animate
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/50 bg-primary/5 gap-2 py-0 px-4">
      <CardHeader className="p-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Target Object
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {activeMobjectType}
          </Badge>
          <span className="text-xs text-muted-foreground truncate">
            {activeMobjectId}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TargetObjectCard;
