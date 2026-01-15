import Konva from "konva";
import { BaseProperties, BaseProperty } from "./base";
import { TextDataProperty } from "./textDataProperty";

export interface TextProperties extends BaseProperties {
  textData: {
    content: string;
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
    if (prop.textData !== undefined) {
      this.textData.update(prop.textData);
    }
  }
  override getUIComponents(): React.ReactNode[] {
    return [...super.getUIComponents(), this.textData.getUIComponent()];
  }

  override getData(): TextProperties {
    return {
      ...super.getData(),
      textData: this.textData.getData(),
    };
  }
  override setData(data: TextProperties): void {
    super.setData(data);
    this.textData.setData(data.textData);
    this.update(data);
  }
}
