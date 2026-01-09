// import Konva from "@/lib/konva";
import { Timer } from "animejs";

/* eslint-disable @typescript-eslint/no-explicit-any */
type InputType = "number" | "string";

type TargetValue = {
  [key: string]: string | number;
};

export interface AnimMeta {
  id: string;
  targetId: string;
  type: string;
  category: "Mobject" | "Tracker" | "Slider" | "PtTracker" | "PtSlider";
  label: string;
  animFuncInput: TargetValue;
  anim: Timer;
}

export interface AnimStoreData {
  id: string;
  targetId: string;
  type: string;
  category: "Mobject" | "Tracker" | "Slider" | "PtTracker" | "PtSlider";
  label: string;
  animFuncInput: TargetValue;
}

// META FOR ANIMATION GETTERS
// CANNOT BE STORED AS ANYTHING OTHER THAN IN CODE
export interface AnimFuncMeta {
  title: string;
  targetId: string;
  type: string;
  input: {
    [key: string]: InputType;
    duration: "number";
    easing: "string";
  };
  func: (args: { [key: string]: any }) => AnimMeta | null;
}
