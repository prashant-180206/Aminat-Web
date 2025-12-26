// core/animation/TrackerManager.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */
import Konva from "@/lib/konva";
import { ValueTracker } from "./valuetracker";
// import { Slider } from "./slider";
import { TrackerMeta } from "@/core/types/tracker";
import { Slider } from "./slider";

export class TrackerManager {
  private trackers = new Map<string, TrackerMeta>();
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
    if (this.trackers.has(name)) {
      return {
        tracker: null,
        success: false,
      };
    }
    const tracker = new ValueTracker(value);

    this.trackers.set(name, { tracker, slider: null, id: name });
    return { tracker, success: true };
  }

  addSlider(sliderName: string, options: { min: number; max: number }) {
    const meta = this.trackers.get(sliderName);
    if (!meta || meta.slider) {
      return { success: false, slider: null };
    }
    const slider = new Slider(meta.tracker, options);
    meta.slider = slider;
    return { success: true, slider };
  }

  /* ------------------------------------------------------- */
  /* Lookup                                                  */
  /* ------------------------------------------------------- */

  getTrackerMeta(name: string): TrackerMeta | null {
    return this.trackers.get(name) ?? null;
  }
  getTracker(name: string): ValueTracker | null {
    const meta = this.trackers.get(name);
    return meta ? meta.tracker : null;
  }

  getAllNames(): string[] {
    return Array.from(this.trackers.keys());
  }

  getAllTrackerMetas(): TrackerMeta[] {
    return Array.from(this.trackers.values());
  }

  /* ------------------------------------------------------- */
  /* Removal / cleanup                                       */
  /* ------------------------------------------------------- */

  remove(name: string) {
    const entry = this.trackers.get(name);
    if (!entry) return;

    entry.slider?.destroy();
    this.trackers.delete(name);
  }

  clear() {
    this.trackers.forEach((entry) => {
      entry.slider?.destroy();
    });
    this.trackers.clear();
  }
}
