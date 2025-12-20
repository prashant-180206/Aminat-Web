import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs } from "@/components/ui/tabs";
import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Settings, PlayCircle } from "lucide-react";

import React from "react";
// import Objects from "./mobjectsTab";
// import AnimationsTab from "./animationsTab";
import MoreTab from "./moreTab";

const RightSideBar = () => {
  return (
    <Collapsible className="transition-all ease-in-out duration-300">
      <Tabs
        orientation="vertical"
        defaultValue="mobjects"
        className="h-full flex flex-row bg-bg-light"
      >
        <div className="bg-bg-dark">
          <CollapsibleContent className="w-[250px]">
            {/* <TabsContent value="mobjects"> */}
            {/* Mobjects content goes here */}
            {/* <Objects /> */}
            {/* </TabsContent> */}
            <TabsContent value="animations">
              {/* <AnimationsTab /> */}
              <MoreTab />
            </TabsContent>
            <TabsContent value="settings">
              {/* Settings content goes here */}
              <h1>Settings</h1>
            </TabsContent>
          </CollapsibleContent>
        </div>
        <TabsList className="flex flex-col pl-2 py-2 gap-2">
          <CollapsibleTrigger asChild>
            <Button>☰</Button>
          </CollapsibleTrigger>
          {/* <TabsTrigger value="mobjects" asChild>
            <Button>
              <DraftingCompass size={28} strokeWidth={1.75} />
            </Button>
          </TabsTrigger> */}
          <TabsTrigger value="animations" asChild>
            <Button>
              <PlayCircle size={28} strokeWidth={1.75} />
            </Button>
          </TabsTrigger>
          <TabsTrigger value="settings" asChild>
            <Button>
              <Settings size={28} strokeWidth={1.75} />
            </Button>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </Collapsible>
  );
};

export default RightSideBar;
