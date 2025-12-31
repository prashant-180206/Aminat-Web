"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScene } from "@/hooks/SceneContext";
import { AnimInfo, AnimMeta } from "@/core/types/animation";
import { toast } from "sonner";
import { Combobox } from "@/components/combobox";
import { easingMap } from "@/core/maps/easingMap";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Layers, Target } from "lucide-react";

const AnimationsTab: React.FC = () => {
  const { scene, activeMobjectId, activeMobject } = useScene();

  const animNames = activeMobject?.animgetter.getAnimNames() || [];

  const [selectedAnim, setSelectedAnim] = useState<string | null>(null);
  const [animMeta, setAnimMeta] = useState<AnimMeta | null>(null);

  const [inputData, setInputData] = useState<
    Record<string, "string" | "number">
  >({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [inputObject, setInputObject] = useState<Record<string, any>>({
    duration: 1,
    easing: Object.keys(easingMap)[3],
  });
  const [animGroup, setAnimGroup] = useState<AnimInfo[]>([]);

  const selectAnim = (name: string) => {
    setSelectedAnim(name);
    const meta = activeMobject?.animgetter.getAnimMeta(name) || null;
    setAnimMeta(meta);
    if (!meta) return;

    setInputData(meta.input);
    setInputObject({
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
    if (!res) return;

    setAnimGroup((prev) => [...prev, res]);
    toast.success("Animation staged");
  };

  const addAnimGroup = () => {
    if (!scene || animGroup.length === 0) return;
    scene.animManager.addAnimations(...animGroup);
    setAnimGroup([]);
    toast.success("Animation group added to timeline");
  };

  return (
    <div className="h-full w-full flex flex-col bg-card">
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
          {activeMobjectId ? (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader className="p-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Target Object
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {activeMobject?.getType()}
                  </Badge>
                  <span className="text-xs text-muted-foreground truncate">
                    {activeMobjectId}
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Select an object to animate
                </p>
              </CardContent>
            </Card>
          )}

          {/* Animation Selection */}
          {activeMobjectId && (
            <>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Animation Type</Label>
                <Combobox
                  options={animNames.map((name) => ({
                    label: name,
                    value: name,
                  }))}
                  value={selectedAnim}
                  onChange={selectAnim}
                  placeholder="Select animation"
                />
              </div>

              <Separator />

              {/* Parameters */}
              {animMeta && (
                <div className="flex flex-col gap-3">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Parameters
                  </Label>

                  {Object.entries(inputData).map(([key, type]) => {
                    if (key === "easing") {
                      return (
                        <div key={key} className="flex flex-col gap-1.5">
                          <Label className="text-xs">{key}</Label>
                          <Combobox
                            options={Object.keys(easingMap).map((val) => ({
                              label: val,
                              value: val,
                            }))}
                            value={inputObject[key]}
                            onChange={(val) =>
                              setInputObject((prev) => ({
                                ...prev,
                                [key]: val,
                              }))
                            }
                          />
                        </div>
                      );
                    }

                    return (
                      <div key={key} className="flex flex-col gap-1.5">
                        <Label className="text-xs">{key}</Label>
                        <Input
                          type={type === "number" ? "number" : "text"}
                          defaultValue={inputObject[key] ?? "0"}
                          onChange={(e) =>
                            setInputObject((prev) => ({
                              ...prev,
                              [key]:
                                type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value,
                            }))
                          }
                          className="h-9"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              <Button size="sm" onClick={addAnim} className="gap-2">
                <Plus className="h-4 w-4" />
                Stage Animation
              </Button>

              <Separator />

              {/* Staged Group */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-xs font-medium text-muted-foreground">
                      Staged Group
                    </Label>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {animGroup.length}
                  </Badge>
                </div>

                {animGroup.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed p-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      No animations staged
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {animGroup.map((anim, index) => (
                      <Card key={anim.id} className="border-muted">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {index + 1}
                                </Badge>
                                <span className="text-xs font-medium truncate">
                                  {anim.label}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {anim.type}
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                anim.anim.destroy();
                                setAnimGroup((prev) =>
                                  prev.filter((a) => a.id !== anim.id)
                                );
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

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
