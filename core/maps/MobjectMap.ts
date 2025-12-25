// import Konva from "@/lib/konva";
import MCircle from "../classes/mobjects/simple/circle";
import { ParametricCurve } from "../classes/mobjects/simple/curve";
import { MRect } from "../classes/mobjects/simple/rect";
import { Dot } from "../classes/mobjects/simple/dot";
import { MLine } from "../classes/mobjects/simple/line";
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

const MobjectMap: MobjectMapType = {
  circle: { func: () => new MCircle(), name: "Circle", Icon: Circle },
  curve: {
    func: () => new ParametricCurve(),
    name: "Curve",
    Icon: ChartSpline,
  },
  rect: { func: () => new MRect(), name: "Rect", Icon: RectangleHorizontal },
  dot: { func: () => new Dot(), name: "Dot", Icon: DotIcon },
  line: { func: () => new MLine(), name: "Line", Icon: Slash },
  polygon: { func: () => new MPolygon(), name: "Polygon", Icon: PentagonIcon },
  text: { func: () => new MText(), name: "Text", Icon: CaseSensitive },
  vector: { func: () => new MVector(), name: "Vector", Icon: MoveUpRight },
  plane: { func: () => new MPlane(), name: "Plane", Icon: Grid3x3 },
};

export default MobjectMap;
