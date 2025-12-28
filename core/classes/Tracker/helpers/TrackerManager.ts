import Konva from "@/lib/konva";
import { ValueTracker } from "../valuetracker";
import { PtTrackerMeta, TrackerMeta } from "@/core/types/tracker";
import { Slider } from "../sliders/slider";
import { TrackerManagerData } from "@/core/types/file";
import { PtValueTracker } from "../ptValuetracker";
import { PtSlider } from "../sliders/PtSlider";

export class TrackerManager {
  private trackers = new Map<string, TrackerMeta>();
  private pointTrackers = new Map<string, PtTrackerMeta>();
  private layer: Konva.Layer;

  constructor(layer: Konva.Layer) {
    this.layer = layer;
  }

  /* ------------------------------------------------------- */
  /* Registration                                            */
  /* ------------------------------------------------------- */

  addValueTracker(
    name: string,
    value: number
  ): { tracker: ValueTracker | null; success: boolean } {
    if (this.trackers.has(name) || this.pointTrackers.has(name)) {
      return {
        tracker: null,
        success: false,
      };
    }
    const tracker = new ValueTracker(value);

    this.trackers.set(name, { tracker, slider: null, id: name });
    return { tracker, success: true };
  }

  addPtValueTracker(
    name: string,
    point: {
      x: number;
      y: number;
    }
  ): { tracker: PtValueTracker | null; success: boolean } {
    if (this.pointTrackers.has(name) || this.trackers.has(name)) {
      return {
        tracker: null,
        success: false,
      };
    }

    const tracker = new PtValueTracker(point);
    const xId = name + "-X";
    const yId = name + "-Y";

    this.pointTrackers.set(name, {
      id: name,
      tracker: {
        x: {
          tracker: tracker.x,
          id: xId,
          slider: null,
        },
        y: {
          tracker: tracker.y,
          id: yId,
          slider: null,
        },
      },
      slider: null,
    });

    return {
      tracker,
      success: true,
    };
  }

  addSlider(
    sliderName: string,
    options: { min: number; max: number }
  ): { success: boolean; slider: null | Slider } {
    const meta = this.trackers.get(sliderName);
    if (!meta || meta.slider) {
      return { success: false, slider: null };
    }
    const slider = new Slider(meta.tracker, options);
    meta.slider = slider;
    return { success: true, slider };
  }

  addPtSlider(
    name: string,
    xRange: { min: number; max: number },
    yRange: { min: number; max: number }
  ): { success: boolean; slider: null | PtSlider } {
    const meta = this.pointTrackers.get(name);
    if (!meta || meta.slider) {
      return { success: false, slider: null };
    }
    const slider = new PtSlider(xRange, yRange);
    meta.slider = slider;
    return { success: true, slider };
  }

  /* ------------------------------------------------------- */
  /* Lookup                                                  */
  /* ------------------------------------------------------- */

  getAllNames(): string[] {
    return [
      ...Array.from(this.trackers.keys()),
      ...Array.from(this.pointTrackers.keys()),
    ];
  }

  getAllTrackerMetas(): TrackerMeta[] {
    return Array.from(this.trackers.values());
  }

  getAllPtTrackerMetas(): PtTrackerMeta[] {
    return Array.from(this.pointTrackers.values());
  }

  getTracker(name: string): ValueTracker | null {
    const entry = this.trackers.get(name);
    return entry ? entry.tracker : null;
  }

  getPtValueTracker(name: string) {
    const entry = this.pointTrackers.get(name);
    return entry ? entry.tracker : null;
  }

  /* ------------------------------------------------------- */
  /* Removal / cleanup                                       */
  /* ------------------------------------------------------- */

  remove(name: string) {
    const entry = this.trackers.get(name);
    if (entry) {
      entry.slider?.destroy();
      this.trackers.delete(name);
      return;
    }
    const ptEntry = this.pointTrackers.get(name);
    if (ptEntry) {
      ptEntry.slider?.destroy();
      this.pointTrackers.delete(name);
    }
  }

  clear() {
    this.trackers.forEach((entry) => {
      entry.slider?.destroy();
    });
    this.trackers.clear();

    this.pointTrackers.forEach((entry) => {
      entry.slider?.destroy();
    });
    this.pointTrackers.clear();
  }

  storeAsObj(): TrackerManagerData {
    const data: TrackerManagerData = {
      trackers: [],
      pointtrackers: [],
    };
    this.trackers.forEach((meta, id) => {
      data.trackers.push({
        id,
        value: meta.tracker.value,
        sliders: meta.slider
          ? { min: meta.slider.getMin(), max: meta.slider.getMax() }
          : null,
      });
    });

    this.pointTrackers.forEach((meta, id) => {
      data.pointtrackers.push({
        id,
        value: {
          x: meta.tracker.x.tracker.value,
          y: meta.tracker.y.tracker.value,
        },
        sliders: {
          x: meta.slider
            ? { min: meta.slider.getminX(), max: meta.slider.getmaxX() }
            : null,
          y: meta.slider
            ? { min: meta.slider.getminY(), max: meta.slider.getmaxY() }
            : null,
        },
      });
    });
    return data;
  }

  loadFromObj(obj: TrackerManagerData) {
    obj.trackers.forEach((trackerData) => {
      const { tracker, success } = this.addValueTracker(
        trackerData.id,
        trackerData.value
      );
      if (!success || !tracker) return;

      if (trackerData.sliders) {
        const { success: sliderSuccess, slider } = this.addSlider(
          trackerData.id,
          {
            min: trackerData.sliders.min,
            max: trackerData.sliders.max,
          }
        );

        if (sliderSuccess && slider) {
          this.layer.add(slider);
        }
      }
    });

    obj.pointtrackers.forEach((ptTrackerData) => {
      const { tracker, success } = this.addPtValueTracker(
        ptTrackerData.id,
        ptTrackerData.value
      );
      if (!success || !tracker) return;

      if (ptTrackerData.sliders) {
        const { success: sliderSuccess, slider } = this.addPtSlider(
          ptTrackerData.id,
          ptTrackerData.sliders.x || { min: 0, max: 0 },
          ptTrackerData.sliders.y || { min: 0, max: 0 }
        );
        if (sliderSuccess && slider) {
          this.layer.add(slider);
        }
      }
    });
  }
}
