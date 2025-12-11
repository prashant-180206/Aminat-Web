import Konva from "@/lib/konva";
import MCircle from "../classes/mobjects/simple/circle";
import { ParametricCurve } from "../classes/mobjects/simple/curve";
import { MRect } from "../classes/mobjects/simple/rect";
import { Dot } from "../classes/mobjects/simple/dot";
import { MLine } from "../classes/mobjects/simple/line";
import { MPolygon } from "../classes/mobjects/simple/polygon";
import { MText } from "../classes/mobjects/simple/text";
import { MVector } from "../classes/mobjects/geometric/vector";
import { MPlane } from "../classes/mobjects/group/plane";

export type MobjectMapType = {
  [key: string]: () => Konva.Node;
};

const MobjectMap: MobjectMapType = {
  circle: () => new MCircle(),
  curve: () => new ParametricCurve(),
  rect: () => new MRect(),
  dot: () => new Dot(),
  line: () => new MLine(),
  polygon: () => new MPolygon(),
  text: () => new MText(),
  vector: () => new MVector(),
  plane: () => new MPlane(),
};

export default MobjectMap;
