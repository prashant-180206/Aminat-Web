"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScene } from "@/hooks/SceneContext";
import { AnimMeta, AnimFuncMeta } from "@/core/types/animation";
import { toast } from "sonner";
import { easingMap } from "@/core/maps/easingMap";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import TargetObjectCard from "./TargetObjectCard";
import AnimationSelector from "./AnimationSelector";
import AnimationParameters from "./AnimationParameters";
import StagedGroupList from "./StagedGroupList";

const AnimationsTab: React.FC = () => {
  const { scene, activeMobjectId, activeMobject, animRefresh } = useScene();

  const animNames = activeMobject?.animgetter.getAnimNames() || [];

  const [selectedAnim, setSelectedAnim] = useState<string | null>(null);
  const [animMeta, setAnimMeta] = useState<AnimFuncMeta | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [inputObject, setInputObject] = useState<Record<string, any>>({
    duration: 1,
    easing: Object.keys(easingMap)[3],
  });
  const [animGroup, setAnimGroup] = useState<AnimMeta[]>([]);

  const selectAnim = (name: string) => {
    setSelectedAnim(name);
    const meta = activeMobject?.animgetter.getAnimMeta(name) || null;
    setAnimMeta(meta);

    setInputObject({
      duration: 1,
      easing: Object.keys(easingMap)[3],
    });
  };

  useEffect(() => {
    if (!animNames.length) return;
    selectAnim(animNames[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMobjectId]);

  const addAnim = () => {
    if (!animMeta) return;
    const res = animMeta.func(inputObject);
    if (!res) {
      toast.error("Failed to create animation. Check parameters.");
      return;
    }

    setAnimGroup((prev) => [...prev, res]);
    toast.success("Animation staged");
  };

  const addAnimGroup = () => {
    if (!scene || animGroup.length === 0) return;
    scene.animManager.addAnimations(...animGroup);
    setAnimGroup([]);
    toast.success("Animation group added to timeline");
    scene.animManager.animate();
    animRefresh();
  };

  return (
    <div className="h-full overflow-auto no-scrollbar w-full flex flex-col bg-card">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-muted/30">
        <h2 className="font-semibold text-sm">Add Animation</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure and stage animations
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 flex flex-col gap-4">
          {/* Target Object */}
          <TargetObjectCard
            activeMobjectId={activeMobjectId}
            activeMobjectType={activeMobject?.getType()}
          />

          {/* Animation Selection, Parameters, and Group Management */}
          {activeMobjectId && (
            <>
              <AnimationSelector
                animNames={animNames}
                selectedAnim={selectedAnim}
                onSelectAnim={selectAnim}
              />

              <Separator />

              {/* Parameters */}
              <AnimationParameters
                animMeta={animMeta}
                inputObject={inputObject}
                onInputChange={(key, value) =>
                  setInputObject((prev) => ({
                    ...prev,
                    [key]: value,
                  }))
                }
              />

              <Button size="sm" onClick={addAnim} className="gap-2">
                <Plus className="h-4 w-4" />
                Stage Animation
              </Button>

              <Separator />

              {/* Staged Group */}
              <StagedGroupList
                animGroup={animGroup}
                onRemoveAnim={(animId) => {
                  const anim = animGroup.find((a) => a.id === animId);
                  if (anim) {
                    anim.anim.seek(anim.anim.duration); // fast-forward to end
                    anim.anim.revert(); // detach callbacks
                  }
                  setAnimGroup((prev) => prev.filter((a) => a.id !== animId));
                }}
              />

              <Button
                onClick={addAnimGroup}
                disabled={animGroup.length === 0}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Group to Timeline
              </Button>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AnimationsTab;
