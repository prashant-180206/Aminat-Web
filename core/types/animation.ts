import Konva from "@/lib/konva";

/* eslint-disable @typescript-eslint/no-explicit-any */
type InputType = "number" | "string";

type TargetValue = {
  [key: string]: string | number;
};

export interface AnimInfo {
  id: string;
  mobjId: string;
  type: string;
  label: string;
  tweenMeta: TargetValue;
  anim: Konva.Tween;
}

export interface AnimMeta {
  title: string;
  mobjId: string;
  type: string;
  input: {
    [key: string]: InputType;
    duration: "number";
    easing: "string";
  };
  func: (args: { [key: string]: any }) => AnimInfo | null;
}
