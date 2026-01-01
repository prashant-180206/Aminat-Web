/* eslint-disable @typescript-eslint/no-explicit-any */
import { easingMap } from "@/core/maps/easingMap";
import { AnimMeta } from "@/core/types/animation";
import { Mobject } from "@/core/types/mobjects";
import { p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";

export class AnimGetter {
  private AnimGetterMap = new Map<string, AnimMeta>();
  private node: Mobject;
  private counter = 0;
  private static HIDDEN_SCALE = 0.0001;

  constructor(obj: Mobject) {
    this.node = obj;

    this.AnimGetterMap.set("Create", {
      title: "Create Animation",
      input: {
        duration: "number",
        easing: "string",
      },
      mobjId: this.node.id(),
      type: "Create",
      func: (args: { [key: string]: any }) => {
        this.node.opacity(0);
        this.node.scaleX(0);
        this.node.scaleY(0);

        const tween = new Konva.Tween({
          node: this.node,
          duration: args.duration || 1,
          easing: easingMap[args.easing] || Konva.Easings.EaseInOut,
          scaleX: 1,
          scaleY: 1,

          opacity: 1,
          onFinish: () => {
            this.node.opacity(1);
            this.node.scaleX(1);
            this.node.scaleY(1);
          },
          onReset: () => {
            this.node.opacity(0);
            this.node.scaleX(0);
            this.node.scaleY(0);
          },
        });

        return {
          id: `${this.node.id()}-Create-${this.counter++}`,
          mobjId: this.node.id(),
          type: "Create",
          label: `Creating ${this.node.id()}`,
          tweenMeta: args,
          anim: tween,
        };
      },
    });

    this.AnimGetterMap.set("Destroy", {
      title: "Destroy Animation",
      input: {
        duration: "number",
        easing: "string",
      },
      mobjId: this.node.id(),
      type: "Destroy",
      func: (args: { [key: string]: any }) => {
        const tween = new Konva.Tween({
          node: this.node,
          duration: args.duration || 1,
          easing: easingMap[args.easing] || Konva.Easings.EaseInOut,
          scaleX: 0,
          scaleY: 0,
          opacity: 0,

          onFinish: () => {
            this.node.opacity(0);
            this.node.scaleX(0);
            this.node.scaleY(0);
          },
          onReset: () => {
            this.node.opacity(1);
            this.node.scaleX(1);
            this.node.scaleY(1);
          },
        });
        return {
          id: `${this.node.id()}-Destroy-${this.counter++}`,
          mobjId: this.node.id(),
          type: "Destroy",
          label: `Destroying ${this.node.id()}`,
          tweenMeta: args,
          anim: tween,
        };
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
      mobjId: this.node.id(),
      type: "Move",

      func: (args: { [key: string]: any }) => {
        if (args.toX === undefined || args.toY === undefined) return null;
        const canvas = p2c(args.toX, args.toY);

        console.log("Move Anim Func called ", canvas);
        console.log("Current Pos ", this.node.x(), this.node.y());

        const tween = new Konva.Tween({
          node: this.node,
          duration: args.duration || 1,
          easing: easingMap[args.easing] || Konva.Easings.EaseInOut,
          x: canvas.x,
          y: canvas.y,
        });
        return {
          id: `${this.node.id()}-Move-${canvas.x}-${canvas.y}-${this
            .counter++}`,
          mobjId: this.node.id(),
          type: "Move",
          label: `Moving ${this.node.id()}`,
          tweenMeta: args,
          anim: tween,
        };
      },
    });
  }

  addAnimFunc(name: string, meta: AnimMeta) {
    this.AnimGetterMap.set(name, meta);
    this.counter++;
  }

  getAnimMeta(name: string): AnimMeta | null {
    return this.AnimGetterMap.get(name) || null;
  }

  getAnimNames(): string[] {
    return Array.from(this.AnimGetterMap.keys());
  }
}
