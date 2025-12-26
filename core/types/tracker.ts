// import Konva from "@/lib/konva";
import { Slider } from "../classes/Tracker/slider";
import { ValueTracker } from "../classes/Tracker/valuetracker";

export interface TrackerMeta {
  id: string;
  tracker: ValueTracker;
  slider: Slider | null;
}
