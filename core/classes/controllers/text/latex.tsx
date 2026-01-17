import { BaseProperties, BaseProperty } from "../base/base";
import { c2p, p2c } from "@/core/utils/conversion";
import { LatexText } from "../../mobjects/text/latexText";
import { TextStyleInput } from "../input/textInput";
import { PopoverLatexInput } from "../input/latexInput";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pi } from "lucide-react";

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
    color: "#ff0000",
  };
  protected LatexContent: string = "\\int_0^\\infty x^2 dx";

  constructor(mobj: LatexText) {
    super(mobj);
  }

  override update(prop: Partial<LatexTextProperties>): void {
    super.update(prop);
    if (!(this.shapemobj instanceof LatexText)) return;
    if (prop.position) {
      const p = p2c(prop.position.x, prop.position.y);
      this.shapemobj.position({
        x: p.x,
        y: p.y,
      });
    }
    if (prop.textData !== undefined) {
      this.textData = { ...this.textData, ...prop.textData };
      this.shapemobj.refresh();
    }
    if (prop.LatexContent !== undefined) {
      this.LatexContent = prop.LatexContent;
      this.shapemobj.refresh();
    }
  }
  override getUIComponents(): { name: string; component: React.ReactNode }[] {
    const com = super.getUIComponents();
    com.push({
      name: "Text Style",
      component: (
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              {" "}
              <TextStyleInput
                key={"TextStyle"}
                value={this.textData}
                onChange={(newStyle) => {
                  this.update({ textData: { ...this.textData, ...newStyle } });
                }}
                isSvg
              />
            </div>
          </TooltipTrigger>
          <TooltipContent> Text Style</TooltipContent>
        </Tooltip>
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
          icon={<Pi className="h-4 w-4" />}
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
    const pos = this.shapemobj.position();
    this.position = c2p(pos.x, pos.y);
  }

  getTextData() {
    return { ...this.textData };
  }
  getLatex() {
    return this.LatexContent;
  }
}
