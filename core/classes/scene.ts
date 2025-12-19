/* eslint-disable @typescript-eslint/no-explicit-any */
import Konva from "@/lib/konva";
import MobjectMap, { Mobject } from "../maps/MobjectMap";
import {
  AnimationManager,
  AnimationMeta,
  AnimationType,
} from "./animation/animationManager";
import { p2c } from "@/core/utils/conversion";

class Scene extends Konva.Stage {
  layer: Konva.Layer;
  private TotalObjects: number = 0;
  private Mobjects: string[] = [];
  private animManager: AnimationManager | null = null;
  constructor(config: Konva.StageConfig) {
    super(config);
    const layer = new Konva.Layer();
    this.add(layer);
    this.layer = layer as Konva.Layer;
    this.animManager = new AnimationManager();
  }

  activeMobject: Mobject | null = null;

  addMobject(str: string) {
    const mobject = MobjectMap[str].func();
    this.layer.add(mobject as Konva.Shape);
    mobject.setDraggable(true);
    // mobject.properties
    const addid = `${mobject.name() || "mobject"}-${this.TotalObjects}`;
    mobject.id(addid);

    mobject.on("click", () => {
      this.activeMobject = mobject;
      mobject?.UpdateFromKonvaProperties();
    });
    // this.onActiveMobjectChange();
    this.TotalObjects += 1;
    mobject.properties = { zindex: this.TotalObjects - 1 };
    this.Mobjects.push(addid);
    this.layer.draw();
    return mobject;
  }

  removeMobject(id: string) {
    const mobject = this.getMobjectById(id);
    if (mobject) {
      mobject.destroy();
      this.Mobjects = this.Mobjects.filter((mid) => mid !== id);
    }
  }

  getMobjectById(id: string) {
    return this.layer.findOne(`#${id}`) as Mobject;
  }

  // Animation APIs
  getAnimationManager(): AnimationManager | null {
    return this.animManager;
  }

  getAnimationGroups(): AnimationMeta[][] {
    return this.animManager ? this.animManager.getGroupsWithMeta() : [];
  }

  playCurrentGroup() {
    this.animManager?.animate();
  }

  playNextGroup() {
    this.animManager?.animateNext();
  }

  resetAnimations() {
    this.animManager?.resetAll();
  }

  moveAnimationGroup(groupIndex: number, direction: "up" | "down") {
    this.animManager?.moveGroup(groupIndex, direction);
  }

  removeAnimation(animId: string) {
    this.animManager?.removeAnimation(animId);
  }

  // Create high-level animations for a target mobject id
  createAnimation(
    targetId: string,
    type: AnimationType,
    options: any = {}
  ): string | null {
    if (!this.animManager) return null;
    const node = this.getMobjectById(targetId) as Konva.Node | null;
    if (!node) return null;

    const duration: number = options.duration ?? 0.6;
    const easing = options.easing ?? Konva.Easings.EaseInOut;

    let tween: Konva.Tween | null = null;

    if (type === "create") {
      const targetScaleX = node.scaleX() || 1;
      const targetScaleY = node.scaleY() || 1;
      type OpNode = Konva.Node & { opacity(v?: number): number };
      const opNode = node as OpNode;
      const targetOpacity = opNode.opacity();
      node.scale({ x: 0, y: 0 });
      opNode.opacity(0);
      tween = new Konva.Tween({
        node,
        duration,
        easing,
        scaleX: targetScaleX,
        scaleY: targetScaleY,
        opacity: targetOpacity,
      });
    } else if (type === "destroy") {
      tween = new Konva.Tween({
        node,
        duration,
        easing,
        scaleX: 0,
        scaleY: 0,
        opacity: 0,
        onFinish: () => {
          this.removeMobject(targetId);
        },
      });
    } else if (type === "move") {
      const { to } = options as { to: { x: number; y: number } };
      if (!to) return null;
      const canvas = p2c(to.x, to.y);
      tween = new Konva.Tween({
        node,
        duration,
        easing,
        x: canvas.x,
        y: canvas.y,
      });
    } else if (type === "scaleMove") {
      const { to, scale } = options as {
        to: { x: number; y: number };
        scale: number;
      };
      if (!to || typeof scale !== "number") return null;
      const canvas = p2c(to.x, to.y);
      tween = new Konva.Tween({
        node,
        duration,
        easing,
        x: canvas.x,
        y: canvas.y,
        scaleX: scale,
        scaleY: scale,
      });
    }

    if (!tween) return null;

    const id = this.animManager.addTweenAsGroup(tween, {
      targetId,
      type,
      label: options.label,
    });
    return id;
  }
}

export default Scene;
