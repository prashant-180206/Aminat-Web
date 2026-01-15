import Konva from "konva";
import { BaseProperties, BaseProperty } from "./base";
import { NumberInputs } from "./input/dualInput";
import SliderInput from "./input/sliderInput";
import { ColorDisc } from "./input/colordisc";

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
    width: 100,
    height: 50,
  };
  protected bordercolor: string = "#000000";
  protected thickness: number = 2;
  protected cornerRadius: number = 0;

  constructor(mobj: Konva.Rect) {
    super(mobj);
    mobj.stroke(this.bordercolor);
    mobj.strokeWidth(this.thickness);
    (mobj as Konva.Rect).cornerRadius(this.cornerRadius);
    (mobj as Konva.Rect).width(this.dimensions.width);
    (mobj as Konva.Rect).height(this.dimensions.height);
  }
  override update(prop: Partial<RectangleProperties>) {
    super.update(prop);
    if (prop.dimensions !== undefined) {
      this.dimensions = prop.dimensions;
      (this.mobj as Konva.Rect).width(this.dimensions.width);
      (this.mobj as Konva.Rect).height(this.dimensions.height);
    }
    if (prop.bordercolor !== undefined) {
      this.bordercolor = prop.bordercolor;
      if (this.mobj instanceof Konva.Rect) this.mobj.stroke(this.bordercolor);
    }
    if (prop.thickness !== undefined) {
      this.thickness = prop.thickness;
      if (this.mobj instanceof Konva.Rect)
        this.mobj.strokeWidth(this.thickness);
    }
    if (prop.cornerRadius !== undefined) {
      this.cornerRadius = prop.cornerRadius;
      (this.mobj as Konva.Rect).cornerRadius(this.cornerRadius);
    }
  }
  override getUIComponents(): React.ReactNode[] {
    const components = super.getUIComponents();
    components.push(
      <NumberInputs
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
        icon={<>H</>}
      />
    );
    components.push(
      <SliderInput
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
      />
    );
    components.push(
      <SliderInput
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
      />
    );
    components.push(
      <ColorDisc
        value={this.color}
        onChange={(val) => this.update({ color: val })}
      />
    );
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
}
