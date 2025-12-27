"use client";
import { Button } from "@/components/ui/button";
import MobjectMap from "@/core/maps/MobjectMap";
import { useScene } from "@/hooks/SceneContext";
// import { Text } from "lucide-react";
import React from "react";

const Objects = () => {
  const mobjects = Object.entries(MobjectMap);
  const { scene, setActiveMobject, setActiveMobjectId } = useScene();
  return (
    <div className="h-full w-full flex flex-wrap gap-2 p-4 items-center justify-center ">
      {mobjects.map(([key, val]) => {
        const Icon = val.Icon;
        return (
          <div
            key={key}
            className="w-[30%] justify-evenly flex flex-col items-center"
          >
            <Button
              variant={"outline"}
              onClick={() => {
                if (scene) {
                  const mobj = scene.addMobject(key);

                  mobj.on("click", () => {
                    scene.activeMobject = mobj;
                    setActiveMobject(mobj);
                    setActiveMobjectId(mobj.id());
                    mobj.UpdateFromKonvaProperties();
                    console.log("Mobject clicked:", mobj.id());
                  });
                }
              }}
              className=" p-6"
            >
              <Icon
                style={{ height: "30px", width: "30px" }}
                // className=""
              />
            </Button>
            <p>{val.name}</p>
          </div>
        );
      })}
      <Button
        onClick={() => {
          console.log(scene?.storeAsObj());
        }}
      >
        See Info
      </Button>
    </div>
  );
};

export default Objects;
