import katex from "katex";
import Konva from "@/lib/konva";

export interface LatexRenderOptions {
  fontSize?: number;
  color?: string;
}
// Define a type that makes 'image' optional specifically for our constructor
type LatexShapeConfig = LatexRenderOptions & Partial<Konva.ImageConfig>;

export class LatexShape extends Konva.Image {
  private latex: string;
  private renderOptions: Required<LatexRenderOptions>;
  private isRendering = false;

  constructor(latex: string, config?: LatexShapeConfig) {
    // Pass config to super.
    // We cast to 'any' or 'Konva.ImageConfig' because we know we'll provide the image later.
    super({
      ...(config as Konva.ImageConfig),
      fill: "red",
      cornerRadius: 10,
    });

    this.latex = latex;
    this.renderOptions = {
      fontSize: config?.fontSize ?? 24,
      color: config?.color ?? "#000",
    };

    this.refresh();
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
    const rawSvg = katex.renderToString(this.latex, {
      output: "mathml",
      displayMode: true,
      throwOnError: false,
    });

    const { w, h } = this.measureMathML(rawSvg);
    console.log("Measured dimensions:", { w, h });

    const { newh, neww } = {
      newh: h * (this.renderOptions.fontSize / 18),
      neww: w * (this.renderOptions.fontSize / 18),
    }; // scale based on font size

    // We inject styles for color and sizing
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width='${neww}pt' height='${newh}pt'>
        <foreignObject width="${neww}pt" height="${newh}pt">
          <span xmlns="http://www.w3.org/1999/xhtml" style="font-size: ${this.renderOptions.fontSize}px; color: ${this.renderOptions.color};width:100%; height:100% ; display: flex; align-items: center; justify-content: center;">
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
      // Using Blob for better compatibility/performance than btoa

      const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  /* ---------------- Public API ---------------- */

  setLatex(latex: string) {
    if (this.latex !== latex) {
      this.latex = latex;
      this.refresh();
    }
  }

  setRenderOptions(opts: Partial<LatexRenderOptions>) {
    Object.assign(this.renderOptions, opts);
    this.refresh();
  }
}
