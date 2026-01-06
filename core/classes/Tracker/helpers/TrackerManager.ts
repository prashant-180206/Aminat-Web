import Konva from "@/lib/konva";
import { ValueTracker } from "../valuetracker";
import { PtTrackerMeta, TrackerMeta } from "@/core/types/tracker";
import { TrackerManagerData } from "@/core/types/file";
import { PtValueTracker } from "../ptValuetracker";
import { PtSlider } from "../sliders/PtSlider";
import { Slider } from "../sliders/slider";
import { parse, evaluate } from "mathjs";

export class TrackerManager {
  private trackers = new Map<string, TrackerMeta>();
  private pointTrackers = new Map<string, PtTrackerMeta>();
  // Inside TrackerManager class
  private activeLinks = new Map<
    string,
    { target: string; deps: Set<string> }
  >();

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
    // 1. Identify all potential "keys" this name represents in the link system
    // If 'name' is 'pt1', we check for 'pt1', 'pt1.x', and 'pt1.y'
    const targetsToRemove = new Set<string>([name]);
    if (this.pointTrackers.has(name)) {
      targetsToRemove.add(`${name}.x`);
      targetsToRemove.add(`${name}.y`);
    }

    // 2. Clean up expressions where this (or its components) is the TARGET
    // Example: [pt1.x] = [var] + 1;
    this.activeLinks.forEach((link, expr) => {
      if (targetsToRemove.has(link.target)) {
        this.removeExpression(expr);
      }
    });

    // 3. Clean up expressions where this (or its components) is a DEPENDENCY
    // Example: [var2] = [pt1.y] * 2;
    this.activeLinks.forEach((link, expr) => {
      const hasDep = Array.from(link.deps).some((dep) =>
        targetsToRemove.has(dep)
      );
      if (hasDep) {
        this.removeExpression(expr);
      }
    });

    // 4. Handle scalar tracker removal
    const entry = this.trackers.get(name);
    if (entry) {
      entry.slider?.destroy();
      this.trackers.delete(name);
      this.dependencies.delete(name);
      return;
    }

    // 5. Handle point tracker removal
    const ptEntry = this.pointTrackers.get(name);
    if (ptEntry) {
      ptEntry.slider?.destroy();
      this.pointTrackers.delete(name);
      // Also clear the dependency graph entries for the sub-properties
      this.dependencies.delete(`${name}.x`);
      this.dependencies.delete(`${name}.y`);
    }
  }

  clear() {
    // Clean up all expression links first
    this.activeLinks.forEach((_, expr) => this.removeExpression(expr));

    this.dependencies.clear();

    // Standard cleanup for sliders and maps
    [...this.trackers.values(), ...this.pointTrackers.values()].forEach((m) =>
      m.slider?.destroy()
    );
    this.trackers.clear();
    this.pointTrackers.clear();
    this.activeLinks.clear();
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
  /**
   * Connects trackers via a string expression.
   * Handles deep circular dependency detection.
   */
  /* --- Inside TrackerManager class --- */

  /**
   * Internal helper to resolve a string like "x" or "pt1.x" to a ValueTracker.
   */
  private resolveTracker(ref: string): ValueTracker | null {
    if (ref.includes(".")) {
      const [name, prop] = ref.split(".");
      const ptMeta = this.pointTrackers.get(name);
      if (!ptMeta) return null;
      if (prop === "x") return ptMeta.tracker.x;
      if (prop === "y") return ptMeta.tracker.y;
      return null;
    }
    return this.trackers.get(ref)?.tracker ?? null;
  }

  connectTrackers(expression: string): { success: boolean; msg: string } {
    const trimmedExpr = expression.trim();
    if (!trimmedExpr.endsWith(";")) {
      return {
        success: false,
        msg: "Expression must end with a semicolon (;)",
      };
    }

    if (this.activeLinks.has(expression)) {
      return { success: false, msg: "This expression is already active." };
    }

    const cleanExpr = trimmedExpr.slice(0, -1).trim();
    const LHS_REGEX = /^\s*\[([^\]]+)\]\s*=/;
    const REF_REGEX = /\[([^\]]+)\]/g;

    const lhsMatch = cleanExpr.match(LHS_REGEX);
    if (!lhsMatch)
      return { success: false, msg: "Invalid format. Use '[target] = ...;'" };

    const targetRef = lhsMatch[1]; // e.g. "pt1.x" or "var1"
    const targetTracker = this.resolveTracker(targetRef);

    if (!targetTracker) {
      return { success: false, msg: `Target '${targetRef}' not found.` };
    }

    const rhs = cleanExpr.split("=").slice(1).join("=").trim();
    const newDeps = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = REF_REGEX.exec(rhs)) !== null) {
      newDeps.add(match[1]); // e.g. "x" or "pt2.y"
    }

    // 1. Validation: Existence
    for (const dep of newDeps) {
      if (!this.resolveTracker(dep)) {
        return { success: false, msg: `Dependency '${dep}' missing.` };
      }
    }

    // 2. Deep Circular Dependency Check
    const causesCycle = (current: string, searchTarget: string): boolean => {
      const existingDeps = this.dependencies.get(current);
      if (!existingDeps) return false;
      if (existingDeps.has(searchTarget)) return true;
      for (const nextDep of existingDeps) {
        if (causesCycle(nextDep, searchTarget)) return true;
      }
      return false;
    };

    for (const dep of newDeps) {
      if (dep === targetRef || causesCycle(dep, targetRef)) {
        return {
          success: false,
          msg: `Circular dependency: [${targetRef}] cannot depend on [${dep}].`,
        };
      }
    }

    // 3. Syntax validation
    try {
      let testExpr = rhs;
      newDeps.forEach((d) => (testExpr = testExpr.replaceAll(`[${d}]`, "1")));
      parse(testExpr);
    } catch {
      return { success: false, msg: "Mathematical syntax error." };
    }

    /* --- Validation Passed: Update State --- */

    this.dependencies.set(targetRef, newDeps);

    const updateTarget = () => {
      let evalExpr = rhs;
      newDeps.forEach((dep) => {
        const tracker = this.resolveTracker(dep);
        const val = tracker ? tracker.value : 0;
        evalExpr = evalExpr.replaceAll(`[${dep}]`, val.toString());
      });
      try {
        const result = evaluate(evalExpr);
        if (typeof result === "number" && !Number.isNaN(result)) {
          targetTracker.value = result;
        }
      } catch (err) {
        console.error("Link evaluation error:", err);
      }
    };

    // Attach listeners using the targetRef as the unique ID
    const successArray: boolean[] = [];
    newDeps.forEach((dep) => {
      const depTracker = this.resolveTracker(dep)!;
      const done = depTracker.addUpdater(
        `link-${targetRef}`,
        updateTarget,
        "t"
      );
      successArray.push(done);
    });

    if (successArray.includes(false)) {
      this.dependencies.delete(targetRef);
      return { success: false, msg: "Failed to add updater." };
    }

    updateTarget();
    this.activeLinks.set(expression, { target: targetRef, deps: newDeps });

    return { success: true, msg: "Linked successfully." };
  }

  /**
   * Modified to use the new resolution logic for cleanup
   */
  removeExpression(expression: string) {
    const link = this.activeLinks.get(expression);
    if (!link) return;

    link.deps.forEach((depRef) => {
      const depTracker = this.resolveTracker(depRef);
      if (depTracker) {
        depTracker.removeUpdater(`link-${link.target}`);
      }
    });

    this.dependencies.delete(link.target);
    this.activeLinks.delete(expression);
  }
  getAllExpressions(): string[] {
    return Array.from(this.activeLinks.keys());
  }
}
