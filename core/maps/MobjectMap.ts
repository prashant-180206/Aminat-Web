import Konva from "@/lib/konva";
import MCircle from "../classes/mobjects/simple/circle";
import { ParametricCurve } from "../classes/mobjects/simple/curve";
import { MRect } from "../classes/mobjects/simple/rect";

export type MobjectMapType = {
  [key: string]: () => Konva.Shape;
};

const MobjectMap: MobjectMapType = {
  circle: () => new MCircle(),
  curve: () => new ParametricCurve(),
  rect: () => new MRect(),
};

export default MobjectMap;
