// import Konva from "@/lib/konva";
import MCircle from "../classes/mobjects/simple/circle";
import { ParametricCurve } from "../classes/mobjects/simple/curve";
import { MRect } from "../classes/mobjects/simple/rect";
import { Dot } from "../classes/mobjects/simple/dot";
// import { MLine } from "../classes/mobjects/simple/MLine";
import { MPolygon } from "../classes/mobjects/simple/polygon";
import { MText } from "../classes/mobjects/simple/text";
import { MVector } from "../classes/mobjects/geometric/vector";
import { MPlane } from "../classes/mobjects/group/plane";
import {
  CaseSensitive,
  ChartSpline,
  Circle,
  DotIcon,
  Grid3x3,
  MoveUpRight,
  PentagonIcon,
  RectangleHorizontal,
  Slash,
} from "lucide-react";
import { MobjectMapType } from "../types/mobjects";
import { MLine } from "../classes/mobjects/simple/line";

const MobjectMap: MobjectMapType = {
  Circle: { func: () => new MCircle("Circle"), name: "Circle", Icon: Circle },
  Curve: {
    func: () => new ParametricCurve("Curve"),
    name: "Curve",
    Icon: ChartSpline,
  },
  Rect: {
    func: () => new MRect("Rect"),
    name: "Rect",
    Icon: RectangleHorizontal,
  },
  Dot: { func: () => new Dot("Dot"), name: "Dot", Icon: DotIcon },
  Line: { func: () => new MLine("Line"), name: "Line", Icon: Slash },
  Polygon: {
    func: () => new MPolygon("Polygon"),
    name: "Polygon",
    Icon: PentagonIcon,
  },
  Text: { func: () => new MText("Text"), name: "Text", Icon: CaseSensitive },
  Vector: {
    func: () => new MVector("Vector"),
    name: "Vector",
    Icon: MoveUpRight,
  },
  Plane: { func: () => new MPlane("Plane"), name: "Plane", Icon: Grid3x3 },
};

export default MobjectMap;
