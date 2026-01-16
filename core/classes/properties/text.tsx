import Konva from "konva";
import { BaseProperties, BaseProperty } from "./base";
import { TextDataProperty } from "./textDataProperty";
import { c2p, p2c } from "@/core/utils/conversion";

export interface TextProperties extends BaseProperties {
  textData: {
    fontsize: number;
    fontfamily: string;
    bold: boolean;
    italic: boolean;
    color: string;
  };
}

export class TextProperty extends BaseProperty {
  protected textData: TextDataProperty;

  constructor(mobj: Konva.Text) {
    super(mobj);
    this.textData = new TextDataProperty(mobj);
  }

  override update(prop: Partial<TextProperties>): void {
    super.update(prop);
    if (prop.position) {
      const p = p2c(prop.position.x, prop.position.y);
      this.shapemobj.position({
        x: p.x,
        y: p.y,
      });
    }
    if (prop.textData !== undefined) {
      this.textData.update(prop.textData);
    }
  }
  override getUIComponents(): { name: string; component: React.ReactNode }[] {
    return [
      ...super.getUIComponents(),
      {
        name: "Text Style",
        component: <div>{this.textData.getUIComponent()}</div>,
      },
    ];
  }

  override getData(): TextProperties {
    return {
      ...super.getData(),
      textData: this.textData.getData(),
    };
  }
  override setData(data: TextProperties): void {
    super.setData(data);
    this.update(data);
  }
  override refresh(): void {
    super.refresh();
    const pos = this.shapemobj.position();
    this.position = c2p(pos.x, pos.y);
  }
}
