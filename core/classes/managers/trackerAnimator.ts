import Konva from "@/lib/konva";
import { AnimationManager } from "./animationManager";
import { TrackerManager } from "./TrackerManager";
import { easingMap } from "@/core/maps/easingMap";
import { createTimer, easings } from "animejs";

export class TrackerAnimator {
  private trackerAnimationCount = 0;
  private animManager: AnimationManager;
  private trackerManager: TrackerManager;
  private layer: Konva.Layer;
  constructor(a: AnimationManager, tm: TrackerManager, layer: Konva.Layer) {
    this.animManager = a;
    this.trackerManager = tm;
    this.layer = layer;
  }

  addSliderAppearAnimation(
    valueTrackerId: string,
    { min, max, rank }: { min: number; max: number; rank: number },
  ): boolean {
    const { success, slider } = this.trackerManager.addSlider(valueTrackerId, {
      min,
      max,
      rank,
    });
    if (!success || !slider) {
      return false;
    }
    this.layer.add(slider);
    const anim = slider.appearAnim();
    this.animManager.addAnimations({
      id: `Appear_${valueTrackerId}_${this.trackerAnimationCount}`,
      targetId: valueTrackerId,
      anim,
      type: "SliderAppear",
      category: "Slider",
      label: `Slider Appear Animation for ${valueTrackerId}`,
      animFuncInput: {
        duration: 1,
        min: min,
        max: max,
        rank: rank,
      },
    });
    this.trackerAnimationCount++;
    return true;
  }

  addPtSliderAppearAnimation(
    PtvalueTrackerId: string,
    {
      minX,
      maxX,
      minY,
      maxY,
      rank,
    }: { minX: number; maxX: number; minY: number; maxY: number; rank: number },
  ): boolean {
    const { success, slider } = this.trackerManager.addPtSlider(
      PtvalueTrackerId,
      { min: minX, max: maxX },
      { min: minY, max: maxY },
      rank,
    );
    if (!success || !slider) {
      return false;
    }
    this.layer.add(slider);
    const anim = slider.appearAnim();
    this.animManager.addAnimations({
      id: `Appear_${PtvalueTrackerId}_${this.trackerAnimationCount}`,
      targetId: PtvalueTrackerId,
      anim,
      type: "PtSliderAppear",
      category: "PtSlider",
      label: `PtSlider Appear Animation for ${PtvalueTrackerId}`,
      animFuncInput: {
        duration: 1,
        minX,
        maxX,
        minY,
        maxY,
        rank: rank,
      },
    });
    this.trackerAnimationCount++;
    return true;
  }

  addSliderDisappearAnimation(trackerId: string): boolean {
    const tracker = this.trackerManager.getTracker(trackerId);
    if (!tracker || !tracker.slider) {
      return false;
    }
    const anim = tracker.slider.disappearAnim();
    this.animManager.addAnimations({
      id: `Disappear_${trackerId}_${this.trackerAnimationCount}`,
      targetId: trackerId,
      anim,
      type: "SliderDisappear",
      category: "Slider",
      label: `Slider Disappear Animation for ${trackerId}`,
      animFuncInput: { duration: 1 },
    });
    this.trackerAnimationCount++;
    return true;
  }

  addPtSliderDisappearAnimation(trackerId: string): boolean {
    const tracker = this.trackerManager.getPtValueTracker(trackerId);
    if (!tracker || !tracker.slider) {
      return false;
    }
    const anim = tracker.slider.disappearAnim();
    this.animManager.addAnimations({
      id: `Disappear_${trackerId}_${this.trackerAnimationCount}`,
      targetId: trackerId,
      anim,
      type: "PtSliderDisappear",
      category: "PtSlider",
      label: `PtSlider Disappear Animation for ${trackerId}`,
      animFuncInput: { duration: 1 },
    });
    this.trackerAnimationCount++;
    return true;
  }

  animateTracker(
    trackerId: string,
    target: number,
    duration: number = 1,
    easing: string = "inOutQuad",
  ): boolean {
    const trackerMeta = this.trackerManager.getTracker(trackerId);
    if (!trackerMeta) {
      return false;
    }
    const t = trackerMeta.tracker;

    const startValue = t.value;

    // const startValue = trackerMeta.tracker.value;
    const easefunc = easing
      ? easings.eases[easingMap[easing] as keyof typeof easings.eases.in]
      : easings.eases.inOutQuad;
    const timer = createTimer({
      duration: duration * 1000,
      autoplay: false,
      onUpdate: (anim) => {
        const progress = anim.reversed ? 1 - anim.progress : anim.progress;
        const transformedProgress = easefunc(progress);
        const newValue =
          startValue + (target - startValue) * transformedProgress;
        t.value = newValue;
      },
    });

    this.animManager.addAnimations({
      id: `TrackerAnim_${trackerId}_${this.trackerAnimationCount}`,
      targetId: trackerId,
      type: "ValueTracker",
      category: "Tracker",
      label: `Animating ValueTracker ${trackerId} to ${target}`,
      animFuncInput: { target, duration, easing },
      anim: timer,
    });

    this.trackerAnimationCount++;
    return true;
  }
  animatePtTracker(
    trackerId: string,
    { x, y }: { x: number; y: number },
    duration: number = 1,
    easing: string = "inOutQuad",
  ): boolean {
    const trackerMeta = this.trackerManager.getPtValueTracker(trackerId);
    if (!trackerMeta) {
      return false;
    }
    const t = trackerMeta.tracker;

    const startValue = {
      x: t.x.value,
      y: t.y.value,
    };

    // const startValue = trackerMeta.tracker.value;
    const easefunc = easing
      ? easings.eases[easingMap[easing] as keyof typeof easings.eases.in]
      : easings.eases.inOutQuad;
    const timer = createTimer({
      duration: duration * 1000,
      autoplay: false,
      onUpdate: (anim) => {
        const progress = anim.reversed ? 1 - anim.progress : anim.progress;
        const transformedProgress = easefunc(progress);
        const newValue = {
          x: startValue.x + (x - startValue.x) * transformedProgress,
          y: startValue.y + (y - startValue.y) * transformedProgress,
        };
        t.x.value = newValue.x;
        t.y.value = newValue.y;
      },
    });

    this.animManager.addAnimations({
      id: `TrackerAnim_${trackerId}_${this.trackerAnimationCount}`,
      targetId: trackerId,
      type: "PtValueTracker",
      category: "PtTracker",
      label: `Animating ValueTracker ${trackerId} to ${x}, ${y}`,
      animFuncInput: { targetX: x, targetY: y, duration, easing },
      anim: timer,
    });

    this.trackerAnimationCount++;
    return true;
  }
}
