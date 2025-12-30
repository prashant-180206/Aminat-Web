"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/combobox";
import { toast } from "sonner";
import { useScene } from "@/hooks/SceneContext";

interface PtConnectorFunctionsCardProps {
  connectorNames: string[];
  selectedTracker: string | null;
  onConnectionMade: (success: boolean) => void;
}

const PtConnectorFunctionsCard = ({
  connectorNames,
  selectedTracker,
  onConnectionMade,
}: PtConnectorFunctionsCardProps) => {
  const [selectedFuncX, setSelectedFuncX] = React.useState<string | null>(
    connectorNames[0] ?? null
  );
  const [selectedFuncY, setSelectedFuncY] = React.useState<string | null>(
    connectorNames[0] ?? null
  );
  const [expressionX, setExpressionX] = React.useState("t");
  const [expressionY, setExpressionY] = React.useState("t");

  const { scene, activeMobject } = useScene();

  const connectFuncs = () => {
    if (
      !activeMobject ||
      !selectedFuncX ||
      !selectedFuncY ||
      !expressionX ||
      !expressionY ||
      !scene
    )
      return;

    const success = scene.ConnectPtValueTrackerToMobject(
      selectedTracker || "",
      activeMobject.id(),
      selectedFuncX,
      selectedFuncY,
      expressionX,
      expressionY
    );

    onConnectionMade(success);

    if (success) {
      toast.success("Point tracker function connected");
    } else {
      toast.error("Failed to connect point tracker function");
    }
  };

  return (
    <Card className="p-3 flex flex-col gap-2">
      <Label className="text-xs text-muted-foreground">
        Connect to Mobject
      </Label>
      <div className="flex flex-col gap-2">
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">Function X</Label>
          <Combobox
            options={connectorNames.map((f) => ({
              label: f,
              value: f,
            }))}
            value={selectedFuncX}
            onChange={setSelectedFuncX}
            className=""
          />
        </div>
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">Function Y</Label>
          <Combobox
            options={connectorNames.map((f) => ({
              label: f,
              value: f,
            }))}
            value={selectedFuncY}
            onChange={setSelectedFuncY}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">Expression X</Label>
          <Input
            placeholder="Exp in terms of t"
            value={expressionX}
            onChange={(e) => setExpressionX(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">Expression Y</Label>
          <Input
            placeholder="Exp in terms of t"
            value={expressionY}
            onChange={(e) => setExpressionY(e.target.value)}
          />
        </div>
      </div>
      <Button size="sm" onClick={connectFuncs}>
        Apply to Connector
      </Button>
    </Card>
  );
};

export default PtConnectorFunctionsCard;
