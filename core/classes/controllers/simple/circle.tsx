import { Colors } from "@/core/utils/colors";
import { BaseProperties, BaseProperty } from "../base/base";
import Konva from "@/lib/konva";
import SliderInput from "../input/sliderInput";
import { ColorDisc } from "../input/colordisc";
import { DEFAULT_SCALE } from "@/core/config";
import { CircleArrowOutDownRight, SquareDashedTopSolid } from "lucide-react";

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
    this.update({
      radius: this.radius,
      bordercolor: this.bordercolor,
      thickness: this.thickness,
    });
  }
  override update(prop: Partial<CircleProperties>): void {
    super.update(prop);
    if (prop.radius !== undefined) {
      this.radius = prop.radius;
      if (this.shapemobj instanceof Konva.Circle)
        this.shapemobj.radius(this.radius * DEFAULT_SCALE);
    }
    if (prop.bordercolor !== undefined) {
      this.bordercolor = prop.bordercolor;
      if (this.shapemobj instanceof Konva.Circle)
        this.shapemobj.stroke(this.bordercolor);
    }
    if (prop.thickness !== undefined) {
      this.thickness = prop.thickness;
      if (this.shapemobj instanceof Konva.Circle)
        this.shapemobj.strokeWidth(this.thickness);
    }
  }

  override getUIComponents(): { name: string; component: React.ReactNode }[] {
    const components = super.getUIComponents();
    components.push({
      name: "Radius",
      component: (
        <SliderInput
          key={"Radius"}
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
          icon={<CircleArrowOutDownRight className="h-4 w-4" />}
          message="Radius"
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
          onChange={(val) => this.update({ bordercolor: val })}
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
              onChange: (v) => {
                this.update({ thickness: v });
              },
              min: 0,
              max: 50,
              step: 1,
            },
          ]}
          icon={<SquareDashedTopSolid className="h-4 w-4" />}
          message="Thickness"
        />
      ),
    });

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
