import Konva from "@/lib/konva";
import { LineProperties, LineProperty } from "./line";
import { MVector } from "../mobjects/geometric/vector";
import SliderInput from "./input/sliderInput";

export interface VectorProperties extends LineProperties {
  pointerSize: number;
}

export class VectorProperty extends LineProperty {
  protected pointerSize: number;
  //   protected mobj: Konva.Arrow;

  constructor(mobj: MVector, labelObj: Konva.Text) {
    super(mobj.arrow, labelObj);
    this.mobj = mobj.arrow;
    this.pointerSize = 10;
  }
  override update(prop: Partial<VectorProperties>): void {
    super.update(prop);
    if (prop.pointerSize !== undefined) {
      this.pointerSize = prop.pointerSize;
      if (this.mobj instanceof Konva.Arrow) {
        this.mobj.pointerLength(this.pointerSize);
        this.mobj.pointerWidth(this.pointerSize);
      }
    }
  }
  override getUIComponents(): React.ReactNode[] {
    const components = super.getUIComponents();
    components.push(
      <SliderInput
        fields={[
          {
            label: "Pointer Size",
            value: this.pointerSize,
            onChange: (v) => {
              this.update({ pointerSize: v });
            },
            min: 1,
            max: 50,
            step: 1,
          },
        ]}
      />
    );
    return components;
  }
  override getData(): VectorProperties {
    return {
      ...super.getData(),
      pointerSize: this.pointerSize,
    };
  }
  override setData(data: VectorProperties): void {
    super.setData(data);
    this.pointerSize = data.pointerSize;
    this.update(data);
  }
}
