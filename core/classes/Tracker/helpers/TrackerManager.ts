import Konva from "@/lib/konva";
import { ValueTracker } from "../valuetracker";
import { PtTrackerMeta, TrackerMeta } from "@/core/types/tracker";
import { TrackerManagerData } from "@/core/types/file";
import { PtValueTracker } from "../ptValuetracker";
import { PtSlider } from "../sliders/PtSlider";
import { Slider } from "../sliders/slider";
import { TrackerExpressionConnectorFactory } from "../../factories/tracker/connector";

export class TrackerManager {
  private trackers = new Map<string, TrackerMeta>();
  private pointTrackers = new Map<string, PtTrackerMeta>();

  /** * Dependency graph: maps a target tracker name to the set of tracker names it depends on.
   * targetName -> Set(dependencyNames)
   */
  private dependencies = new Map<string, Set<string>>();
  private layer: Konva.Layer;

  constructor(layer: Konva.Layer) {
    this.layer = layer;
  }

  /* ------------------------------------------------------- */
  /* Registration                                            */
  /* ------------------------------------------------------- */

  /** Adds a scalar value tracker. Returns success false if name is taken. */
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

  /** Adds a 2D point value tracker. */
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

  /** Links a Konva Slider to an existing scalar tracker. */
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

  /** Links a 2D PtSlider to an existing point tracker. */
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

  /* ------------------------------------------------------- */
  /* Lookup                                                  */
  /* ------------------------------------------------------- */

  getAllNames(): string[] {
    return [...this.trackers.keys(), ...this.pointTrackers.keys()];
  }

  getAllTrackerMetas(): TrackerMeta[] {
    return Array.from(this.trackers.values());
  }

  getAllPtTrackerMetas(): PtTrackerMeta[] {
    return Array.from(this.pointTrackers.values());
  }

  getTracker(name: string): ValueTracker | null {
    return this.trackers.get(name)?.tracker ?? null;
  }

  getPtValueTracker(name: string): PtValueTracker | null {
    return this.pointTrackers.get(name)?.tracker ?? null;
  }

  /* ------------------------------------------------------- */
  /* Removal / Cleanup                                       */
  /* ------------------------------------------------------- */

  remove(name: string) {
    // Handle scalar tracker removal
    const entry = this.trackers.get(name);
    if (entry) {
      entry.slider?.destroy();
      this.trackers.delete(name);
      this.dependencies.delete(name); // Cleanup dependency tracking
      return;
    }

    // Handle point tracker removal
    const ptEntry = this.pointTrackers.get(name);
    if (ptEntry) {
      ptEntry.slider?.destroy();
      this.pointTrackers.delete(name);
    }
  }

  clear() {
    [...this.trackers.values(), ...this.pointTrackers.values()].forEach(
      (meta) => {
        meta.slider?.destroy();
      }
    );
    this.trackers.clear();
    this.pointTrackers.clear();
    this.dependencies.clear();
  }

  /* ------------------------------------------------------- */
  /* Persistence                                             */
  /* ------------------------------------------------------- */

  storeAsObj(): TrackerManagerData {
    const data: TrackerManagerData = { trackers: [], pointtrackers: [] };

    this.trackers.forEach((meta, id) => {
      data.trackers.push({
        id,
        value: meta.tracker.value,
        sliders: meta.slider
          ? {
              min: meta.slider.getMin(),
              max: meta.slider.getMax(),
              rank: meta.slider.rank,
            }
          : null,
      });
    });

    this.pointTrackers.forEach((meta, id) => {
      data.pointtrackers.push({
        id,
        value: { x: meta.tracker.x.value, y: meta.tracker.y.value },
        sliders: {
          x: meta.slider
            ? { min: meta.slider.getMinX(), max: meta.slider.getMaxX() }
            : null,
          y: meta.slider
            ? { min: meta.slider.getMinY(), max: meta.slider.getMaxY() }
            : null,
        },
      });
    });

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
          pt.sliders.x ?? { min: 0, max: 0 },
          pt.sliders.y ?? { min: 0, max: 0 }
        );
        if (sSuccess && slider) this.layer.add(slider);
      }
    });
  }

  /* ------------------------------------------------------- */
  /* Expression Linking                                      */
  /* ------------------------------------------------------- */

  /**
   * Connects trackers via a string expression.
   * Requirement: Expression must end with a semicolon (;)
   * Example: "[y] = [x] * 2 + 3;"
   */
  connectTrackers(expression: string): { success: boolean; msg: string } {
    return TrackerExpressionConnectorFactory.connect({
      trackers: this.trackers,
      dependencies: this.dependencies,
      expression,
    });
  }
}
