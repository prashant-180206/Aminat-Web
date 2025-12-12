// anim/classes/mobjects/simple/parametricCurve.ts
import { CurveProperties } from "@/core/types/properties";
import { p2c } from "@/core/utils/conversion";
import { Konva } from "@/lib/konva";
import { evaluate } from "mathjs";

export class ParametricCurve extends Konva.Line {
  private _properties: CurveProperties;

  constructor(config: Partial<CurveProperties> = {}) {
    super({
      tension: 0.8,
      lineCap: "round",
      lineJoin: "round",
      strokeWidth: 3,
    });

    this._properties = {
      position: { x: 0, y: 0 },
      color: "red",
      scale: 1,
      rotation: 0,
      parameterRange: [0, 2 * Math.PI],
      Xfunc: "t",
      Yfunc: "sin(t)",
      thickness: 3,
      bordercolor: "blue",
      ...config,
    };

    this.updateFromProperties();
    this.name("Curve");
  }

  // Getter/Setter for properties
  get properties(): CurveProperties {
    return { ...this._properties };
  }

  set properties(newProps: Partial<CurveProperties>) {
    Object.assign(this._properties, newProps);
    this.updateFromProperties();
  }

  private updateFromProperties() {
    const {
      position,
      color,
      scale,
      rotation,
      thickness,
      bordercolor,
      parameterRange,
      Xfunc,
      Yfunc,
    } = this._properties;

    // Apply base properties
    this.position(p2c(position.x, position.y));
    this.stroke(bordercolor || color);
    this.strokeWidth(thickness);
    this.scale({ x: scale, y: scale });
    this.rotation(rotation);

    // Generate parametric curve
    this.generateCurve(Xfunc, Yfunc, parameterRange);
  }

  private generateCurve(Xfunc: string, Yfunc: string, range: [number, number]) {
    const [tMin, tMax] = range;
    const samples = 30;
    const points: number[] = [];
    const step = (tMax - tMin) / samples;

    // Get canvas position for centering
    for (let i = 0; i <= samples; i++) {
      const t = tMin + i * step;
      const x = evaluate(Xfunc, { t }) as number;
      const y = evaluate(Yfunc, { t }) as number;

      // Convert math coords to canvas coords, then offset by position
      const canvasX = p2c(x, y).x - this.position().x;
      const canvasY = p2c(x, y).y - this.position().y;

      points.push(canvasX, canvasY);
    }

    this.points(points);
    // this.draw();
  }

  // Convenience methods
  updateFunctions(
    Xfunc: string,
    Yfunc: string,
    range: [number, number] = this._properties.parameterRange
  ) {
    this._properties.Xfunc = Xfunc;
    this._properties.Yfunc = Yfunc;
    this._properties.parameterRange = range;
    this.generateCurve(Xfunc, Yfunc, range);
  }
}
