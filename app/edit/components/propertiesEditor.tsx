// "use client";
import { useScene } from "@/hooks/SceneContext";
import React from "react";

const PropertiesEditor = () => {
  const { activeMobject, scene } = useScene();

  const data = activeMobject ? Object.entries(activeMobject.properties) : null;

  const renderData = [];

  data?.forEach(([key, val]) => {
    const obj = {
      property: key,
      value: val,
      type: (typeof val).toString(),
      changeFunc: () => {
        const id = activeMobject?.id() || "";
        const mobj = scene?.getMobjectById(id);
        if (mobj === undefined) return () => {};
        // scene?.getMobjectById(activeMobject?.id)?.properties({[key]: newValue});
        return (newval: typeof val) => {
          mobj.properties = { [key]: newval };
        };
      },
    };

    if (typeof val === "string") {
      if (val.endsWith("color")) {
        obj.type = "color";
      }
    }

    renderData.push(`${key} : ${val}`);
  });
  return <div>{/* <pre>{data}</pre> */}</div>;
};

export default PropertiesEditor;
