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
      this.mobj.position({
        x: p.x - this.mobj.width() / 2,
        y: p.y - this.mobj.height() / 2,
      });
    }
    if (prop.textData !== undefined) {
      this.textData.update(prop.textData);
    }
  }
  override getUIComponents(): { name: string; component: React.ReactNode }[] {
    return [
      ...super.getUIComponents(),
      { name: "Text Style", component: this.textData.getUIComponent() },
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
    const pos = this.mobj.position();
    this.position = c2p(
      pos.x + this.mobj.width() / 2,
      pos.y + this.mobj.height() / 2
    );
  }
}
