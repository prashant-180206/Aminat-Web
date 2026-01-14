export type Point = { x: number; y: number };

export interface Label {
  //done
  labelText: string;
  visible: boolean;
  offset: Point;
  fontsize: number;
  color: string;
  position: "start" | "center" | "end";
  opacity: number;
}

export interface BaseProperties {
  //done
  position: Point;
  color: string;
  scale: number;
  rotation: number;
  opacity: number;
  zindex: number;
}

export interface CurveProperties extends BaseProperties {
  //done
  parameterRange: [number, number];
  funcs: {
    Xfunc: string;
    Yfunc: string;
  };
  thickness: number;
  label: Label;
}

export interface LineProperties extends BaseProperties {
  //done
  lineEnds: {
    start: Point;
    end: Point;
  };
  thickness: number;
  label: Label;
}

export interface DashedLineProperties extends LineProperties {
  //done
  dashRatio: number;
}

export interface VectorProperties extends LineProperties {
  //done
  pointerSize: number;
}

export interface CircleProperties extends BaseProperties {
  //done
  radius: number;
  bordercolor: string;
  thickness: number;
}

export interface RectangleProperties extends BaseProperties {
  // done
  dimensions: {
    width: number;
    height: number;
  };
  bordercolor: string;
  thickness: number;
  cornerRadius: number;
}

export interface TextProperties extends BaseProperties {
  // done
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
  // done
  points: Point[];
  bordercolor: string;
  thickness: number;
}

export interface DotProperties extends BaseProperties {
  //done
  radius: number;
  label: Label;
}

export interface PlaneProperties extends BaseProperties {
  // done
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
