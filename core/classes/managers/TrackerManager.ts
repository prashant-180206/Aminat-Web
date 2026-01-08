import Konva from "@/lib/konva";
import { ValueTracker } from "@/core/classes/Tracker/valuetracker";
import { PtTrackerMeta, TrackerMeta } from "@/core/types/tracker";
import { TrackerManagerData } from "@/core/types/file";
import { PtValueTracker } from "@/core/classes/Tracker/ptValuetracker";
import { PtSlider } from "@/core/classes/Tracker/sliders/PtSlider";
import { Slider } from "@/core/classes/Tracker/sliders/slider";
import { TrackerConnectionManager } from "./trackerconnmanager";

export class TrackerManager {
  private trackers = new Map<string, TrackerMeta>();
  private pointTrackers = new Map<string, PtTrackerMeta>();

  private connManager: TrackerConnectionManager;

  get connectionManager(): TrackerConnectionManager {
    return this.connManager;
  }

  private layer: Konva.Layer;

  constructor(layer: Konva.Layer) {
    this.layer = layer;
    this.connManager = new TrackerConnectionManager(
      this.trackers,
      this.pointTrackers
    );
  }

  addValueTracker(
    name: string,
    value: number
  ): { tracker: ValueTracker | null; success: boolean } {
    if (this.trackers.has(name) || this.pointTrackers.has(name)) {
      return { tracker: null, success: false };
    }

    const tracker = new ValueTracker(value);
    this.trackers.set(name, { tracker, slider: null, id: name });
    return { tracker, success: true };
  }

  addPtValueTracker(
    name: string,
    point: { x: number; y: number }
  ): { tracker: PtValueTracker | null; success: boolean } {
    if (this.pointTrackers.has(name) || this.trackers.has(name)) {
      return { tracker: null, success: false };
    }

    const tracker = new PtValueTracker(point);
    this.pointTrackers.set(name, { id: name, tracker, slider: null });
    return { tracker, success: true };
  }

  addSlider(
    sliderName: string,
    options: { min: number; max: number; rank: number }
  ): { success: boolean; slider: null | Slider } {
    const meta = this.trackers.get(sliderName);
    if (!meta) return { success: false, slider: null };

    // Clean up existing slider if present before replacing
    meta.slider?.destroy();

    const slider = new Slider(
      meta.tracker,
      { min: options.min, max: options.max },
      options.rank,
      meta.id
    );

    meta.slider = slider;
    return { success: true, slider };
  }

  addPtSlider(
    name: string,
    xRange: { min: number; max: number },
    yRange: { min: number; max: number },
    rank: number = 0
  ): { success: boolean; slider: null | PtSlider } {
    const meta = this.pointTrackers.get(name);
    if (!meta) return { success: false, slider: null };

    meta.slider?.destroy();

    const slider = new PtSlider(
      meta.tracker,
      {
        minX: xRange.min,
        maxX: xRange.max,
        minY: yRange.min,
        maxY: yRange.max,
      },
      rank,
      meta.id
    );

    meta.slider = slider;
    return { success: true, slider };
  }

  getAllNames(): string[] {
    return [...this.trackers.keys(), ...this.pointTrackers.keys()];
  }

  getAllTrackerMetas(): TrackerMeta[] {
    return Array.from(this.trackers.values());
  }

  getAllPtTrackerMetas(): PtTrackerMeta[] {
    return Array.from(this.pointTrackers.values());
  }

  getTracker(name: string): TrackerMeta | null {
    return this.trackers.get(name) ?? null;
  }

  getPtValueTracker(name: string): PtTrackerMeta | null {
    return this.pointTrackers.get(name) ?? null;
  }

  remove(name: string) {
    this.connManager.remove(name);
    const entry = this.trackers.get(name);
    if (entry) {
      entry.slider?.destroy();
      this.trackers.delete(name);
      this.connManager.dependencies.delete(name);
      return;
    }

    const ptEntry = this.pointTrackers.get(name);
    if (ptEntry) {
      ptEntry.slider?.destroy();
      this.pointTrackers.delete(name);
      this.connManager.dependencies.delete(`${name}.x`);
      this.connManager.dependencies.delete(`${name}.y`);
    }
  }

  clear() {
    // Clean up all expression links first

    this.connManager.clear();
    // Standard cleanup for sliders and maps
    [...this.trackers.values(), ...this.pointTrackers.values()].forEach((m) =>
      m.slider?.destroy()
    );
    this.trackers.clear();
    this.pointTrackers.clear();
  }

  /* ------------------------------------------------------- */
  /* Persistence                                             */
  /* ------------------------------------------------------- */

  storeAsObj(): TrackerManagerData {
    const data: TrackerManagerData = {
      trackers: [],
      pointtrackers: [],
      connections: [],
    };

    this.trackers.forEach((meta, id) => {
      data.trackers.push({
        id,
        value: meta.tracker.value,
        sliders: meta.slider ? meta.slider.storeAsObj() : null,
      });
    });

    this.pointTrackers.forEach((meta, id) => {
      data.pointtrackers.push({
        id,
        value: { x: meta.tracker.x.value, y: meta.tracker.y.value },
        sliders: meta.slider ? meta.slider.storeAsObj() : null,
      });
    });

    data.connections = this.connManager.storeAsObj();

    return data;
  }

  loadFromObj(obj: TrackerManagerData) {
    // Load scalar trackers
    obj.trackers.forEach((t) => {
      const { tracker, success } = this.addValueTracker(t.id, t.value);
      if (success && tracker && t.sliders) {
        const { success: sSuccess, slider } = this.addSlider(t.id, t.sliders);
        if (sSuccess && slider) this.layer.add(slider);
      }
    });

    // Load point trackers
    obj.pointtrackers.forEach((pt) => {
      const { tracker, success } = this.addPtValueTracker(pt.id, pt.value);
      if (success && tracker && pt.sliders) {
        const { success: sSuccess, slider } = this.addPtSlider(
          pt.id,
          {
            min: pt.sliders.minX,
            max: pt.sliders.maxX,
          },
          {
            min: pt.sliders.minY,
            max: pt.sliders.maxY,
          },
          pt.sliders.rank
        );
        if (sSuccess && slider) this.layer.add(slider);
      }
    });

    // Load connections
    this.connManager.loadFromObj(obj.connections);
  }
}
