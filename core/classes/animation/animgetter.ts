/* eslint-disable @typescript-eslint/no-explicit-any */
import { easingMap } from "@/core/maps/easingMap";
import { AnimMeta } from "@/core/types/animation";
import { p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";

export class AnimGetter {
  private AnimGetterMap = new Map<string, AnimMeta>();
  private node: Konva.Node;

  constructor(obj: Konva.Node) {
    this.node = obj;

    this.AnimGetterMap.set("Create", {
      title: "Create Animation",
      input: {
        duration: "number",
        easing: "string",
      },
      func: (args: { [key: string]: any }) => {
        const targetScaleX = this.node.scaleX() || 1;
        const targetScaleY = this.node.scaleY() || 1;
        const targetOpacity =
          "opacity" in this.node ? (this.node as any).opacity() : 1;

        this.node.scale({ x: 0, y: 0 });
        (this.node as any).opacity?.(0);

        return new Konva.Tween({
          node: this.node,
          duration: args.duration || 1,
          easing: easingMap[args.easing] || Konva.Easings.EaseInOut,
          scaleX: targetScaleX,
          scaleY: targetScaleY,
          opacity: targetOpacity,
        });
      },
    });

    this.AnimGetterMap.set("Destroy", {
      title: "Destroy Animation",
      input: {
        duration: "number",
        easing: "string",
      },
      func: (args: { [key: string]: any }) => {
        return new Konva.Tween({
          node: this.node,
          duration: args.duration || 1,
          easing: easingMap[args.easing] || Konva.Easings.EaseInOut,
          scaleX: 0,
          scaleY: 0,
          opacity: 0,
        });
      },
    });

    this.AnimGetterMap.set("Move", {
      title: "Move Animation",
      input: {
        duration: "number",
        easing: "string",
        toX: "number",
        toY: "number",
      },
      func: (args: { [key: string]: any }) => {
        if (args.toX === undefined || args.toY === undefined) return null;
        const canvas = p2c(args.toX, args.toY);

        return new Konva.Tween({
          node: this.node,
          duration: args.duration || 1,
          easing: easingMap[args.easing] || Konva.Easings.EaseInOut,
          x: canvas.x,
          y: canvas.y,
        });
      },
    });
  }

  addAnimFunc(name: string, meta: AnimMeta) {
    this.AnimGetterMap.set(name, meta);
  }

  getAnimMeta(name: string): AnimMeta | null {
    return this.AnimGetterMap.get(name) || null;
  }

  getAnimNames(): string[] {
    return Array.from(this.AnimGetterMap.keys());
  }
}
