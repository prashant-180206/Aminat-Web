import katex from "katex";
import Konva from "@/lib/konva";
import { AnimGetter } from "../../animation/animgetter";
import { TrackerConnector } from "../../Tracker/helpers/TrackerConnector";
import { BaseProperties, LatexTextProperies } from "@/core/types/properties";
import { Colors } from "@/core/utils/colors";
import { MobjectData } from "@/core/types/file";
import { c2p, p2c } from "@/core/utils/conversion";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/core/config";

export class LatexText extends Konva.Image {
  private isRendering = false;
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _properties: LatexTextProperies = {
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    color: Colors.BG,
    textData: {
      color: Colors.TEXT,
      fontsize: 60,
      fontfamily: "Arial",
      bold: false,
      italic: false,
    },
    zindex: 0,
    opacity: 1,
    LatexContent: "\\int_0^\\infty x^2 dx",
  };

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
    // this.UpdateFromKonvaProperties();
    this.refresh();
    this.position({
      x: DEFAULT_WIDTH / 2 - this.width() / 2,
      y: DEFAULT_HEIGHT / 2 - this.height() / 2,
    });
    this.name("Formula");
  }

  type(): string {
    return this._TYPE;
  }

  // ... rest of the methods (refresh, renderToSVG, etc.)

  /* ---------------- Core Logic ---------------- */

  private async refresh() {
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
    const rawSvg = katex.renderToString(this._properties.LatexContent, {
      output: "mathml",
      displayMode: true,
      throwOnError: false,
    });

    const { w, h } = this.measureMathML(rawSvg);
    console.log("Measured dimensions:", { w, h });

    const { newh, neww } = {
      newh: h * (this._properties.textData.fontsize / 18),
      neww: w * (this._properties.textData.fontsize / 18),
    }; // scale based on font size
    this.width(neww);
    this.height(newh);

    // We inject styles for color and sizing
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width='${neww}pt' height='${newh}pt'>
        <foreignObject width="${neww}pt" height="${newh}pt">
          <span xmlns="http://www.w3.org/1999/xhtml" style="
            font-size: ${this._properties.textData.fontsize}px; 
            color: ${this._properties.textData.color};
            width:100%;
            height:100% ;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: '${this._properties.textData.fontfamily}';
            font-weight: ${this._properties.textData.bold ? "bold" : "lighter"};
            font-style: ${
              this._properties.textData.italic ? "italic" : "normal"
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

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(pos.x, pos.y);
    this._properties.color = this.fill() as string;
    this._properties.scale = this.scaleX();
    this._properties.rotation = this.rotation();
  }

  // Object getter - returns copy to prevent mutation
  get properties(): LatexTextProperies {
    return { ...this._properties };
  }

  // Object setter - accepts full or partial properties object
  set properties(value: Partial<LatexTextProperies>) {
    Object.assign(this._properties, value);
    if (value.color !== undefined) this.fill(value.color);
    if (value.position !== undefined) {
      const newpos = p2c(
        value.position.x ?? this._properties.position.x,
        value.position.y ?? this._properties.position.y
      );
      this.position({
        x: newpos.x - this.width() / 2,
        y: newpos.y - this.height() / 2,
      });
    }
    if (value.opacity !== undefined) this.opacity(value.opacity);
    if (value.scale !== undefined)
      this.scale({ x: value.scale, y: value.scale });
    if (value.rotation !== undefined) this.rotation(value.rotation);
    if (value.zindex !== undefined && this.parent) this.zIndex(value.zindex);
    if (value.textData !== undefined) {
      Object.assign(this._properties.textData, value.textData);
      this.refresh();
    }
    if (value.LatexContent !== undefined) {
      this._properties.LatexContent = value.LatexContent;
      this.refresh();
    }
  }

  storeAsObj(): MobjectData {
    return {
      properties: this._properties,
      id: this.id(),
    };
  }

  loadFromObj(obj: MobjectData) {
    this.properties = obj.properties as BaseProperties;
    this.UpdateFromKonvaProperties();
  }
}
