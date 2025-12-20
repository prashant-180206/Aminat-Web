// core/scene.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import Konva from "@/lib/konva";
import MobjectMap, { Mobject } from "../maps/MobjectMap";
import {
  AnimationManager,
  AnimationMeta,
  AnimationType,
} from "./animation/animationManager";
import { getAnim } from "./animation/animations";
// import { AnimationType, getAnim } from "@/anim/getAnim";

class Scene extends Konva.Stage {
  layer: Konva.Layer;
  activeMobject: Mobject | null = null;

  private totalObjects = 0;
  private animManager = new AnimationManager();

  constructor(config: Konva.StageConfig) {
    super(config);
    this.layer = new Konva.Layer();
    this.add(this.layer);
  }

  /* ---------------- Mobject lifecycle ---------------- */

  addMobject(type: string) {
    const mobject = MobjectMap[type].func();
    this.layer.add(mobject as Konva.Shape);

    mobject.setDraggable(true);
    mobject.id(`${mobject.name() || "mobject"}-${this.totalObjects++}`);
    mobject.properties = { zindex: this.totalObjects - 1 };

    mobject.on("click", () => {
      this.activeMobject = mobject;
      mobject.UpdateFromKonvaProperties();
    });

    this.layer.draw();
    return mobject;
  }

  removeMobject(id: string) {
    this.layer.findOne(`#${id}`)?.destroy();
  }

  getMobjectById(id: string) {
    return this.layer.findOne(`#${id}`) as Mobject | null;
  }

  /* ---------------- Animation APIs ---------------- */

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

  /* ---------------- High-level animation creation ---------------- */

  createAnimation(
    targetId: string,
    type: AnimationType,
    options: any = {}
  ): string | null {
    const node = this.getMobjectById(targetId);
    if (!node) return null;

    const tween = getAnim(node, type, {
      ...options,
      onFinish:
        type === "destroy"
          ? () => this.removeMobject(targetId)
          : options.onFinish,
    });

    if (!tween) return null;

    return this.animManager.addTweenAsGroup(tween, {
      targetId,
      type,
      label: options.label,
    });
  }
}

export default Scene;
