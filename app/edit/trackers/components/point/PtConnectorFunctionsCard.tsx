"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/combobox";
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

  const connectX = () => {
    if (
      !scene ||
      !activeMobject ||
      !selectedTracker ||
      !selectedFuncX ||
      !expressionX
    )
      return;

    const success = scene.ConnectXPtValueTrackerToMobject(
      selectedTracker,
      activeMobject.id(),
      selectedFuncX,
      expressionX
    );

    onConnectionMade(success);
  };

  const connectY = () => {
    if (
      !scene ||
      !activeMobject ||
      !selectedTracker ||
      !selectedFuncY ||
      !expressionY
    )
      return;

    const success = scene.ConnectYPtValueTrackerToMobject(
      selectedTracker,
      activeMobject.id(),
      selectedFuncY,
      expressionY
    );

    onConnectionMade(success);
  };

  return (
    <Card className="p-3 flex flex-col gap-3">
      <Label className="text-xs text-muted-foreground">
        Connect to Mobject
      </Label>

      <div className="flex flex-col gap-2">
        <div>
          <Label className="text-xs text-muted-foreground">Function X</Label>
          <Combobox
            options={connectorNames.map((f) => ({
              label: f,
              value: f,
            }))}
            value={selectedFuncX}
            onChange={setSelectedFuncX}
          />
        </div>

        <div>
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

      <div className="flex gap-2">
        <Button size="sm" className="flex-1" onClick={connectX}>
          Apply X
        </Button>
        <Button size="sm" className="flex-1" onClick={connectY}>
          Apply Y
        </Button>
      </div>
    </Card>
  );
};

export default PtConnectorFunctionsCard;
