import Konva from "konva";
import { LineProperties, LineProperty } from "./line";
import SliderInput from "./input/sliderInput";
import { MDashedLine } from "../mobjects/simple/dashedLine";

export interface DashedLineProperties extends LineProperties {
  dashRatio: number;
}
export class DashedLineProperty extends LineProperty {
  protected dashRatio: number = 5;
  constructor(mobj: MDashedLine) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(mobj as any);
    this.update({ dashRatio: this.dashRatio });
  }
  override update(prop: Partial<DashedLineProperties>) {
    super.update(prop);
    if (prop.dashRatio !== undefined) {
      const dash = Math.max(1, prop.dashRatio);
      if (this.shapemobj instanceof Konva.Line)
        this.shapemobj.dash([dash, dash]);
    }
  }
  override getUIComponents(): {
    name: string;
    component: React.ReactNode;
  }[] {
    const components = super.getUIComponents();
    components.push({
      name: "Dash Ratio",

      component: (
        <SliderInput
          key={"Dash Ratio"}
          fields={[
            {
              label: "Dash Ratio",
              value: this.dashRatio,
              onChange: (v) => {
                this.update({ dashRatio: v });
              },
              min: 1,
              max: 20,
              step: 1,
            },
          ]}
        />
      ),
    });
    return components;
  }

  override getData(): DashedLineProperties {
    return {
      ...super.getData(),
      dashRatio: this.dashRatio,
    };
  }
  override setData(data: DashedLineProperties): void {
    super.setData(data);
    this.dashRatio = data.dashRatio;
    this.update(data);
  }
}
