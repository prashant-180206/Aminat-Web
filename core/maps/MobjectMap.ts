// import Konva from "@/lib/konva";
import MCircle from "../classes/mobjects/simple/circle";
import { ParametricCurve } from "../classes/mobjects/simple/curve";
import { MRect } from "../classes/mobjects/simple/rect";
import { Dot } from "../classes/mobjects/simple/dot";
// import { MLine } from "../classes/mobjects/simple/MLine";
import { MPolygon } from "../classes/mobjects/simple/polygon";
import { MText } from "../classes/mobjects/text/text";
import { DoubleArrow, MVector } from "../classes/mobjects/geometric/vector";
import { MPlane } from "../classes/mobjects/group/plane";
import {
  Axis3d,
  CaseSensitive,
  ChartSpline,
  Circle,
  DotIcon,
  Grid3x3,
  LoaderCircle,
  MoveDiagonal,
  MoveUpRight,
  PentagonIcon,
  RectangleHorizontal,
  Slash,
  SquareFunction,
  TextInitial,
  TriangleDashed,
} from "lucide-react";
import { MobjectMapType } from "../types/mobjects";
import { MLine } from "../classes/mobjects/simple/line";
import { LatexText } from "../classes/mobjects/text/latexText";
import { DynamicText } from "../classes/mobjects/text/DynamicText";
import { MDashedLine } from "../classes/mobjects/simple/dashedLine";
import { MNumberLine } from "../classes/mobjects/group/numberLine";
import { MArc } from "../classes/mobjects/geometric/arc";

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
  DashedLine: {
    func: () => new MDashedLine("DashedLine"),
    name: "DashedLine",
    Icon: TriangleDashed,
  },
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

  DoubleArrow: {
    func: () => new DoubleArrow("DoubleArrow"),
    name: "DoubleArrow",
    Icon: MoveDiagonal,
  },
  Plane: { func: () => new MPlane("Plane"), name: "Plane", Icon: Grid3x3 },
  Formula: {
    func: () => new LatexText("Formula"),
    name: "Formula",
    Icon: SquareFunction,
  },
  DText: {
    func: () => new DynamicText("DText"),
    name: "DText",
    Icon: TextInitial,
  },
  NumberLine: {
    func: () => new MNumberLine("NumberLine"),
    name: "NumberLine",
    Icon: Axis3d,
  },
  Arc: {
    func: () => new MArc("Arc"),
    name: "Arc",
    Icon: LoaderCircle,
  },
};

export default MobjectMap;
