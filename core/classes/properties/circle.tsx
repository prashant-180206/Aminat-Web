import { Colors } from "@/core/utils/colors";
import { BaseProperties, BaseProperty } from "./base";
import Konva from "@/lib/konva";
import SliderInput from "./input/sliderInput";
import { ColorDisc } from "./input/colordisc";
import { DEFAULT_SCALE } from "@/core/config";

export interface CircleProperties extends BaseProperties {
  radius: number;
  bordercolor: string;
  thickness: number;
}

/* The CircleProperty class in TypeScript React manages properties for a Konva Circle shape, allowing
for updates and UI components customization. */
export class CircleProperty extends BaseProperty {
  protected radius: number = 1;
  protected bordercolor: string = Colors.BORDER;
  protected thickness: number = 1;
  constructor(mobj: Konva.Circle) {
    super(mobj);
  }
  override update(prop: Partial<CircleProperties>): void {
    super.update(prop);
    if (prop.radius !== undefined) {
      this.radius = prop.radius;
      if (this.mobj instanceof Konva.Circle)
        this.mobj.radius(this.radius * DEFAULT_SCALE);
    }
    if (prop.bordercolor !== undefined) {
      this.bordercolor = prop.bordercolor;
      if (this.mobj instanceof Konva.Circle) this.mobj.stroke(this.bordercolor);
    }
    if (prop.thickness !== undefined) {
      this.thickness = prop.thickness;
      if (this.mobj instanceof Konva.Circle)
        this.mobj.strokeWidth(this.thickness);
    }
  }

  override getUIComponents(): React.ReactNode[] {
    const components = super.getUIComponents();
    components.push(
      <SliderInput
        fields={[
          {
            label: "Radius",
            value: this.radius,
            onChange: (v) => {
              this.update({ radius: v });
            },
            min: 0.1,
            max: 10,
            step: 0.1,
          },
        ]}
      />
    );
    components.push(
      <ColorDisc
        value={this.bordercolor}
        onChange={(val) => this.update({ bordercolor: val })}
      />
    );
    components.push(
      <SliderInput
        fields={[
          {
            label: "Thickness",
            value: this.thickness,
            onChange: (v) => {
              this.update({ thickness: v });
            },
            min: 0,
            max: 50,
            step: 1,
          },
        ]}
      />
    );

    // Add Circle specific UI components here if needed
    return components;
  }

  override getData(): CircleProperties {
    return {
      ...super.getData(),
      radius: this.radius,
      bordercolor: this.bordercolor,
      thickness: this.thickness,
    };
  }
  override setData(data: BaseProperties): void {
    super.setData(data);
    const circleData = data as CircleProperties;
    this.update(circleData);
  }
}
