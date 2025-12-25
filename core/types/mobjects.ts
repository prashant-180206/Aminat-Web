import { MVector } from "../classes/mobjects/geometric/vector";
import { MPlane } from "../classes/mobjects/group/plane";
import MCircle from "../classes/mobjects/simple/circle";
import { ParametricCurve } from "../classes/mobjects/simple/curve";
import { Dot } from "../classes/mobjects/simple/dot";
import { MLine } from "../classes/mobjects/simple/line";
import { MPolygon } from "../classes/mobjects/simple/polygon";
import { MRect } from "../classes/mobjects/simple/rect";
import { MText } from "../classes/mobjects/simple/text";

export type Mobject =
  | MCircle
  | ParametricCurve
  | MRect
  | Dot
  | MLine
  | MPolygon
  | MText
  | MVector
  | MPlane;

export type MobjectMapType = {
  [key: string]: {
    func: () => Mobject;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Icon: React.FC<any>;
  };
};
