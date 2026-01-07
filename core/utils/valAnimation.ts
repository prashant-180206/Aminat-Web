import { createTimer, easings } from "animejs";
import { ValueTracker } from "../classes/Tracker/valuetracker";
import { PtValueTracker } from "../classes/Tracker/ptValuetracker";

export const getAnimationforTracker = (
  t: ValueTracker,
  target: number,
  duration: number = 1
) => {
  const startValue = t.value;
  return createTimer({
    duration: duration * 1000,
    autoplay: false,
    onUpdate: (anim) => {
      const progress = anim.progress;
      const transformedProgress = easings.eases.inOutQuad(progress);
      const newValue = startValue + (target - startValue) * transformedProgress;
      t.value = newValue;
    },
  });
};

export const getAnimationforPtTracker = (
  t: PtValueTracker,
  target: { x: number; y: number },
  duration: number = 1
) => {
  const startX = t.x.value;
  const startY = t.y.value;
  return createTimer({
    duration: duration * 1000,
    autoplay: false,
    onUpdate: (anim) => {
      const progress = anim.progress;
      const transformedProgress = easings.eases.inOutQuad(progress);
      const newX = startX + (target.x - startX) * transformedProgress;
      const newY = startY + (target.y - startY) * transformedProgress;
      t.x.value = newX;
      t.y.value = newY;
    },
  });
};
