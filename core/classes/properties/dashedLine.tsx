import Konva from "konva";
import { LineProperties, LineProperty } from "./line";
import SliderInput from "./input/sliderInput";

export interface DashedLineProperties extends LineProperties {
  dashRatio: number;
}
export class DashedLineProperty extends LineProperty {
  protected dashRatio: number = 0.5;
  constructor(mobj: Konva.Line, labelObj: Konva.Text) {
    super(mobj, labelObj);
  }
  override update(prop: Partial<DashedLineProperties>) {
    super.update(prop);
    if (prop.dashRatio !== undefined) {
      const dash = Math.max(1, prop.dashRatio);
      this.mobj.dash([dash, dash]);
    }
  }
  override getUIComponents(): React.ReactNode[] {
    const components = super.getUIComponents();
    components.push(
      <SliderInput
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
    );
    return components;
  }
}
