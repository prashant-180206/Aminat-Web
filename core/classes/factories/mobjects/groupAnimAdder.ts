/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTimer, easings } from "animejs";
import { MPlane } from "../../mobjects/group/plane";
import { easingMap } from "@/core/maps/easingMap";
import { MNumberLine } from "../../mobjects/group/numberLine";

export class GroupAnimAdder {
  static addPlaneAnimations(mobj: MPlane) {
    // Add animations specific to MPlane here
    mobj.animgetter.addAnimFunc("GridAppear", {
      title: "Grid Appear",
      type: "GridAppear",
      targetId: mobj.id(),
      input: {
        duration: "number",
        easing: "string",
      },
      func: (args: { [key: string]: any }) => {
        if (args.duration <= 0) return null;

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
            mobj.gridGroup.opacity(progress);
          },
        });
        return {
          id: `${mobj.id()}-GridAppear-${
            mobj.animgetter.getAnimNames().length
          }`,
          targetId: mobj.id(),
          type: "GridAppear",
          label: `Grid appear animation for ${mobj.id()}`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });
    mobj.animgetter.addAnimFunc("GridDisappear", {
      title: "Grid Disappear",
      type: "GridDisappear",
      targetId: mobj.id(),
      input: {
        duration: "number",
        easing: "string",
      },
      func: (args: { [key: string]: any }) => {
        if (args.duration <= 0) return null;

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
            mobj.gridGroup.opacity(1 - progress);
          },
        });
        return {
          id: `${mobj.id()}-GridDisappear-${
            mobj.animgetter.getAnimNames().length
          }`,
          targetId: mobj.id(),
          type: "GridDisappear",
          label: `Grid disappear animation for ${mobj.id()}`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });
    mobj.animgetter.addAnimFunc("LabelAppear", {
      title: "Label Appear",
      type: "LabelAppear",
      targetId: mobj.id(),
      input: {
        duration: "number",
        easing: "string",
      },
      func: (args: { [key: string]: any }) => {
        if (args.duration <= 0) return null;

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
            mobj.labelGroup.opacity(progress);
          },
        });
        return {
          id: `${mobj.id()}-LabelAppear-${
            mobj.animgetter.getAnimNames().length
          }`,
          targetId: mobj.id(),
          type: "LabelAppear",
          label: `Label appear animation for ${mobj.id()}`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });
    mobj.animgetter.addAnimFunc("LabelDisappear", {
      title: "Label Disappear",
      type: "LabelDisappear",
      targetId: mobj.id(),
      input: {
        duration: "number",
        easing: "string",
      },
      func: (args: { [key: string]: any }) => {
        if (args.duration <= 0) return null;

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
            mobj.labelGroup.opacity(1 - progress);
          },
        });
        return {
          id: `${mobj.id()}-LabelDisappear-${
            mobj.animgetter.getAnimNames().length
          }`,
          targetId: mobj.id(),
          type: "LabelDisappear",
          label: `Label disappear animation for ${mobj.id()}`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });
  }
  static addNumberLineAnimations(mobj: MNumberLine) {
    mobj.animgetter.addAnimFunc("LabelAppear", {
      title: "Label Appear",
      type: "LabelAppear",
      targetId: mobj.id(),
      input: {
        duration: "number",
        easing: "string",
      },
      func: (args: { [key: string]: any }) => {
        if (args.duration <= 0) return null;

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
            mobj.labelGroup.opacity(progress);
          },
        });
        return {
          id: `${mobj.id()}-LabelAppear-${
            mobj.animgetter.getAnimNames().length
          }`,
          targetId: mobj.id(),
          type: "LabelAppear",
          label: `Label appear animation for ${mobj.id()}`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });
    mobj.animgetter.addAnimFunc("LabelDisappear", {
      title: "Label Disappear",
      type: "LabelDisappear",
      targetId: mobj.id(),
      input: {
        duration: "number",
        easing: "string",
      },
      func: (args: { [key: string]: any }) => {
        if (args.duration <= 0) return null;

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
            mobj.labelGroup.opacity(1 - progress);
          },
        });
        return {
          id: `${mobj.id()}-LabelDisappear-${
            mobj.animgetter.getAnimNames().length
          }`,
          targetId: mobj.id(),
          type: "LabelDisappear",
          label: `Label disappear animation for ${mobj.id()}`,
          animFuncInput: args,
          anim: timer,
          category: "Mobject",
        };
      },
    });
    // Add animations specific to MNumberLine here
  }
}
