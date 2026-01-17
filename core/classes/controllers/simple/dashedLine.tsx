import Konva from "konva";
import { LineProperties, LineProperty } from "../simple/line";
import SliderInput from "../input/sliderInput";
import { MDashedLine } from "../../mobjects/simple/dashedLine";
import { FoldVertical } from "lucide-react";

export interface DashedLineProperties extends LineProperties {
  dashRatio: number;
}
export class DashedLineProperty extends LineProperty {
  protected dashRatio: number = 20;
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
              min: 5,
              max: 50,
              step: 1,
            },
          ]}
          icon={<FoldVertical className="h-4 w-4" />}
          message="Dash Ratio"
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
