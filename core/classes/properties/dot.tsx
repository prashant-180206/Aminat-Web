import Konva from "@/lib/konva";
import { Dot } from "../mobjects/simple/dot";
import { BaseProperties, BaseProperty } from "./base";
import { Label, LabelProperty } from "./label";
import SliderInput from "./input/sliderInput";

export interface DotProperties extends BaseProperties {
  radius: number;
  label: Label;
}
export class DotProperty extends BaseProperty {
  protected radius: number = 10;
  protected label: LabelProperty;
  constructor(mobj: Dot) {
    super(mobj.circle);
    this.label = new LabelProperty(mobj.label);
  }
  override update(prop: Partial<DotProperties>): void {
    super.update(prop);
    if (prop.radius !== undefined) {
      this.radius = prop.radius;
      if (this.mobj instanceof Konva.Circle) {
        this.mobj.radius(this.radius);
      }
    }
    if (prop.label !== undefined) {
      this.label.update(prop.label);
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
            onChange: (v) => this.update({ radius: v }),
          },
        ]}
      />
    );
    components.push(this.label.getUIComponent());
    return components;
  }
  override getData(): DotProperties {
    return {
      ...super.getData(),
      radius: this.radius,
      label: this.label.getData(),
    };
  }
  override setData(data: DotProperties): void {
    super.setData(data);
    this.radius = data.radius;
    this.label.setData(data.label);
    this.update(data);
  }
}
