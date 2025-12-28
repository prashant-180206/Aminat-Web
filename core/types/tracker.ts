// import Konva from "@/lib/konva";
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
  tracker: {
    x: TrackerMeta;
    y: TrackerMeta;
  };
  slider: PtSlider | null;
}
