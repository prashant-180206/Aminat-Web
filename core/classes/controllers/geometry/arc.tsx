import React from "react";
import Konva from "@/lib/konva";
import { BaseProperties, BaseProperty } from "../base/base";
import { Label, LabelProperty } from "../base/label";
import SliderInput from "../input/sliderInput";
import { DEFAULT_SCALE } from "@/core/config";
import { Circle, SquareDashedTopSolid } from "lucide-react";
import { MArc } from "../../mobjects/geometric/arc";

export interface ArcProperties extends BaseProperties {
  radius: number;
  startAngle: number;
  endAngle: number;
  thickness: number;
  label: Label;
}

export class ArcProperty extends BaseProperty {
  protected radius: number = 2;
  protected startAngle: number = 0;
  protected endAngle: number = 90;
  protected thickness: number = 6;
  protected label: LabelProperty;
  protected labelobj: Konva.Text;

  constructor(mobj: MArc) {
    // Pass the line shape and the group mobject to Base
    super(mobj.line, mobj);
    this.labelobj = mobj.label;
    this.label = new LabelProperty(mobj.label);

    this.update({
      radius: this.radius,
      startAngle: this.startAngle,
      endAngle: this.endAngle,
      thickness: this.thickness,
      label: this.label.getData(),
    });
  }

  private calculatePoints(): number[] {
    const points: number[] = [];
    const step = 10; // Degree increment for points

    // Ensure we draw in the correct direction
    const start = this.startAngle;
    const end = this.endAngle;

    for (let i = start; i <= end; i += step) {
      const rad = (i * Math.PI) / 180;
      points.push(this.radius * Math.cos(rad) * DEFAULT_SCALE);
      points.push(this.radius * Math.sin(rad) * -DEFAULT_SCALE);
    }

    // Ensure the path reaches the exact end angle
    const lastRad = (end * Math.PI) / 180;
    points.push(this.radius * Math.cos(lastRad) * DEFAULT_SCALE);
    points.push(this.radius * Math.sin(lastRad) * -DEFAULT_SCALE);

    return points;
  }

  private changeLabel() {
    const text = this.label.defaultText;
    const updatedLine = text
      .replace(
        "angle",
        (this.endAngle - this.startAngle).toFixed(0).toString() + "°",
      )
      .replace(
        "pirad",
        ((this.endAngle - this.startAngle) / 180).toFixed(2).toString() +
          "∏ rad",
      )
      .replace(
        "radian",
        (((this.endAngle - this.startAngle) * Math.PI) / 180)
          .toFixed(2)
          .toString() + " rad",
      );
    this.labelobj.text(updatedLine);
  }

  private updateLabelPosition() {
    const midAngle = (this.startAngle + this.endAngle) / 2;
    const rad = (midAngle * Math.PI) / 180;

    // Calculate the logical center-point of the arc for the label
    const x = this.radius * Math.cos(rad) * DEFAULT_SCALE;
    const y = this.radius * Math.sin(rad) * -DEFAULT_SCALE;

    this.label.setPosCoordinateMap({
      center: { x, y },
      start: {
        x:
          this.radius *
          Math.cos((this.startAngle * Math.PI) / 180) *
          DEFAULT_SCALE,
        y:
          this.radius *
          Math.sin((this.startAngle * Math.PI) / 180) *
          -DEFAULT_SCALE,
      },
      end: {
        x:
          this.radius *
          Math.cos((this.endAngle * Math.PI) / 180) *
          DEFAULT_SCALE,
        y:
          this.radius *
          Math.sin((this.endAngle * Math.PI) / 180) *
          -DEFAULT_SCALE,
      },
    });
  }

  override update(prop: Partial<ArcProperties>) {
    super.update(prop);

    if (prop.radius !== undefined) this.radius = prop.radius;
    if (prop.startAngle !== undefined) {
      this.startAngle = prop.startAngle;
      this.changeLabel();
    }
    if (prop.endAngle !== undefined) {
      this.endAngle = prop.endAngle;
      this.changeLabel();
    }
    if (
      prop.radius !== undefined ||
      prop.startAngle !== undefined ||
      prop.endAngle !== undefined
    ) {
      (this.shapemobj as Konva.Line).points(this.calculatePoints());
      this.updateLabelPosition();
    }

    if (prop.thickness !== undefined) {
      this.thickness = prop.thickness;
      if (this.shapemobj instanceof Konva.Line)
        this.shapemobj.strokeWidth(this.thickness);
    }

    if (prop.label !== undefined) {
      this.label.update(prop.label);
    }
  }

  override getUIComponents() {
    const components = super.getUIComponents();

    components.push({
      name: "Arc Geometry",
      component: (
        <SliderInput
          key={"ArcGeo"}
          fields={[
            {
              label: "Radius",
              value: this.radius,
              onChange: (v) => this.update({ radius: v }),
              min: 0.1,
              max: 10,
              step: 0.1,
            },
            {
              label: "Start ∠",
              value: this.startAngle,
              onChange: (v) => this.update({ startAngle: v }),
              min: -360,
              max: 360,
              step: 1,
            },
            {
              label: "End ∠",
              value: this.endAngle,
              onChange: (v) => this.update({ endAngle: v }),
              min: -360,
              max: 360,
              step: 1,
            },
          ]}
          icon={<Circle className="h-4 w-4" />}
          message="Adjust Arc"
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

    components.push({
      name: "Label",
      component: this.label.getUIComponent(),
    });

    return components;
  }

  override getData(): ArcProperties {
    return {
      ...super.getData(),
      radius: this.radius,
      startAngle: this.startAngle,
      endAngle: this.endAngle,
      thickness: this.thickness,
      label: this.label.getData(),
    };
  }
}
