import Konva from "@/lib/konva";
import { BaseProperties, BaseProperty } from "../base/base";
import PointsInput from "../input/pointsInput";
import { ColorDisc } from "../input/colordisc";
import SliderInput from "../input/sliderInput";
import { DEFAULT_SCALE } from "@/core/config";
import { SquareDashedTopSolid } from "lucide-react";

type Point = {
  x: number;
  y: number;
};

export interface PolygonProperties extends BaseProperties {
  points: Point[];
  bordercolor: string;
  thickness: number;
}

export class PolygonProperty extends BaseProperty {
  protected points: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ];
  protected bordercolor: string = "#000000";
  protected thickness: number = 2;
  private localPoints: { x: number; y: number }[] = [];

  constructor(mobj: Konva.Shape) {
    super(mobj);
  }
  override update(prop: Partial<PolygonProperties>): void {
    super.update(prop);
    if (prop.points) {
      this.points = prop.points;
      this.localPoints = prop.points.map((pt) => {
        return { x: pt.x * DEFAULT_SCALE, y: -pt.y * DEFAULT_SCALE };
      });
      this.setUpGeometry();
    }
    if (prop.bordercolor !== undefined) {
      this.bordercolor = prop.bordercolor;
      this.setUpGeometry();
    }
    if (prop.thickness !== undefined) {
      this.thickness = prop.thickness;
      this.setUpGeometry();
    }
  }

  private setUpGeometry() {
    if (!(this.shapemobj instanceof Konva.Shape)) return;
    this.shapemobj.sceneFunc((context, shape) => {
      if (this.localPoints.length < 3) return;
      context.beginPath();
      context.moveTo(this.localPoints[0].x, this.localPoints[0].y);
      for (let i = 1; i < this.localPoints.length; i++) {
        context.lineTo(this.localPoints[i].x, this.localPoints[i].y);
      }
      context.closePath();
      context.fillStyle = this.color;
      context.fill();
      context.lineWidth = this.thickness;
      context.strokeStyle = this.bordercolor || this.color;
      context.stroke();
      context.fillStrokeShape(shape);
    });

    this.shapemobj.hitFunc((context, shape) => {
      if (this.localPoints.length < 3) return;
      context.beginPath();
      context.moveTo(this.localPoints[0].x, this.localPoints[0].y);
      for (let i = 1; i < this.localPoints.length; i++) {
        context.lineTo(this.localPoints[i].x, this.localPoints[i].y);
      }
      context.closePath();
      context.fillStrokeShape(shape);
    });
  }
  override getUIComponents(): { name: string; component: React.ReactNode }[] {
    const components = super.getUIComponents();
    components.push({
      name: "Points",
      component: (
        <PointsInput
          key={"Points"}
          points={this.points}
          onChange={(points) => this.update({ points })}
        />
      ),
    });
    components.push({
      name: "Border Color",
      component: (
        <ColorDisc
          size={8}
          key={"BorderColor"}
          value={this.bordercolor}
          onChange={(v) => this.update({ bordercolor: v })}
          message="Border Color"
        />
      ),
    });
    components.push({
      name: "Thickness",
      component: (
        <SliderInput
          key={"Thickness"}
          fields={[
            {
              label: "Thickness",
              value: this.thickness,
              onChange: (v) => this.update({ thickness: v }),
              min: 1,
              max: 20,
              step: 1,
            },
          ]}
          icon={<SquareDashedTopSolid className="h-4 w-4" />}
          message="Thickness"
        />
      ),
    });
    return components;
  }

  override getData(): PolygonProperties {
    return {
      ...super.getData(),
      points: this.points,
      bordercolor: this.bordercolor,
      thickness: this.thickness,
    };
  }
  override setData(data: PolygonProperties): void {
    super.setData(data);
    this.points = data.points;
    this.bordercolor = data.bordercolor;
    this.thickness = data.thickness;
    this.update(data);
  }
}
