"use client";
// import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import MobjectMap from "@/core/maps/MobjectMap";
import { useScene } from "@/hooks/SceneContext";
// import { Plus } from "lucide-react";
import React from "react";

const Objects = () => {
  const mobjects = Object.entries(MobjectMap);
  const { scene, setActiveMobject, setActiveMobjectId } = useScene();

  return (
    <div className="h-full w-full flex flex-col bg-card overflow-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-muted/30">
        <h2 className="font-semibold text-sm">Create Object</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Click to add to canvas
        </p>
      </div>

      {/* Objects Grid */}

      <div className="p-4 grid grid-cols-3 gap-3">
        {mobjects.map(([key, val]) => {
          const Icon = val.Icon;
          return (
            <Card
              key={key}
              className="group flex m-0 p-0 border-none hover:shadow-md hover:border-primary transition-all cursor-pointer overflow-hidden"
              onClick={() => {
                if (scene) {
                  const mobj = scene.addMobject(key);

                  mobj.on("click", () => {
                    scene.activeMobject = mobj;
                    setActiveMobject(mobj);
                    setActiveMobjectId(mobj.id());
                    mobj.UpdateFromKonvaProperties();
                  });
                  scene.activeMobject = mobj;
                  setActiveMobject(mobj);
                  setActiveMobjectId(mobj.id());

                  mobj.on("dragend", () => {
                    mobj.UpdateFromKonvaProperties();
                  });
                }
              }}
            >
              <CardHeader className="p-2 ">
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon
                      style={{ height: "24px", width: "24px" }}
                      className="text-primary"
                    />
                  </div>
                  <CardTitle className="text-xs font-medium text-center">
                    {val.name}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Objects;
