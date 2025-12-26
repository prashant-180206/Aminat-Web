"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useScene } from "@/hooks/SceneContext";

const MoreTab: React.FC = () => {
  const { scene } = useScene();
  const [groups, setGroups] = useState<
    Array<Array<{ id: string; targetId: string; type: string }>>
  >([]);

  const refresh = () => {
    if (!scene) return;
    const metas = scene.animManager.getGroupsWithMeta();
    // map to serializable bits for UI
    const lite = metas.map((grp) =>
      grp.map((m) => ({ id: m.id, targetId: m.mobjId, type: m.type }))
    );
    setGroups(lite);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  return (
    <div className="p-4 flex flex-col gap-3 w-[250px] h-screen no-scrollbar overflow-y-auto">
      <div className="gap-2 w-full flex flex-col">
        <Button
          onClick={() => {
            scene?.animManager?.animate();
            // refresh();
          }}
        >
          Play Group
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            scene?.animManager?.resetAll();
          }}
        >
          Reset All
        </Button>
        <Button variant="outline" onClick={refresh}>
          Refresh
        </Button>
      </div>

      <Separator />
      <div className="flex flex-col gap-2">
        {groups.length === 0 && (
          <div className="text-sm text-zinc-500">No animation groups yet</div>
        )}
        {groups.map((grp, gi) => (
          <div key={gi} className="border border-zinc-800 rounded p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm">Group {gi + 1}</div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    scene?.animManager.moveGroup(gi, "up");
                    refresh();
                  }}
                >
                  ↑
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    scene?.animManager.moveGroup(gi, "down");
                    refresh();
                  }}
                >
                  ↓
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {grp.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span>
                    {m.type} → {m.targetId}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      scene?.animManager.removeAnimation(m.id);
                      refresh();
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoreTab;
