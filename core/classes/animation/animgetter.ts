/* eslint-disable @typescript-eslint/no-explicit-any */
import { easingMap } from "@/core/maps/easingMap";
import { AnimFuncMeta } from "@/core/types/animation";
import { Mobject } from "@/core/types/mobjects";
import { createTimer, easings } from "animejs";

export class AnimGetter {
  private AnimGetterMap = new Map<string, AnimFuncMeta>();
  private node: Mobject;
  counter = 0;

  constructor(obj: Mobject) {
    this.node = obj;

    this.AnimGetterMap.set("Create", {
      title: "Create Animation",
      input: {
        duration: "number",
        easing: "string",
      },
      targetId: this.node.id(),
      type: "Create",
      func: (args: { [key: string]: any }) => {
        const easefunc = args.easing
          ? easings.eases[
              easingMap[args.easing] as keyof typeof easings.eases.in
            ]
          : easings.eases.inOutQuad;
        const timer = createTimer({
          duration: args.duration ? args.duration * 1000 : 1000,
          autoplay: false,
          onUpdate: (t) => {
            const p = t.reversed ? 1 - t.progress : t.progress;
            const transformedProgress = easefunc(p);
            this.node.features.update({
              scale: transformedProgress * 1.0,
              opacity: transformedProgress * 1.0,
            });
          },
        });

        return {
          id: `${this.node.id()}-Create-${this.counter++}`,
          targetId: this.node.id(),
          type: "Create",
          label: `Creating ${this.node.id()}`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });

    this.AnimGetterMap.set("Destroy", {
      title: "Destroy Animation",
      input: {
        duration: "number",
        easing: "string",
      },
      targetId: this.node.id(),
      type: "Destroy",
      func: (args: { [key: string]: any }) => {
        const easefunc = args.easing
          ? easings.eases[
              easingMap[args.easing] as keyof typeof easings.eases.in
            ]
          : easings.eases.inOutQuad;
        const timer = createTimer({
          duration: args.duration ? args.duration * 1000 : 1000,
          autoplay: false,
          onUpdate: (t) => {
            const progress = t.reversed ? 1 - t.progress : t.progress;
            const transformedProgress = easefunc(progress);
            this.node.features.update({
              scale: 1.0 - transformedProgress * 1.0,
              opacity: 1.0 - transformedProgress * 1.0,
            });
          },
        });
        return {
          id: `${this.node.id()}-Destroy-${this.counter++}`,
          targetId: this.node.id(),
          type: "Destroy",
          label: `Destroying ${this.node.id()}`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });

    this.AnimGetterMap.set("Focus", {
      title: "Focus Animation",
      input: {
        duration: "number",
        easing: "string",
      },
      targetId: this.node.id(),
      type: "Focus",
      func: (args: { [key: string]: any }) => {
        const easefunc = args.easing
          ? easings.eases[
              easingMap[args.easing] as keyof typeof easings.eases.in
            ]
          : easings.eases.inOutQuad;

        const timer = createTimer({
          duration: args.duration ? args.duration * 1000 : 1000,
          autoplay: false,
          onUpdate: (t) => {
            const progress = t.reversed ? 1 - t.progress : t.progress;
            const transformedProgress = easefunc(progress);

            // Use a Sine wave to go 0 -> 1 -> 0 over the duration
            // Math.sin(PI * 1) = 0, Math.sin(PI * 0.5) = 1
            const pulseFactor = Math.sin(Math.PI * transformedProgress);

            // Scale moves from 1.0 to 1.1 (1.0 + 0.1 * pulseFactor)
            const currentScale = 1.0 + pulseFactor * 0.1;

            this.node.features.update({
              scale: currentScale,
            });
          },
        });

        return {
          id: `${this.node.id()}-Focus-${this.counter++}`,
          targetId: this.node.id(),
          type: "Focus",
          label: `Focusing ${this.node.id()}`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
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
      targetId: this.node.id(),
      type: "Move",

      func: (args: { [key: string]: any }) => {
        if (args.toX === undefined || args.toY === undefined) {
          args.toX = 0;
          args.toY = 0;
        }
        const currentval = this.node.properties.position;
        const easefunc = args.easing
          ? easings.eases[
              easingMap[args.easing] as keyof typeof easings.eases.in
            ]
          : easings.eases.inOutQuad;

        const timer = createTimer({
          duration: args.duration ? args.duration * 1000 : 1000,
          autoplay: false,
          onUpdate: (t) => {
            const progress = t.reversed ? 1 - t.progress : t.progress;
            const transformedProgress = easefunc(progress);
            this.node.features.update({
              position: {
                x:
                  currentval.x +
                  (args.toX - currentval.x) * transformedProgress,
                y:
                  currentval.y +
                  (args.toY - currentval.y) * transformedProgress,
              },
            });
          },
        });
        return {
          id: `${this.node.id()}-Move-${currentval.x.toFixed(2)}-${currentval.y.toFixed(2)}-${this
            .counter++}`,
          targetId: this.node.id(),
          type: "Move",
          label: `Moving ${this.node.id()}`,
          animFuncInput: args,
          category: "Mobject",
          anim: timer,
        };
      },
    });
  }

  addAnimFunc(name: string, meta: AnimFuncMeta) {
    this.AnimGetterMap.set(name, meta);
    this.counter++;
  }

  getAnimMeta(name: string): AnimFuncMeta | null {
    return this.AnimGetterMap.get(name) || null;
  }

  getAnimNames(): string[] {
    return Array.from(this.AnimGetterMap.keys());
  }
}
