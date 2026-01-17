import Konva from "konva";
import { BaseProperties, BaseProperty } from "../base/base";
import { NumberInputs } from "../input/dualInput";
import SliderInput from "../input/sliderInput";
import { ColorDisc } from "../input/colordisc";
import { DEFAULT_SCALE } from "@/core/config";
import { c2p } from "@/core/utils/conversion";
import { Colors } from "@/core/utils/colors";
import {
  RulerDimensionLine,
  SquareDashedTopSolid,
  SquareRoundCorner,
} from "lucide-react";

export interface RectangleProperties extends BaseProperties {
  dimensions: {
    width: number;
    height: number;
  };
  bordercolor: string;
  thickness: number;
  cornerRadius: number;
}

export class RectangleProperty extends BaseProperty {
  protected dimensions: { width: number; height: number } = {
    width: 3,
    height: 2,
  };
  protected bordercolor: string = Colors.BORDER;
  protected thickness: number = 2;
  protected cornerRadius: number = 0;

  constructor(mobj: Konva.Rect) {
    super(mobj);
    mobj.stroke(this.bordercolor);
    mobj.strokeWidth(this.thickness);
    (mobj as Konva.Rect).cornerRadius(this.cornerRadius);
    (mobj as Konva.Rect).width(this.dimensions.width);
    (mobj as Konva.Rect).height(this.dimensions.height);
    this.update({
      dimensions: this.dimensions,
      bordercolor: this.bordercolor,
      thickness: this.thickness,
      cornerRadius: this.cornerRadius,
    });
  }
  override update(prop: Partial<RectangleProperties>) {
    super.update(prop);
    if (prop.dimensions !== undefined) {
      this.dimensions = prop.dimensions;
      (this.shapemobj as Konva.Rect).width(
        this.dimensions.width * DEFAULT_SCALE,
      );
      (this.shapemobj as Konva.Rect).height(
        this.dimensions.height * DEFAULT_SCALE,
      );
    }
    if (prop.bordercolor !== undefined) {
      this.bordercolor = prop.bordercolor;
      if (this.shapemobj instanceof Konva.Rect)
        this.shapemobj.stroke(this.bordercolor);
    }
    if (prop.thickness !== undefined) {
      this.thickness = prop.thickness;
      if (this.shapemobj instanceof Konva.Rect)
        this.shapemobj.strokeWidth(this.thickness);
    }
    if (prop.cornerRadius !== undefined) {
      this.cornerRadius = prop.cornerRadius;
      (this.shapemobj as Konva.Rect).cornerRadius(this.cornerRadius);
    }
  }
  override getUIComponents(): { name: string; component: React.ReactNode }[] {
    const components = super.getUIComponents();
    components.push({
      name: "Dimensions",
      component: (
        <NumberInputs
          key={"Dimensions"}
          inputs={[
            {
              label: "Width",
              value: this.dimensions.width,
              onChange: (v) =>
                this.update({
                  dimensions: {
                    width: v,
                    height: this.dimensions.height,
                  },
                }),
            },
            {
              label: "Height",
              value: this.dimensions.height,
              onChange: (v) =>
                this.update({
                  dimensions: {
                    width: this.dimensions.width,
                    height: v,
                  },
                }),
            },
          ]}
          icon={<RulerDimensionLine className="h-4 w-4" />}
          message="Dimensions"
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
      name: "Corner Radius",
      component: (
        <SliderInput
          key={"CornerRadius"}
          fields={[
            {
              label: "Corner Radius",
              value: this.cornerRadius,
              onChange: (v) => this.update({ cornerRadius: v }),
              min: 0,
              max: 50,
              step: 1,
            },
          ]}
          icon={<SquareRoundCorner className="h-4 w-4" />}
          message="Corner Radius"
        />
      ),
    });
    components.push({
      name: "Border Color",
      component: (
        <ColorDisc
          size={8}
          key={"BorderColor"}
          value={this.color}
          onChange={(val) => this.update({ color: val })}
          message="Border Color"
        />
      ),
    });
    return components;
  }
  override getData(): RectangleProperties {
    return {
      ...super.getData(),
      dimensions: this.dimensions,
      bordercolor: this.bordercolor,
      thickness: this.thickness,
      cornerRadius: this.cornerRadius,
    };
  }

  override setData(data: RectangleProperties): void {
    super.setData(data);
    this.dimensions = data.dimensions;
    this.bordercolor = data.bordercolor;
    this.thickness = data.thickness;
    this.cornerRadius = data.cornerRadius;
    this.update(data);
  }

  override refresh(): void {
    super.refresh();
    const pos = this.shapemobj.position();
    this.position = c2p(pos.x, pos.y);
  }
}
