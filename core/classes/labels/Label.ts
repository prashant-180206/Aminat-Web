import Konva from "@/lib/konva";
// import { p2c } from "@/core/utils/conversion";
import { Colors } from "@/core/utils/colors";

export interface LabelOptions {
  offset?: { x: number; y: number }; // Offset in canvas units
  syncRotation?: boolean; // Should text rotate with the shape?
  padding?: number;
}

export class MLabel extends Konva.Text {
  private target: Konva.Node;
  private options: Required<LabelOptions>;

  constructor(
    target: Konva.Node,
    text: string,
    config: Partial<Konva.TextConfig> & LabelOptions = {}
  ) {
    // Default Konva Text settings
    const textConstantConfig = {
      text: text,
      fontSize: 16,
      fill: Colors.TEXT,
      listening: false, // Usually labels shouldn't block clicks to the shape
      ...config,
    };

    super(textConstantConfig);

    this.target = target;
    this.options = {
      offset: config.offset || { x: 0, y: -20 }, // Default: above the shape
      syncRotation: config.syncRotation ?? false,
      padding: config.padding ?? 5,
    };

    // Initialize position
    this.updatePosition();

    // Attach listeners to the target
    // 'dragmove' covers dragging, 'attrChange' covers programmatic property changes
    this.target.on("dragmove.label attrChange.label", () =>
      this.updatePosition()
    );

    // Cleanup if target is destroyed
    this.target.on("destroy", () => this.destroy());
  }

  /**
   * Calculates the position based on the target's current state
   */
  public updatePosition() {
    if (!this.target) return;

    const pos = this.target.position();
    const scale = this.target.scaleX(); // Assuming uniform scale

    // We calculate the new position
    // If the target is a Group or Shape, pos.x/y is its origin.
    this.setAttrs({
      x: pos.x + this.options.offset.x * scale,
      y: pos.y + this.options.offset.y * scale,
    });

    if (this.options.syncRotation) {
      this.rotation(this.target.rotation());
    }

    // Ensure the label stays on top if they share the same parent
    if (this.parent) {
      this.moveToTop();
    }

    this.getLayer()?.batchDraw();
  }

  // Allow dynamic offset changes
  public setOffset(x: number, y: number) {
    this.options.offset = { x, y };
    this.updatePosition();
  }

  // Override destroy to clean up listeners on target
  destroy() {
    this.target.off(".label");
    super.destroy();
    return this;
  }
}
