// "use client";

import React from "react";
// import { useScene } from "@/hooks/SceneContext";
import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ValueTrackersTab from "./ValueTrackersTab";
import PointValueTrackersTab from "./PointValueTrackersTab";

const TrackersPage = () => {
  return (
    <div className="w-[260px] h-screen p-4 flex flex-col gap-4 text-sm overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base">Trackers</h2>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="value" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="value">Value</TabsTrigger>
          <TabsTrigger value="point">Point</TabsTrigger>
        </TabsList>

        <TabsContent value="value" className="mt-4">
          <ValueTrackersTab />
        </TabsContent>

        <TabsContent value="point" className="mt-4">
          <PointValueTrackersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrackersPage;
