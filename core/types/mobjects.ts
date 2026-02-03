import { Table } from "@/core/classes/mobjects/text/table";
import { MArc } from "../classes/mobjects/geometric/arc";
import { DoubleArrow, MVector } from "../classes/mobjects/geometric/vector";
import { MNumberLine } from "../classes/mobjects/group/numberLine";
import { MPlane } from "../classes/mobjects/group/plane";
import MCircle from "../classes/mobjects/simple/circle";
import { ParametricCurve } from "../classes/mobjects/simple/curve";
import { MDashedLine } from "../classes/mobjects/simple/dashedLine";
import { Dot } from "../classes/mobjects/simple/dot";
import { MLine } from "../classes/mobjects/simple/line";
import { MPolygon } from "../classes/mobjects/simple/polygon";
import { MRect } from "../classes/mobjects/simple/rect";
import { DynamicText } from "../classes/mobjects/text/DynamicText";
import { LatexText } from "../classes/mobjects/text/latexText";
import { MText } from "../classes/mobjects/text/text";

export type Mobject =
  | MCircle
  | ParametricCurve
  | MRect
  | Dot
  | MLine
  | MPolygon
  | MText
  | MVector
  | DoubleArrow
  | MPlane
  | LatexText
  | DynamicText
  | MDashedLine
  | MNumberLine
  | MArc
  | Table;

export type MobjectMapType = {
  [key: string]: {
    func: () => Mobject;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Icon: React.FC<any>;
  };
};
