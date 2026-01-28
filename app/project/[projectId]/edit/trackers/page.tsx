// "use client";

import React from "react";
// import { useScene } from "@/hooks/SceneContext";
import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ValueTrackersTab from "./ValueTrackersTab";
import PointValueTrackersTab from "./PointValueTrackersTab";
// import { ExpressionPopover } from "./expressionPopover";

const TrackersPage = () => {
  return (
    <div className="w-full h-full flex flex-col bg-card overflow-hidden no-scrollbar">
      {/* Header */}
      <div className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border-b bg-muted/30 flex items-center justify-between flex-shrink-0">
        <h2 className="font-semibold text-xs sm:text-sm md:text-base leading-tight">
          Trackers
        </h2>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="value" className="w-full h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 h-7 sm:h-8 md:h-9 m-2 sm:m-3 md:m-4 mb-0 flex-shrink-0">
          <TabsTrigger
            value="value"
            className="text-[10px] sm:text-xs md:text-sm"
          >
            Value
          </TabsTrigger>
          <TabsTrigger
            value="point"
            className="text-[10px] sm:text-xs md:text-sm"
          >
            Point
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="value" className="h-full mt-0 p-0">
            <div className="h-full overflow-y-auto">
              <ValueTrackersTab />
            </div>
          </TabsContent>

          <TabsContent value="point" className="h-full mt-0 p-0">
            <div className="h-full overflow-y-auto">
              <PointValueTrackersTab />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TrackersPage;
