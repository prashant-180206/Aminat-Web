"use client";
import React from "react";
import { usePropertyDescriptors } from "./input/propertyDescriptor";
import { PropertyInput } from "./input/propertyCard";
import { Button } from "@/components/ui/button";
import { useScene } from "@/hooks/SceneContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PropertiesEditor = () => {
  const properties = usePropertyDescriptors();
  const { scene, setActiveMobject, setActiveMobjectId, activeMobject } =
    useScene();

  if (!activeMobject) {
    return (
      <div className="w-full max-w-4xl px-4">
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Info className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground text-center">
              Select an object from the sidebar to edit its properties
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl px-4">
      <Card>
        <CardHeader className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">Properties</CardTitle>
              <Badge variant="secondary">{activeMobject.getType()}</Badge>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={() => {
                if (scene && scene.activeMobject) {
                  scene.removeMobject(scene.activeMobject.id());
                  setActiveMobject(null);
                  setActiveMobjectId(null);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
              Remove Object
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {properties.properties.map((item, index) => (
              <PropertyInput
                key={index}
                item={item}
                refreshFunc={properties.refreshFunc}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertiesEditor;
