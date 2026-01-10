import katex from "katex";
import Konva from "konva";

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
      // strict: "ignore",
    });

    const { w, h } = this.measureMathML(rawSvg);
    console.log("Measured dimensions:", { w, h });

    // We inject styles for color and sizing
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width='${w * 2}pt' height='${
      h * 2
    }pt'>
        <foreignObject width="${w * 2}pt" height="${h * 2}pt">
          <span xmlns="http://www.w3.org/1999/xhtml" 
               style="font-size: ${this.renderOptions.fontSize}px; color: ${
      this.renderOptions.color
    };">
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
