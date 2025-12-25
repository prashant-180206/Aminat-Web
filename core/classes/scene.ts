// core/scene.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */

import Konva from "@/lib/konva";
import MobjectMap from "../maps/MobjectMap";

import { AnimationManager } from "./animation/animationManager";
// import { getAnim } from "./animation/animations";
import { TrackerManager } from "./Tracker/TrackerManager";
// import { ValueTracker } from "./Tracker/valuetracker";
import { AnimInfo } from "../types/animation";
import { Mobject } from "../types/mobjects";

// import { TrackerManager } from "./animation/TrackerManager";
// import { ValueTracker } from "./animation/ValueTracker";
// import { Slider } from "@/ui/slider";

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
  }

  getMobjectById(id: string): Mobject | null {
    return this.layer.findOne(`#${id}`) as Mobject | null;
  }

  /* ============================================================ */
  /* ANIMATION MANAGER                                           */
  /* ============================================================ */

  getAnimationGroups(): AnimInfo[][] {
    return this.animManager.getGroupsWithMeta();
  }

  playCurrentGroup() {
    this.animManager.animate();
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

  addAnimations(...anims: AnimInfo[]): string[] {
    return this.animManager.addAnimations(...anims);
  }
}

export default Scene;
