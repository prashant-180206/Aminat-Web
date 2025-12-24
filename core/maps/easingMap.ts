import Konva from "@/lib/konva";

export const easingMap: { [key: string]: typeof Konva.Easings.Linear } = {
  Linear: Konva.Easings.Linear,
  EaseIn: Konva.Easings.EaseIn,
  EaseOut: Konva.Easings.EaseOut,
  EaseInOut: Konva.Easings.EaseInOut,
  BackEaseIn: Konva.Easings.BackEaseIn,
  BackEaseOut: Konva.Easings.BackEaseOut,
  BackEaseInOut: Konva.Easings.BackEaseInOut,
  BounceEaseIn: Konva.Easings.BounceEaseIn,
  BounceEaseOut: Konva.Easings.BounceEaseOut,
  BounceEaseInOut: Konva.Easings.BounceEaseInOut,
  StrongEaseIn: Konva.Easings.StrongEaseIn,
  StrongEaseOut: Konva.Easings.StrongEaseOut,
  StrongEaseInOut: Konva.Easings.StrongEaseInOut,
};
