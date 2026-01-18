import { BaseProperties, BaseProperty } from "../base/base";
import { TextDataProperty } from "../base/textDataProperty";
import { c2p, p2c } from "@/core/utils/conversion";
import { MText } from "../../mobjects/text/text";
import { Colors } from "@/core/utils/colors";

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

  constructor(mobj: MText) {
    super(mobj.bgRect, mobj);
    this.update({ color: Colors.BG });
    this.textData = new TextDataProperty(mobj.textNode);
  }

  override update(prop: Partial<TextProperties>): void {
    super.update(prop);
    if (prop.position) {
      const p = p2c(prop.position.x, prop.position.y);
      this.actualMobj.position({
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
    const pos = this.actualMobj.position();
    this.position = c2p(pos.x, pos.y);
  }
}
