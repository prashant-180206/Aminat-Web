import { easingMap } from "@/core/maps/easingMap";
import { MVector } from "../../mobjects/geometric/vector";
import { MLine } from "../../mobjects/simple/line";
import { createTimer, easings } from "animejs";
import { ParametricCurve } from "../../mobjects/simple/curve";
import { parse } from "mathjs";
import { MDashedLine } from "../../mobjects/simple/dashedLine";

export class MobjectAnimAdder {
  /**
   * The function `addLineAnimations` in TypeScript adds animation functionality to a line, vector, or
   * dashed line object by animating changes to its start and end points.
   * @param {MLine | MVector | MDashedLine} mobj - The `mobj` parameter in the `addLineAnimations`
   * function can be of type `MLine`, `MVector`, or `MDashedLine`.
   */
  static addLineAnimations(mobj: MLine | MVector | MDashedLine) {
    mobj.animgetter.addAnimFunc("LineStart", {
      title: "Line Start",
      type: "LineStart",
      targetId: mobj.id(),
      input: {
        X: "number",
        Y: "number",
        duration: "number",
        easing: "string",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      func: (args: { [key: string]: any }) => {
        if (args.duration <= 0) return null;
        const targetX = args.X ?? 0;
        const targetY = args.Y ?? 0;
        const targetpos = { x: targetX, y: targetY };
        const currentpos = { ...mobj.properties.lineEnds.start };
        const end = { ...mobj.properties.lineEnds.end };
        const easefunc = args.easing
          ? easings.eases[
              easingMap[args.easing] as keyof typeof easings.eases.in
            ]
          : easings.eases.inOutQuad;
        const timer = createTimer({
          autoplay: false,
          duration: args.duration * 1000 || 1000,
          onUpdate: (t) => {
            const p = t.reversed ? 1 - t.progress : t.progress;
            const progress = easefunc(p);
            const newX = currentpos.x + (targetpos.x - currentpos.x) * progress;
            const newY = currentpos.y + (targetpos.y - currentpos.y) * progress;
            mobj.properties = {
              lineEnds: {
                start: { x: newX, y: newY },
                end: end,
              },
            };
          },
        });
        return {
          id: `${mobj.id()}-ls-${targetX}-${targetY}-${
            mobj.animgetter.getAnimNames().length
          }`,
          targetId: mobj.id(),
          type: "LineStart",
          label: `Changing start of ${mobj.id()} to (${targetX}, ${targetY})`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });
    mobj.animgetter.addAnimFunc("LineEnd", {
      title: "Line End",
      type: "LineEnd",
      targetId: mobj.id(),
      input: {
        X: "number",
        Y: "number",
        duration: "number",
        easing: "string",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      func: (args: { [key: string]: any }) => {
        if (args.duration <= 0) return null;
        const targetX = args.X ?? 0;
        const targetY = args.Y ?? 0;
        const targetpos = { x: targetX, y: targetY };
        const currentpos = mobj.properties.lineEnds.end;
        const start = mobj.properties.lineEnds.start;
        const easefunc = args.easing
          ? easings.eases[
              easingMap[args.easing] as keyof typeof easings.eases.in
            ]
          : easings.eases.inOutQuad;
        const timer = createTimer({
          autoplay: false,
          duration: args.duration * 1000 || 1000,
          onUpdate: (t) => {
            const p = t.reversed ? 1 - t.progress : t.progress;
            const progress = easefunc(p);
            const newX = currentpos.x + (targetpos.x - currentpos.x) * progress;
            const newY = currentpos.y + (targetpos.y - currentpos.y) * progress;
            mobj.properties = {
              lineEnds: {
                start: start,
                end: { x: newX, y: newY },
              },
            };
          },
        });
        return {
          id: `${mobj.id()}-ls-${targetX}-${targetY}-${
            mobj.animgetter.getAnimNames().length
          }`,
          targetId: mobj.id(),
          type: "LineEnd",
          label: `Changing end of ${mobj.id()} to (${targetX}, ${targetY})`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });
  }
  static addCurveAnimations(mobj: ParametricCurve) {
    mobj.animgetter.addAnimFunc("Range", {
      title: "Change Parameter Range",
      type: "Range",
      targetId: mobj.id(),
      input: {
        start: "number",
        end: "number",
        duration: "number",
        easing: "string",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      func: (args: { [key: string]: any }) => {
        const targetStart = args.start ?? 0;
        const targetEnd = args.end ?? 0;
        const targetpos = { start: targetStart, end: targetEnd };
        const currentpos = mobj.properties.parameterRange;
        const easefunc = args.easing
          ? easings.eases[
              easingMap[args.easing] as keyof typeof easings.eases.in
            ]
          : easings.eases.inOutQuad;
        const timer = createTimer({
          autoplay: false,
          duration: args.duration * 1000 || 1000,
          onUpdate: (t) => {
            const p = t.reversed ? 1 - t.progress : t.progress;
            const progress = easefunc(p);
            const newStart =
              currentpos[0] + (targetpos.start - currentpos[0]) * progress;
            const newEnd =
              currentpos[1] + (targetpos.end - currentpos[1]) * progress;
            mobj.setParameterRange([newStart, newEnd]);
          },
        });
        return {
          id: `${mobj.id()}-ls-${targetStart}-${targetEnd}-${
            mobj.animgetter.getAnimNames().length
          }`,
          targetId: mobj.id(),
          type: "Range",
          label: `Changing Range of ${mobj.id()} to (${targetStart}, ${targetEnd})`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });
    mobj.animgetter.addAnimFunc("Functions", {
      title: "Change Parameter Range",
      type: "Functions",
      targetId: mobj.id(),
      input: {
        Xfunc: "string",
        Yfunc: "string",
        duration: "number",
        easing: "string",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      func: (args: { [key: string]: any }) => {
        const TargetXFunc = args.Xfunc ?? "t";
        const TargetYFunc = args.Yfunc ?? "t";
        const currentXFunc = mobj.properties.funcs.Xfunc;
        const currentYFunc = mobj.properties.funcs.Yfunc;

        try {
          const testval = 1;
          const evalExpr = (expr: string) => {
            const substituted = expr.replace("t", `(${testval})`);
            const node = parse(substituted);
            node.evaluate();
          };

          const draft: {
            Xfunc: string;
            Yfunc: string;
          } = {
            Xfunc: TargetXFunc.replace("t", `(1)`),
            Yfunc: TargetYFunc.replace("t", `(1)`),
          };

          evalExpr(draft.Xfunc);
          evalExpr(draft.Yfunc);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          return null;
        }

        const easefunc = args.easing
          ? easings.eases[
              easingMap[args.easing] as keyof typeof easings.eases.in
            ]
          : easings.eases.inOutQuad;
        const timer = createTimer({
          autoplay: false,
          duration: args.duration * 1000 || 1000,
          onUpdate: (t) => {
            const p = t.reversed ? 1 - t.progress : t.progress;
            const progress = easefunc(p);
            const newXFunc = `${currentXFunc} + (${TargetXFunc} - ${currentXFunc}) * ${progress}`;
            const newYFunc = `${currentYFunc} + (${TargetYFunc} - ${currentYFunc}) * ${progress}`;
            mobj.updateFunctions(newXFunc, newYFunc);
          },
        });
        return {
          id: `${mobj.id()}-ls-${TargetXFunc}-${TargetYFunc}-${
            mobj.animgetter.getAnimNames().length
          }`,
          targetId: mobj.id(),
          type: "Functions",
          label: `Changing Range of ${mobj.id()} to (${TargetXFunc}, ${TargetYFunc})`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });
  }
}
