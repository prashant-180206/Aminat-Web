import Konva from "@/lib/konva";
import { c2p } from "@/core/utils/conversion";
import { Colors } from "@/core/utils/colors";

export interface MatrixLabelOptions {
  offset?: { x: number; y: number };
  precision?: number; // How many decimal places to show
}

export class MDynamicMatrixLabel extends Konva.Group {
  private target: Konva.Node;
  private textNode: Konva.Text;
  private brackets: Konva.Text;
  private options: Required<MatrixLabelOptions>;

  constructor(
    target: Konva.Node,
    config: Partial<Konva.TextConfig> & MatrixLabelOptions = {}
  ) {
    super({
      listening: false,
      name: "MatrixLabel",
    });

    this.target = target;
    this.options = {
      offset: config.offset || { x: 20, y: -20 },
      precision: config.precision ?? 1,
    };

    // The Text Node that holds the numbers
    this.textNode = new Konva.Text({
      text: "",
      fontSize: 14,
      fill: config.fill || Colors.TEXT,
      align: "center",
      lineHeight: 1.2,
      ...config,
    });

    // Decorative "brackets" to simulate the matrix look
    this.brackets = new Konva.Text({
      text: "[ ]",
      fontSize: 32, // Larger to encompass two lines
      fill: config.fill || Colors.TEXT,
      fontStyle: "light",
      y: -5, // Slight adjustment for alignment
    });

    this.add(this.brackets);
    this.add(this.textNode);

    // Initial position and content
    this.updateData();

    // Listen to target changes
    this.target.on("dragmove.matrix attrChange.matrix", () =>
      this.updateData()
    );
    this.target.on("destroy", () => this.destroy());
  }

  private updateData() {
    if (!this.target) return;

    // 1. Get current position (converting canvas back to plane coordinates)
    const pos = this.target.position();
    const planePos = c2p(pos.x, pos.y);

    // 2. Format the numbers
    const xStr = planePos.x.toFixed(this.options.precision);
    const yStr = planePos.y.toFixed(this.options.precision);

    // 3. Update Text Content in 2x1 format
    this.textNode.text(`${xStr}\n${yStr}`);

    // 4. Center text inside brackets
    const textWidth = this.textNode.width();
    this.brackets.text(`[${" ".repeat(Math.ceil(textWidth / 4) + 1)}]`);
    this.textNode.x(this.brackets.width() / 2 - textWidth / 2);

    // 5. Position the whole group relative to target
    const targetScale = this.target.scaleX();
    this.position({
      x: pos.x + this.options.offset.x * targetScale,
      y: pos.y + this.options.offset.y * targetScale,
    });

    this.getLayer()?.batchDraw();
  }

  public setOffset(x: number, y: number) {
    this.options.offset = { x, y };
    this.updateData();
  }

  destroy() {
    this.target.off(".matrix");
    super.destroy();
    return this;
  }
}
