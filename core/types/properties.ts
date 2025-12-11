export type Point = { x: number; y: number };

export interface BaseProperties {
  position: Point;
  color: string;
  scale: number;
  rotation: number;
}

export interface CurveProperties extends BaseProperties {
  parameterRange: [number, number];
  Xfunc: string;
  Yfunc: string;
  thickness: number;
  bordercolor: string;
}

export interface LineProperties extends BaseProperties {
  start: Point;
  end: Point;
  thickness: number;
  bordercolor: string;
}

export interface CircleProperties extends BaseProperties {
  radius: number;
  bordercolor: string;
  thickness: number;
}
export interface RectangleProperties extends BaseProperties {
  width: number;
  height: number;
  bordercolor: string;
  thickness: number;
  cornerRadius: number;
}
export interface TextProperties extends BaseProperties {
  content: string;
  fontsize: number;
}
export interface PolygonProperties extends BaseProperties {
  points: Point[];
  bordercolor: string;
  thickness: number;
}

export interface DotProperties extends BaseProperties {
  radius: number;
}
