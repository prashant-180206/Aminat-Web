import { BaseProperties, BaseProperty } from "./base";
import { c2p, p2c } from "@/core/utils/conversion";
import { LatexText } from "../mobjects/text/latexText";
import { TextStyleInput } from "./input/textInput";
import { PopoverLatexInput } from "./input/latexInput";

export interface LatexTextProperties extends BaseProperties {
  textData: {
    fontsize: number;
    fontfamily: string;
    bold: boolean;
    italic: boolean;
    color: string;
  };
  LatexContent: string;
}

export class LatexTextProperty extends BaseProperty {
  protected textData: {
    fontsize: number;
    fontfamily: string;
    bold: boolean;
    italic: boolean;
    color: string;
  } = {
    fontsize: 60,
    fontfamily: "Arial",
    bold: false,
    italic: false,
    color: "#000000",
  };
  protected LatexContent: string = "\\int_0^\\infty x^2 dx";

  constructor(mobj: LatexText) {
    super(mobj);
  }

  override update(prop: Partial<LatexTextProperties>): void {
    super.update(prop);
    if (!(this.mobj instanceof LatexText)) return;
    if (prop.position) {
      const p = p2c(prop.position.x, prop.position.y);
      this.mobj.position({
        x: p.x - this.mobj.width() / 2,
        y: p.y - this.mobj.height() / 2,
      });
    }
    if (prop.textData !== undefined) {
      this.textData = { ...this.textData, ...prop.textData };
      this.mobj.refresh();
    }
    if (prop.LatexContent !== undefined) {
      this.LatexContent = prop.LatexContent;
    }
  }
  override getUIComponents(): { name: string; component: React.ReactNode }[] {
    const com = super.getUIComponents();
    com.push({
      name: "Text Style",
      component: (
        <TextStyleInput
          key={"TextStyle"}
          value={this.textData}
          onChange={(newStyle) => {
            this.update({ textData: { ...newStyle, ...this.textData } });
          }}
        />
      ),
    });
    com.push({
      name: "LaTeX Content",
      component: (
        <PopoverLatexInput
          key={"LatexContent"}
          label="LaTeX"
          value={this.LatexContent}
          onChange={(val) => {
            this.update({ LatexContent: val });
          }}
        />
      ),
    });
    return com;
  }

  override getData(): LatexTextProperties {
    return {
      ...super.getData(),
      textData: this.textData,
      LatexContent: this.LatexContent,
    };
  }
  override setData(data: LatexTextProperties): void {
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

  getTextData() {
    return { ...this.textData };
  }
  getLatex() {
    return this.LatexContent;
  }
}
