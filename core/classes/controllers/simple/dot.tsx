import Konva from "@/lib/konva";
import { Dot } from "../../mobjects/simple/dot";
import { BaseProperties, BaseProperty } from "../base/base";
import { Label, LabelProperty } from "../base/label";
import SliderInput from "../input/sliderInput";
import { c2p } from "@/core/utils/conversion";
import { CircleArrowOutDownRight } from "lucide-react";

export interface DotProperties extends BaseProperties {
  radius: number;
  label: Label;
}
export class DotProperty extends BaseProperty {
  protected radius: number = 10;
  protected label: LabelProperty;
  protected labelobj: Konva.Text;
  constructor(mobj: Dot) {
    super(mobj.circle, mobj);
    this.label = new LabelProperty(mobj.label);
    mobj.circle.radius(this.radius);
    this.labelobj = mobj.label;
  }

  private changeLabel() {
    const text = this.label.defaultText;
    const updatedLine = text
      .replace("posx", this.position.x.toFixed(2))
      .replace("posy", this.position.y.toFixed(2));
    this.labelobj.text(updatedLine);
  }
  override update(prop: Partial<DotProperties>): void {
    super.update(prop);
    if (prop.position !== undefined && this.label) {
      this.changeLabel();
    }
    if (prop.radius !== undefined) {
      this.radius = prop.radius;
      if (this.shapemobj instanceof Konva.Circle) {
        this.shapemobj.radius(this.radius);
      }
    }
    if (prop.label !== undefined) {
      this.label.update(prop.label);
      let txt = this.label.getData().labelText;
      txt = txt.replace(/valx/g, this.position.x.toFixed(2));
      txt = txt.replace(/valy/g, this.position.y.toFixed(2));
      this.labelobj.text(txt);
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
              onChange: (v) => this.update({ radius: v }),
              min: 0,
              max: 100,
              step: 1,
            },
          ]}
          icon={<CircleArrowOutDownRight className="h-4 w-4" />}
          message="Radius"
        />
      ),
    });
    components.push({
      name: "Label",
      component: this.label.getUIComponent(),
    });
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

  override refresh(): void {
    const pos = this.actualMobj.position();
    this.position = c2p(pos.x, pos.y);
    this.scale = this.actualMobj.scaleX();
    this.rotation = this.actualMobj.rotation();
  }
}
