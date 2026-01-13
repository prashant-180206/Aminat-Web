"use client";

import { Button } from "@/components/ui/button";
import { Collapsible } from "@/components/ui/collapsible";
import dynamic from "next/dynamic";

const CollapsibleTrigger = dynamic(
  () =>
    import("@/components/ui/collapsible").then((mod) => mod.CollapsibleTrigger),
  {
    ssr: false,
  }
);
const CollapsibleContent = dynamic(
  () =>
    import("@/components/ui/collapsible").then((mod) => mod.CollapsibleContent),
  {
    ssr: false,
  }
);
import { Separator } from "@/components/ui/separator";
import { Menu, Layers } from "lucide-react";
import React from "react";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ValueTrackersPanelTab from "./value";
import PtValueTrackersPanelTab from "./point";
import { ExpressionPopover } from "./components/expressionPopover";

const TrackerSidePanel = () => {
  // const { scene, valRefresh } = useScene();

  // const mobjects = scene?.getMobjectsData() || [];

  return (
    <Collapsible
      defaultOpen
      className="relative flex flex-row bg-card border-r overflow-auto h-screen no-scrollbar"
    >
      {/* Collapsed Toggle */}
      <CollapsibleTrigger asChild className="absolute top-2 right-2 z-10">
        <Button size="icon" variant="ghost" className="rounded-full shadow-sm">
          <Menu className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>

      {/* Sidebar Content */}
      <CollapsibleContent className="w-[280px] h-full">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <h1 className="font-semibold tracking-wide">Value Trackers</h1>
            </div>
          </div>
          <div className="p-4 pb-4">
            <ExpressionPopover />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="value" className="w-full pt-0 p-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="value">Value</TabsTrigger>
              <TabsTrigger value="point">Point</TabsTrigger>
            </TabsList>

            <TabsContent value="value" className="mt-4">
              <ValueTrackersPanelTab />
            </TabsContent>

            <TabsContent value="point" className="mt-4">
              <PtValueTrackersPanelTab />
            </TabsContent>
          </Tabs>

          <Separator />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TrackerSidePanel;
