export type Point = { x: number; y: number };

export interface Label {
  labelText: string;
  visible: boolean;
  offset: Point;
  fontsize: number;
  color: string;
  position: "start" | "center" | "end";
}

export interface BaseProperties {
  position: Point;
  color: string;
  scale: number;
  rotation: number;
  opacity: number;
  zindex: number;
}

export interface CurveProperties extends BaseProperties {
  parameterRange: [number, number];
  funcs: {
    Xfunc: string;
    Yfunc: string;
  };
  thickness: number;
  label: Label;
}

export interface LineProperties extends BaseProperties {
  lineEnds: {
    start: Point;
    end: Point;
  };
  thickness: number;
  label: Label;
}

export interface DashedLineProperties extends LineProperties {
  dashRatio: number;
}

export interface VectorProperties extends LineProperties {
  pointerSize: number;
}

export interface CircleProperties extends BaseProperties {
  radius: number;
  bordercolor: string;
  thickness: number;
}

export interface RectangleProperties extends BaseProperties {
  dimensions: {
    width: number;
    height: number;
  };
  bordercolor: string;
  thickness: number;
  cornerRadius: number;
}

export interface TextProperties extends BaseProperties {
  textData: {
    content: string;
    fontsize: number;
    fontfamily: string;
    bold: boolean;
    italic: boolean;
    color: string;
  };
}

export interface DynamicTextProperties extends BaseProperties {
  textData: {
    content: string;
    fontsize: number;
    fontfamily: string;
    bold: boolean;
    italic: boolean;
    color: string;
    val1: number;
    val2: number;
  };
}

export type LatexTextProperies = Omit<TextProperties, "textData"> & {
  textData: Omit<TextProperties["textData"], "content">;
  LatexContent: string;
};

export interface PolygonProperties extends BaseProperties {
  points: Point[];
  bordercolor: string;
  thickness: number;
}

export interface DotProperties extends BaseProperties {
  radius: number;
  label: Label;
}

export interface PlaneProperties extends BaseProperties {
  dimensions: {
    width: number;
    height: number;
  };
  ranges: {
    xrange: [number, number, number];
    yrange: [number, number, number];
  };
  gridthickness: number;
  axissthickness: number;
  axiscolor: string;
  showgrid: boolean;
  showlabels: boolean;
  labelsize: number;
  labelcolor: string;
}
export interface NumberLineProperties extends BaseProperties {
  range: [number, number, number]; // [min, max, step]
  axissthickness: number;
  showlabels: boolean;
  labelsize: number;
  labelcolor: string;
}
