/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useScene } from "@/hooks/SceneContext";

export type PropertyDescriptor = {
  property: string;
  value: any;
  type:
    | "string"
    | "number"
    | "boolean"
    | "color"
    | "point"
    | "range"
    | "point_array"
    | "unknown";
  onChange: (newVal: any) => void;
};

export const usePropertyDescriptors = (): PropertyDescriptor[] => {
  const { activeMobject, scene } = useScene();

  return useMemo(() => {
    if (!activeMobject || !scene) return [];

    return Object.entries(activeMobject.properties).map(([key, val]) => {
      let type: PropertyDescriptor["type"] = typeof val as any;

      if (typeof val === "string" && key.endsWith("color")) {
        type = "color";
      } else if (typeof val === "object" && val && "x" in val && "y" in val) {
        type = "point";
      } else if (Array.isArray(val)) {
        type = "range";
        if (
          val.every(
            (p) =>
              typeof p === "object" &&
              p !== null &&
              "x" in p &&
              "y" in p &&
              typeof p.x === "number" &&
              typeof p.y === "number"
          )
        ) {
          type = "point_array";
        }
      } else if (type !== "string" && type !== "number" && type !== "boolean") {
        type = "unknown";
      }

      const id = activeMobject.id();
      const mobj = scene.getMobjectById(id);

      return {
        property: key,
        value: val,
        type,
        onChange: (newVal: any) => {
          if (!mobj) return;
          mobj.properties = { [key]: newVal };
        },
      };
    });
  }, [activeMobject, scene]);
};
