import { useScene } from "@/hooks/SceneContext";
import { Progress } from "@radix-ui/react-progress";
import React from "react";

const TimeLine = () => {
  const { scene, animToggle } = useScene();
  void animToggle;
  return (
    <div className="my-2">
      <Progress
        className="h-10 bg-red-200 z-9999"
        value={(scene?.animManager.getProgress() as number) * 100 || 0}
      />
    </div>
  );
};

export default TimeLine;
