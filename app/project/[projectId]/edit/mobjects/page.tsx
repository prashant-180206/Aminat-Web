"use client";
// import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import MobjectMap from "@/core/maps/MobjectMap";
import { useScene } from "@/hooks/SceneContext";
// import { Plus } from "lucide-react";
import React from "react";

const Objects = () => {
  const mobjects = Object.entries(MobjectMap);
  const { scene } = useScene();

  return (
    <div className="h-full w-full flex flex-col bg-card overflow-auto no-scrollbar">
      {/* Header - Responsive padding */}
      <div className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border-b bg-muted/30 shrink-0">
        <h2 className="font-semibold text-xs sm:text-sm md:text-base leading-tight">
          Create Object
        </h2>
        <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5 leading-tight">
          Click to add to canvas
        </p>
      </div>

      {/* Objects Grid - Responsive columns for sidebar width */}
      <div className="p-1.5 sm:p-2 md:p-4 grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 overflow-y-auto">
        {mobjects.map(([key, val]) => {
          const Icon = val.Icon;
          return (
            <Card
              key={key}
              className="group flex m-0 p-0 border-none hover:shadow-md hover:border-primary transition-all cursor-pointer overflow-hidden active:scale-95"
              onClick={() => {
                if (scene) {
                  scene.addMobject(key);
                }
              }}
            >
              <CardHeader className="p-1 sm:p-1.5 md:p-2 w-full">
                <div className="flex flex-col items-center gap-0.5 sm:gap-1 md:gap-2">
                  <div className="p-1 sm:p-1.5 md:p-3 rounded-md lg:rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-[8px] sm:text-[10px] md:text-xs font-medium text-center line-clamp-2 leading-tight">
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
