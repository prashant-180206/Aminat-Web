// import Konva from "@/lib/konva";
import { PtValueTracker } from "../classes/Tracker/ptValuetracker";
import { PtSlider } from "../classes/Tracker/sliders/PtSlider";
// import { PtValueTracker } from "../classes/Tracker/ptValuetracker";
import { Slider } from "../classes/Tracker/sliders/slider";
import { ValueTracker } from "../classes/Tracker/valuetracker";

export interface TrackerMeta {
  id: string;
  tracker: ValueTracker;
  slider: Slider | null;
}

export interface PtTrackerMeta {
  id: string;
  tracker: PtValueTracker;
  slider: PtSlider | null;
}
