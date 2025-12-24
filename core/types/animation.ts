import Konva from "@/lib/konva";

/* eslint-disable @typescript-eslint/no-explicit-any */
type InputType = "number" | "string" | "boolean";

export interface AnimMeta {
  title: string;
  input: {
    [key: string]: InputType;
    duration: "number";
    easing: "string";
  };
  func: (args: { [key: string]: any }) => Konva.Tween | null;
}
