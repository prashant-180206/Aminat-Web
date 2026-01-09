import { createTimer, easings } from "animejs";
import { ValueTracker } from "../classes/Tracker/valuetracker";
import { PtValueTracker } from "../classes/Tracker/ptValuetracker";
import { AnimMeta } from "../types/animation";
import { easingMap } from "../maps/easingMap";
// import { TrackerManager } from "../classes/Tracker/helpers/TrackerManager";
import Konva from "@/lib/konva";
import { PtTrackerMeta, TrackerMeta } from "../types/tracker";
import { TrackerManager } from "../classes/managers/TrackerManager";
// import { min } from "mathjs";

export class TrackerAnimator {
  static getAnimationforTracker = (
    t: ValueTracker,
    target: number,
    id: string,
    duration: number = 1,
    easing = "inOutQuad"
  ): AnimMeta => {
    const startValue = t.value;
    const easefunc = easing
      ? easings.eases[easingMap[easing] as keyof typeof easings.eases.in]
      : easings.eases.inOutQuad;
    const timer = createTimer({
      duration: duration * 1000,
      autoplay: false,
      onUpdate: (anim) => {
        const progress = anim.progress;

        const transformedProgress = easefunc(progress);
        const newValue =
          startValue + (target - startValue) * transformedProgress;
        t.value = newValue;
      },
    });

    return {
      id: `tracker-${t}-${target}-${Date.now().toString().slice(-4)}`,
      targetId: id,
      type: "ValueTracker",
      category: "Tracker",
      label: `Animating ValueTracker ${id}`,
      animFuncInput: { target, duration, easing },
      anim: timer,
    };
  };

  static getAnimationforPtTracker = (
    t: PtValueTracker,
    target: { x: number; y: number },
    id: string,
    duration: number = 1,
    easing = "inOutQuad"
  ): AnimMeta => {
    const startX = t.x.value;
    const startY = t.y.value;
    const easefunc = easing
      ? easings.eases[easingMap[easing] as keyof typeof easings.eases.in]
      : easings.eases.inOutQuad;
    const timer = createTimer({
      duration: duration * 1000,
      autoplay: false,
      onUpdate: (anim) => {
        const progress = anim.progress;
        const transformedProgress = easefunc(progress);
        const newX = startX + (target.x - startX) * transformedProgress;
        const newY = startY + (target.y - startY) * transformedProgress;
        t.x.value = newX;
        t.y.value = newY;
      },
    });

    return {
      id: `pttracker-${t}-${target.x}-${target.y}-${Date.now()
        .toString()
        .slice(-4)}`,
      targetId: id,
      type: "PtValueTracker",
      category: "PtTracker",
      label: `Animating PtValueTracker ${id}`,
      animFuncInput: { targetX: target.x, targetY: target.y, duration, easing },
      anim: timer,
    };
  };

  static getSliderAppearAnimation = (
    tm: TrackerManager,
    trackerId: string,
    layer: Konva.Layer,
    sliderInput: { min: number; max: number; rank: number }
  ): { success: boolean; anim: AnimMeta | null } => {
    const tracker = tm.getTracker(trackerId);
    if (!tracker) {
      return { success: false, anim: null };
    }

    const { success, slider } = tm.addSlider(trackerId, sliderInput);

    if (!success || !slider) {
      return { success: false, anim: null };
    }
    layer.add(slider);
    const anim = slider.appearAnim();

    const animInfo: AnimMeta = {
      id: `slider_appear_${trackerId}`,
      targetId: trackerId,
      anim,
      type: "SliderAppear",
      category: "Slider",
      label: `Slider Appear Animation for ${trackerId}`,
      animFuncInput: {
        duration: 1,
        min: sliderInput.min,
        max: sliderInput.max,
        rank: sliderInput.rank,
      },
    };
    return { success: true, anim: animInfo };
  };

  static getSliderDisappearAnimation = (
    tm: TrackerMeta
  ): { success: boolean; anim: AnimMeta | null } => {
    const anim = tm.slider?.disappearAnim();
    if (!anim) {
      return { success: false, anim: null };
    }
    const animInfo: AnimMeta = {
      id: `slider_disappear_${tm.id}`,
      targetId: tm.id,
      anim,
      type: "SliderDisappear",
      category: "Slider",
      label: `Slider Disappear Animation for ${tm.id}`,
      animFuncInput: { duration: 1 },
    };
    return { success: true, anim: animInfo };
  };

  static getPtSliderAppearAnimation = (
    tm: TrackerManager,
    trackerId: string,
    layer: Konva.Layer,
    sliderInput: {
      x: { min: number; max: number };
      y: { min: number; max: number };
      rank: number;
    }
  ): { success: boolean; anim: AnimMeta | null } => {
    const tracker = tm.getPtValueTracker(trackerId);
    if (!tracker) {
      return { success: false, anim: null };
    }

    const { success, slider } = tm.addPtSlider(
      trackerId,
      sliderInput.x,
      sliderInput.y,
      sliderInput.rank
    );

    if (!success || !slider) {
      return { success: false, anim: null };
    }
    layer.add(slider);
    const anim = slider.appearAnim();

    const animInfo: AnimMeta = {
      id: `PtSlider_appear_${trackerId}`,
      targetId: trackerId,
      anim,
      type: "PtSliderAppear",
      category: "PtSlider",
      label: `Slider Appear Animation for ${trackerId}`,
      animFuncInput: {
        duration: 1,
        minX: sliderInput.x.min,
        maxX: sliderInput.x.max,
        minY: sliderInput.y.min,
        maxY: sliderInput.y.max,
        rank: sliderInput.rank,
      },
    };
    return { success: true, anim: animInfo };
  };
  static getPtSliderDisappearAnimation = (
    tm: PtTrackerMeta
  ): { success: boolean; anim: AnimMeta | null } => {
    const anim = tm.slider?.disappearAnim();
    if (!anim) {
      return { success: false, anim: null };
    }
    const animInfo: AnimMeta = {
      id: `PtSlider_appear_${tm.id}`,
      targetId: tm.id,
      anim,
      type: "PtSliderDisappear",
      category: "PtSlider",
      label: `PtSlider Disappear Animation for ${tm.id}`,
      animFuncInput: { duration: 1 },
    };
    return { success: true, anim: animInfo };
  };
}
