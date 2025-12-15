// anim/classes/mobjects/simple/polygon.ts
import { Point, PolygonProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";

export class MPolygon extends Konva.Shape {
  private _properties: PolygonProperties;

  constructor(config: Partial<PolygonProperties> = {}) {
    super({
      lineCap: "round",
      lineJoin: "round",
      draggable: true,
    });

    this._properties = {
      position: { x: 0, y: 0 },
      color: "blue",
      scale: 1,
      rotation: 0,
      points: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ],
      bordercolor: "black",
      thickness: 3,
      zindex: 0,
      opacity: 1,
      ...config,
    };

    this.updateFromProperties();
    this.name("Polygon");
  }

  // Getter/Setter for properties
  get properties(): PolygonProperties {
    return { ...this._properties };
  }

  set properties(newProps: Partial<PolygonProperties>) {
    Object.assign(this._properties, newProps);
    this.updateFromProperties();
  }

  private updateFromProperties() {
    const {
      position,
      color,
      scale = 1,
      rotation = 0,
      points,
      thickness = 1,
      bordercolor,
      opacity,
      zindex,
    } = this._properties;

    // set transform properties on the node (Konva applies transforms outside sceneFunc)
    const pos = p2c(position.x, position.y);
    this.setAttrs({
      x: pos.x,
      y: pos.y,
      rotation,
      scaleX: scale,
      scaleY: scale,
      draggable: true,
      stroke: bordercolor || color,
      strokeWidth: thickness,
      fill: color,
      listening: true,
      opacity: opacity,
      zIndex: zindex,
    });

    // Build local points array in pixel coordinates relative to the node origin.
    // Option A: treat your points as normalized coordinates and convert with p2c.
    // Option B: treat your points as already pixel-local. Below uses p2c to convert.
    const localPoints: number[] = [];
    for (let i = 0; i < points.length; ++i) {
      const px = p2c(points[i].x, points[i].y);
      // since node position is already at pos, convert to local by subtracting pos
      localPoints.push(px.x - pos.x, px.y - pos.y);
    }

    // sceneFunc: draw using localPoints (local coordinate space)
    this.sceneFunc((context, shape) => {
      if (localPoints.length === 0) return;

      context.beginPath();
      context.moveTo(localPoints[0], localPoints[1]);
      for (let i = 2; i < localPoints.length; i += 2) {
        context.lineTo(localPoints[i], localPoints[i + 1]);
      }
      context.closePath();

      context.fillStyle = color;
      context.fill();

      context.lineWidth = thickness;
      context.strokeStyle = bordercolor || color;
      context.stroke();

      context.fillStrokeShape(shape);
    });

    // hitFunc must reproduce the *same* path in the *same* local coords
    this.hitFunc((context, shape) => {
      if (localPoints.length === 0) return;

      context.beginPath();
      context.moveTo(localPoints[0], localPoints[1]);
      for (let i = 2; i < localPoints.length; i += 2) {
        context.lineTo(localPoints[i], localPoints[i + 1]);
      }
      context.closePath();

      // fillStrokeShape here so Konva can detect hits inside the polygon.
      context.fillStrokeShape(shape);
    });

    // ask layer to redraw (if present)
    const layer = this.getLayer();
    if (layer) layer.batchDraw();
  }

  // Convenience: Add point to polygon
  addPoint(point: Point) {
    this._properties.points.push(point);
    this.updateFromProperties();
  }

  // Convenience: Set points directly
  setPoints(points: Point[]) {
    this._properties.points = points;
    this.updateFromProperties();
  }

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(pos.x, pos.y);
    // this._properties.thickness = this.strokeWidth();
    // this._properties.color = this.fill() as string;
    // this._properties.bordercolor = this.stroke() as string;
    this._properties.scale = this.scaleX();
    this._properties.rotation = this.rotation();
    // this._properties.opacity = this.opacity();/
    // this._properties.zindex = this.zIndex();
  }
}
