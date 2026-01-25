/* eslint-disable @typescript-eslint/no-explicit-any */
import { easingMap } from "@/core/maps/easingMap";
import { MVector } from "../../mobjects/geometric/vector";
import { MLine } from "../../mobjects/simple/line";
import { createTimer, easings } from "animejs";
import { ParametricCurve } from "../../mobjects/simple/curve";
import { parse } from "mathjs";
import { MDashedLine } from "../../mobjects/simple/dashedLine";
import { Dot } from "../../mobjects/simple/dot";
import { MText } from "../../mobjects/text/text";
import { MArc } from "../../mobjects/geometric/arc";

export class MobjectAnimAdder {
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
            mobj.features.update({
              lineEnds: {
                start: { x: newX, y: newY },
                end: end,
              },
            });
          },
        });
        return {
          id: `${mobj.id()}-ls-${targetX}-${targetY}-${mobj.animgetter
            .counter++}`,
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
            mobj.features.update({
              lineEnds: {
                start: start,
                end: { x: newX, y: newY },
              },
            });
          },
        });
        return {
          id: `${mobj.id()}-ls-${targetX}-${targetY}-${mobj.animgetter
            .counter++}`,
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
          id: `${mobj.id()}-ls-${targetStart}-${targetEnd}-${mobj.animgetter
            .counter++}`,
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
          onComplete: () => {
            mobj.properties.funcs.Xfunc = TargetXFunc;
            mobj.properties.funcs.Yfunc = TargetYFunc;
          },
        });
        return {
          id: `${mobj.id()}-ls-${TargetXFunc}-${TargetYFunc}-${mobj.animgetter
            .counter++}`,
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
  static addLabelAnimations(
    mobj: MLine | MVector | MDashedLine | ParametricCurve | Dot | MArc,
  ) {
    mobj.animgetter.addAnimFunc("LabelAppear", {
      title: "Appear Label",
      type: "LabelAppear",
      targetId: mobj.id(),
      input: {
        duration: "number",
        easing: "string",
      },
      func: (args: { [key: string]: any }) => {
        const currentOpacity = 0;
        const targetOpacity = 1;
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
            const newOpacity =
              currentOpacity + (targetOpacity - currentOpacity) * progress;
            mobj.features.update({
              label: {
                ...mobj.properties.label,
                opacity: newOpacity,
              },
            });
          },
        });
        return {
          id: `${mobj.id()}-showLabel-${mobj.animgetter.counter++}`,
          targetId: mobj.id(),
          type: "LabelAppear",
          label: `making label of ${mobj.id()} visible`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });
    mobj.animgetter.addAnimFunc("LabelDisappear", {
      title: "Disappear Label",
      type: "LabelDisappear",
      targetId: mobj.id(),
      input: {
        duration: "number",
        easing: "string",
      },
      func: (args: { [key: string]: any }) => {
        const currentOpacity = 1;
        const targetOpacity = 0;
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
            const newOpacity =
              currentOpacity + (targetOpacity - currentOpacity) * progress;
            mobj.features.update({
              label: {
                ...mobj.properties.label,
                opacity: newOpacity,
              },
            });
          },
        });
        return {
          id: `${mobj.id()}-hideLabel-${mobj.animgetter.counter++}`,
          targetId: mobj.id(),
          type: "LabelDisappear",
          label: `making label of ${mobj.id()} visible`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });
  }

  static addTextAnimations(mobj: MText) {
    mobj.animgetter.addAnimFunc("ChangeText", {
      title: "Change Text Content",
      type: "ChangeText",
      targetId: mobj.id(),
      input: {
        targetText: "string",
        duration: "number",
        easing: "string",
      },
      func: (args: { [key: string]: any }) => {
        // 1. Capture the initial state
        const initialText = mobj.defaultText + "  " || "";
        const targetText = args.targetText || "";

        // 2. Setup easing
        const easefunc = args.easing
          ? easings.eases[
              easingMap[args.easing] as keyof typeof easings.eases.in
            ]
          : easings.eases.inOutQuad;

        // 3. Create the timer
        const timer = createTimer({
          autoplay: false,
          duration: args.duration * 1000 || 1500,
          onUpdate: (t) => {
            // Handle Anime.js progress (accounting for potential reversals)
            const p = t.reversed ? 1 - t.progress : t.progress;
            const progress = easefunc(p);

            let currentString = "";

            if (progress < 0.5) {
              /* --- PHASE 1: REMOVING TEXT (0.0 -> 0.5) --- */
              // Map 0.0-0.5 to a 1.0-0.0 scale
              const eraseProgress = 1 - progress * 2;
              const charCount = Math.floor(initialText.length * eraseProgress);
              currentString = initialText.substring(0, charCount);
            } else {
              /* --- PHASE 2: WRITING NEW TEXT (0.5 -> 1.0) --- */
              // Map 0.5-1.0 to a 0.0-1.0 scale
              const writeProgress = (progress - 0.5) * 2;
              const charCount = Math.floor(targetText.length * writeProgress);
              currentString = targetText.substring(0, charCount);
            }
            currentString += "  "; // Cursor effect

            // 4. Apply the update to the mobject
            mobj.setContent(currentString);
          },
        });

        return {
          id: `${mobj.id()}-changeText-${mobj.animgetter.counter++}`,
          targetId: mobj.id(),
          type: "ChangeText",
          label: `Changing text of ${mobj.id()} to "${targetText}"`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });
    mobj.animgetter.addAnimFunc("WriteText", {
      title: "Write Text",
      type: "WriteText",
      targetId: mobj.id(),
      input: {
        duration: "number",
        easing: "string",
      },
      func: (args: { [key: string]: any }) => {
        const targetText = mobj.defaultText + "  " || "";
        const startOpacity = 0;
        const startScale = 0; // Start slightly smaller

        const targetOpacity = 1;
        const targetScale = 1;

        const easefunc = args.easing
          ? easings.eases[
              easingMap[args.easing] as keyof typeof easings.eases.in
            ]
          : easings.eases.outCubic;

        const timer = createTimer({
          autoplay: false,
          duration: args.duration * 1000 || 1000,
          onUpdate: (t) => {
            const p = t.reversed ? 1 - t.progress : t.progress;
            const progress = easefunc(p);

            /* PHASE 1: APPEAR (0.0 -> 0.25) */
            if (progress <= 0.25) {
              const subP = progress * 4; // Normalize: 0.25 * 4 = 1.0
              const newOpacity =
                startOpacity + (targetOpacity - startOpacity) * subP;
              const newScale = startScale + (targetScale - startScale) * subP;
              mobj.features.update({ opacity: newOpacity, scale: newScale });
              mobj.setShownContent("");
            } else {
              /* PHASE 2: WRITE (0.25 -> 1.0) */
              const subP = (progress - 0.25) * (1 / 0.75); // Normalize: 0.75 * 1.33 = 1.0
              const charCount = Math.floor(targetText.length * subP);

              mobj.setShownContent(targetText.substring(0, charCount));
              mobj.features.update({
                opacity: targetOpacity,
                scale: targetScale,
              });
            }
          },
        });

        return {
          id: `${mobj.id()}-writeText-${mobj.animgetter.counter++}`,
          targetId: mobj.id(),
          type: "WriteText",
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
          label: `Writing text on ${mobj.id()}`,
        };
      },
    });

    mobj.animgetter.addAnimFunc("RemoveText", {
      title: "Remove Text",
      type: "RemoveText",
      targetId: mobj.id(),
      input: {
        duration: "number",
        easing: "string",
      },
      func: (args: { [key: string]: any }) => {
        const initialText = mobj.defaultText + "  " || "";
        const startOpacity = mobj.properties.opacity ?? 1;
        const startScale = mobj.properties.scale ?? 1;

        const targetOpacity = 0;
        const targetScale = 0.8; // Scale down slightly

        const easefunc = args.easing
          ? easings.eases[
              easingMap[args.easing] as keyof typeof easings.eases.in
            ]
          : easings.eases.inCubic;

        const timer = createTimer({
          autoplay: false,
          duration: args.duration * 1000 || 1000,
          onUpdate: (t) => {
            const p = t.reversed ? 1 - t.progress : t.progress;
            const progress = easefunc(p);

            /* PHASE 1: DELETE (0.0 -> 0.75) */
            if (progress <= 0.75) {
              const subP = progress * (1 / 0.75); // Normalize: 0.75 * 1.33 = 1.0
              const eraseProgress = 1 - subP;
              const charCount = Math.ceil(initialText.length * eraseProgress);

              mobj.setShownContent(initialText.substring(0, charCount));
              mobj.features.update({
                opacity: startOpacity,
                scale: startScale,
              });
            } else {
              /* PHASE 2: DISAPPEAR (0.75 -> 1.0) */
              const subP = (progress - 0.75) * 4; // Normalize: 0.25 * 4 = 1.0
              const newOpacity =
                startOpacity + (targetOpacity - startOpacity) * subP;
              const newScale = startScale + (targetScale - startScale) * subP;

              mobj.setShownContent("");
              mobj.features.update({ opacity: newOpacity, scale: newScale });
            }
          },
        });

        return {
          id: `${mobj.id()}-removeText-${mobj.animgetter.counter++}`,
          targetId: mobj.id(),
          type: "RemoveText",
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
          label: `Removing text from ${mobj.id()}`,
        };
      },
    });
  }
}
