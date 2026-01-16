import Konva from "@/lib/konva";
import { TextStyleInput } from "./input/textInput";

interface TextData {
  content: string;
  fontsize: number;
  fontfamily: string;
  bold: boolean;
  italic: boolean;
  color: string;
}

export class TextDataProperty {
  protected fontsize: number = 16;
  protected fontfamily: string = "Arial";
  protected bold: boolean = false;
  protected italic: boolean = false;
  protected color: string = "#fff";
  protected mobj: Konva.Text;
  constructor(mobj: Konva.Text) {
    mobj.text("Sample Text");
    mobj.fontSize(this.fontsize);
    mobj.fontFamily(this.fontfamily);
    mobj.fontStyle(
      `${this.bold ? "bold" : "normal"} ${this.italic ? "italic" : "normal"}`
    );
    mobj.fill(this.color);
    this.mobj = mobj;
  }
  update(prop: Partial<TextData>) {
    if (prop.fontsize !== undefined) {
      this.fontsize = prop.fontsize;
      this.mobj.fontSize(this.fontsize);
    }
    if (prop.fontfamily !== undefined) {
      this.fontfamily = prop.fontfamily;
      this.mobj.fontFamily(this.fontfamily);
    }
    if (prop.bold !== undefined || prop.italic !== undefined) {
      this.bold = prop.bold !== undefined ? prop.bold : this.bold;
      this.italic = prop.italic !== undefined ? prop.italic : this.italic;
      this.mobj.fontStyle(
        `${this.bold ? "bold" : "normal"} ${this.italic ? "italic" : "normal"}`
      );
    }
    if (prop.color !== undefined) {
      this.color = prop.color;
      this.mobj.fill(this.color);
    }
  }

  getUIComponent(): React.ReactNode {
    return (
      <div>
        <TextStyleInput
          value={{
            fontsize: this.fontsize,
            fontfamily: this.fontfamily,
            bold: this.bold,
            italic: this.italic,
            color: this.color,
          }}
          onChange={(val) => {
            this.update(val);
          }}
        />
      </div>
    );
  }

  getData(): Omit<TextData, "content"> {
    return {
      fontsize: this.fontsize,
      fontfamily: this.fontfamily,
      bold: this.bold,
      italic: this.italic,
      color: this.color,
    };
  }
  setData(data: TextData): void {
    this.fontsize = data.fontsize;
    this.fontfamily = data.fontfamily;
    this.bold = data.bold;
    this.italic = data.italic;
    this.color = data.color;
    this.update(data);
  }
}
