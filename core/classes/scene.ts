// core/scene.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import Konva from "@/lib/konva";
import MobjectMap, { Mobject } from "../maps/MobjectMap";

import {
  AnimationManager,
  AnimationMeta,
  AnimationType,
} from "./animation/animationManager";
// import { getAnim } from "./animation/animations";
import { TrackerManager } from "./Tracker/TrackerManager";
import { ValueTracker } from "./Tracker/valuetracker";

// import { TrackerManager } from "./animation/TrackerManager";
// import { ValueTracker } from "./animation/ValueTracker";
// import { Slider } from "@/ui/slider";

/* ------------------------------------------------------------ */
/* Types                                                        */
/* ------------------------------------------------------------ */

type TrackerBinding = {
  mobjectId: string;
  trackerName: string;
  updateFn: (mobject: Mobject, value: number) => void;
};

/* ------------------------------------------------------------ */
/* Scene                                                        */
/* ------------------------------------------------------------ */

class Scene extends Konva.Stage {
  /* ---------------- Public ---------------- */

  layer: Konva.Layer;
  activeMobject: Mobject | null = null;

  /* ---------------- Private ---------------- */

  private totalObjects = 0;
  private animManager = new AnimationManager();
  private trackerManager: TrackerManager;

  private trackerBindings: TrackerBinding[] = [];

  /* ------------------------------------------------------------ */

  constructor(config: Konva.StageConfig) {
    super(config);

    this.layer = new Konva.Layer();
    this.add(this.layer);

    this.trackerManager = new TrackerManager(this.layer);
  }

  /* ============================================================ */
  /* MOBJECT LIFECYCLE                                            */
  /* ============================================================ */

  addMobject(type: string): Mobject {
    const mobject = MobjectMap[type].func();

    mobject.id(`${mobject.name() || "mobject"}-${this.totalObjects++}`);
    mobject.setDraggable(true);
    mobject.properties = { zindex: this.totalObjects - 1 };

    mobject.on("click", () => {
      this.activeMobject = mobject;
      mobject.UpdateFromKonvaProperties();
    });

    this.layer.add(mobject as Konva.Shape);
    this.layer.draw();

    return mobject;
  }

  removeMobject(id: string) {
    this.layer.findOne(`#${id}`)?.destroy();

    // cleanup bindings
    this.trackerBindings = this.trackerBindings.filter(
      (b) => b.mobjectId !== id
    );
  }

  getMobjectById(id: string): Mobject | null {
    return this.layer.findOne(`#${id}`) as Mobject | null;
  }

  /* ============================================================ */
  /* TRACKERS + SLIDERS                                           */
  /* ============================================================ */

  /**
   * Creates a ValueTracker and attaches its Slider to a mobject.
   * Slider moves with the mobject and is a real Konva node.
   */
  addValueTrackerWithSliderToMobject(
    mobjectId: string,
    trackerName: string,
    options: Parameters<TrackerManager["addValueTrackerWithSlider"]>[1]
  ): ValueTracker {
    const mobject = this.getMobjectById(mobjectId);
    if (!mobject) {
      throw new Error(`Mobject "${mobjectId}" not found`);
    }

    const { tracker, slider } = this.trackerManager.addValueTrackerWithSlider(
      trackerName,
      options
    );

    if (slider) {
      const container = new Konva.Group({
        name: `tracker-slider-${trackerName}`,
      });

      container.add(slider);

      slider.position(options.slider?.position ?? { x: 0, y: -40 });

      this.layer.add(container);

      const syncPosition = () => {
        container.position({
          x: mobject.x(),
          y: mobject.y(),
        });
        this.layer.batchDraw();
      };

      // sync lifecycle
      syncPosition();
      mobject.on("dragmove", syncPosition);
      mobject.on("xChange yChange", syncPosition);
    }

    return tracker;
  }

  /**
   * Placeholder binding API.
   * Update logic is intentionally external & pluggable.
   */
  bindTrackerToMobject(
    mobjectId: string,
    trackerName: string,
    updateFn: (mobject: Mobject, value: number) => void
  ) {
    const tracker = this.trackerManager.getTracker(trackerName);
    if (!tracker) {
      throw new Error(`Tracker "${trackerName}" not found`);
    }

    const binding: TrackerBinding = {
      mobjectId,
      trackerName,
      updateFn,
    };

    this.trackerBindings.push(binding);

    tracker.addUpdater((value) => {
      const mobject = this.getMobjectById(mobjectId);
      if (!mobject) return;

      updateFn(mobject, value);
      this.layer.batchDraw();
    });
  }

  /* ============================================================ */
  /* TRACKER ANIMATION                                           */
  /* ============================================================ */

  animateTracker(
    trackerName: string,
    target: number,
    config?: Parameters<TrackerManager["animateTrackerTo"]>[2]
  ) {
    return this.trackerManager.animateTrackerTo(trackerName, target, config);
  }

  /* ============================================================ */
  /* ANIMATION MANAGER                                           */
  /* ============================================================ */

  getAnimationGroups(): AnimationMeta[][] {
    return this.animManager.getGroupsWithMeta();
  }

  playCurrentGroup() {
    this.animManager.animate();
  }

  playNextGroup() {
    this.animManager.animateNext();
  }

  resetAnimations() {
    this.animManager.resetAll();
  }

  moveAnimationGroup(index: number, dir: "up" | "down") {
    this.animManager.moveGroup(index, dir);
  }

  removeAnimation(id: string) {
    this.animManager.removeAnimation(id);
  }

  /* ============================================================ */
  /* HIGH-LEVEL ANIMATION CREATION                                */
  /* ============================================================ */

  createAnimation(
    targetId: string,
    type: AnimationType,
    inputs: any = {}
  ): string | null {
    const node = this.getMobjectById(targetId);
    if (!node) return null;

    const animMeta = node.animgetter.getAnimMeta(type);
    if (!animMeta) return null;

    const tween = animMeta.func(inputs);

    if (!tween) return null;

    return this.animManager.addTweenAsGroup(tween, {
      targetId,
      type,
      label: animMeta.title,
    });
  }
}

export default Scene;
