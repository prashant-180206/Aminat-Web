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
    | "unknown";
  onChange: (newVal: any) => void;
  // refreshFunc: () => void;
};

type PropertyDescriptorData = {
  properties: PropertyDescriptor[];
  refreshFunc: () => void;
};

export const usePropertyDescriptors = (): PropertyDescriptorData => {
  const PROPERTY_ORDER: Record<string, number> = {
    // transform
    position: 10,
    rotation: 20,
    scale: 30,
    zindex: 40,

    // size / geometry
    dimensions: 50,
    radius: 60,
    lineEnds: 70,
    points: 80,

    // curve / plane specific
    parameterRange: 90,
    ranges: 100,
    funcs: 110,

    // appearance
    color: 200,
    bordercolor: 210,
    opacity: 220,
    thickness: 230,
    cornerRadius: 240,

    // text
    textData: 300,

    // plane-specific
    gridthickness: 400,
    axissthickness: 410,
    axiscolor: 420,
    showgrid: 430,
    showlabels: 440,
    labelsize: 450,
    labelcolor: 460,
    LatexContent: 470,
  };

  const { activeMobject, scene, activeMobjectId, mobjToggle } = useScene();
  void mobjToggle;
  const [refresh, setRefresh] = useState(true);

  const getPropertyOrder = (key: string) => PROPERTY_ORDER[key] ?? 1000;

  return useMemo(() => {
    if (!activeMobject || !scene || !activeMobjectId)
      return { properties: [], refreshFunc: () => {} };

    const obj = Object.entries(activeMobject.properties)
      .sort(([a], [b]) => getPropertyOrder(a) - getPropertyOrder(b))
      .map(([key, val]) => {
        let type: PropertyDescriptor["type"] = typeof val as any;

        if (typeof val === "string" && key.endsWith("color")) {
          type = "color";
        } else if (typeof val === "object" && val && "x" in val && "y" in val) {
          type = "point";
        } else if (
          type !== "string" &&
          type !== "number" &&
          type !== "boolean"
        ) {
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
