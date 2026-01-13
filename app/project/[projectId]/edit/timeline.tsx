import { Progress } from "@/components/ui/progress";
import { useScene } from "@/hooks/SceneContext";
// import { Progress } from "@radix-ui/react-progress";
import React from "react";

const TimeLine = () => {
  const { scene, animToggle } = useScene();
  void animToggle;
  return (
    <div className="my-1 flex h-4 w-full px-4">
      <Progress
        className="flex-1 "
        value={(scene?.animManager?.getProgress() ?? 0) * 100}
      />
    </div>
  );
};

export default TimeLine;
