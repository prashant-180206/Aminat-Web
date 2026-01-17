import katex from "katex";
import Konva from "@/lib/konva";
import { AnimGetter } from "../../animation/animgetter";
import { TrackerConnector } from "../../Tracker/helpers/TrackerConnector";
import { Colors } from "@/core/utils/colors";
import { MobjectData } from "@/core/types/file";
import {
  LatexTextProperties,
  LatexTextProperty,
} from "../../controllers/text/latex";

export class LatexText extends Konva.Image {
  private isRendering = false;
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  public features: LatexTextProperty;

  private _TYPE: string;

  constructor(type: string, config?: Konva.ImageConfig) {
    super({
      ...(config as Konva.ImageConfig),
      fill: Colors.BG,
      cornerRadius: 10,
    });
    this._TYPE = type;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);
    this.features = new LatexTextProperty(this);
    this.refresh();
    // this.UpdateFromKonvaProperties();
    this.position({
      x: 0,
      y: 0,
    });
    this.name("Formula");
  }

  type(): string {
    return this._TYPE;
  }

  // ... rest of the methods (refresh, renderToSVG, etc.)

  /* ---------------- Core Logic ---------------- */

  async refresh() {
    if (this.isRendering) return;
    this.isRendering = true;

    try {
      const svg = this.renderToSVG();
      const img = await this.svgToImage(svg);
      this.image(img);
      this.getLayer()?.batchDraw();
    } catch (e) {
      console.error("LaTeX rendering failed:", e);
    } finally {
      this.isRendering = false;
    }
  }

  private renderToSVG(): string {
    const rawSvg = katex.renderToString(this.features.getLatex(), {
      output: "mathml",
      displayMode: true,
      throwOnError: false,
    });

    const { w, h } = this.measureMathML(rawSvg);

    const { newh, neww } = {
      newh: h * (this.features.getTextData().fontsize / 18),
      neww: w * (this.features.getTextData().fontsize / 18),
    }; // scale based on font size
    this.width(neww);
    this.height(newh);

    // We inject styles for color and sizing
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width='${neww}pt' height='${newh}pt'>
        <foreignObject width="${neww}pt" height="${newh}pt">
          <span xmlns="http://www.w3.org/1999/xhtml" style="
            font-size: ${this.features.getTextData().fontsize}px; 
            color: ${this.features.getTextData().color};
            width:100%;
            height:100% ;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: '${this.features.getTextData().fontfamily}';
            font-weight: ${
              this.features.getTextData().bold ? "bold" : "lighter"
            };
            font-style: ${
              this.features.getTextData().italic ? "italic" : "normal"
            };
          ">
            ${rawSvg}
          </span>
        </foreignObject>
      </svg>
    `;
  }

  private measureMathML(html: string): { w: number; h: number } {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.visibility = "hidden";
    container.innerHTML = html;

    document.body.appendChild(container);
    const rect = container.getBoundingClientRect();
    document.body.removeChild(container);

    return { w: rect.width, h: rect.height };
  }

  private svgToImage(svg: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      // 1. Encode SVG to Base64
      const encodedSvg = encodeURIComponent(svg)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");

      const header = "data:image/svg+xml;charset=utf-8,";
      const dataUrl = header + encodedSvg;
      img.crossOrigin = "anonymous";

      img.onload = () => resolve(img);
      img.onerror = (err) => {
        console.error("SVG Load Error:", err);
        reject(err);
      };

      img.src = dataUrl;
    });
  }

  /* ---------------- Public API ---------------- */

  // Object getter - returns copy to prevent mutation
  get properties(): LatexTextProperties {
    return { ...this.features.getData() };
  }

  storeAsObj(): MobjectData {
    return {
      properties: this.features.getData(),
      id: this.id(),
    };
  }
  getUIComponents() {
    return this.features.getUIComponents();
  }

  loadFromObj(obj: MobjectData) {
    this.features.setData(obj.properties as LatexTextProperties);
    this.features.refresh();
  }
}
