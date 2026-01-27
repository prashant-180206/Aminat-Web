"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/combobox";
import { toast } from "sonner";
import { useScene } from "@/hooks/SceneContext";

interface ConnectorFunctionsCardProps {
  connectorNames: string[];
  selectedTracker: string | null;
  // onConnectionMade: (success: boolean, id: string | null) => void;
}

const ConnectorFunctionsCard = ({
  connectorNames,
  selectedTracker,
}: // onConnectionMade,
ConnectorFunctionsCardProps) => {
  const { valRefresh, valToggle } = useScene();
  void valToggle;
  const [selectedFunc, setSelectedFunc] = React.useState<string | null>(
    connectorNames[0] ?? null,
  );
  const [expression, setExpression] = React.useState("t");

  const { scene, activeMobject } = useScene();

  const connectFuncs = () => {
    if (!activeMobject || !selectedFunc || !expression || !scene) return;

    const { success } = scene.connManager.ConnectValueTrackerToMobject(
      selectedTracker || "",
      activeMobject.id(),
      selectedFunc,
      expression,
    );

    if (success) {
      toast.success("Function connected to tracker");
      valRefresh();
    } else {
      toast.error("Failed to connect function to tracker");
    }
  };

  return (
    <Card className="p-3 flex flex-col gap-2">
      <Label className="text-xs text-muted-foreground">
        Connect to Mobject
      </Label>
      <Combobox
        options={connectorNames.map((f) => ({
          label: f,
          value: f,
        }))}
        value={selectedFunc}
        onChange={setSelectedFunc}
      />
      <Input
        placeholder="Write an Exp in terms of t "
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
      />
      <Button size="sm" onClick={connectFuncs}>
        Apply to Connector
      </Button>
    </Card>
  );
};

export default ConnectorFunctionsCard;
