/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useScene } from "@/hooks/SceneContext";
// import { re } from "mathjs";

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
    | "curvefuncs"
    | "unknown";
  onChange: (newVal: any) => void;
  // refreshFunc: () => void;
};

type PropertyDescriptorData = {
  properties: PropertyDescriptor[];
  refreshFunc: () => void;
};

export const usePropertyDescriptors = (): PropertyDescriptorData => {
  const { activeMobject, scene, activeMobjectId } = useScene();
  const [refresh, setRefresh] = useState(true);

  return useMemo(() => {
    if (!activeMobject || !scene || !activeMobjectId)
      return { properties: [], refreshFunc: () => {} };

    const obj = Object.entries(activeMobject.properties).map(([key, val]) => {
      let type: PropertyDescriptor["type"] = typeof val as any;

      if (typeof val === "string" && key.endsWith("color")) {
        type = "color";
      } else if (
        typeof val === "object" &&
        val &&
        "Xfunc" in val &&
        "Yfunc" in val
      ) {
        type = "curvefuncs";
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
        refreshFunc: () => setRefresh((prev) => !prev),
      };
    });

    return { properties: obj, refreshFunc: () => setRefresh((prev) => !prev) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMobject, scene, activeMobjectId, refresh]);
};
