import { MVector } from "../classes/mobjects/geometric/vector";
import { ParametricCurve } from "../classes/mobjects/simple/curve";
import { MDashedLine } from "../classes/mobjects/simple/dashedLine";
import { Dot } from "../classes/mobjects/simple/dot";
import { MLine } from "../classes/mobjects/simple/line";
import { Mobject } from "../types/mobjects";

export function checkLabelAble(mobj: Mobject): boolean {
  return (
    mobj instanceof MLine ||
    mobj instanceof MDashedLine ||
    mobj instanceof MVector ||
    mobj instanceof ParametricCurve ||
    mobj instanceof Dot
  );
}
