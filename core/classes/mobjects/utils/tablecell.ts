import { Colors } from "@/core/utils/colors";
import Konva from "@/lib/konva";

export class TableCell extends Konva.Group {
  public textNode: Konva.Text;
  public bgRect: Konva.Rect;

  private _textarea?: HTMLTextAreaElement;
  private paddingAmount = 6;

  constructor() {
    super({ listening: true });

    this.bgRect = new Konva.Rect({
      listening: false,
    });

    this.textNode = new Konva.Text({
      padding: 6,
      align: "center",
      verticalAlign: "middle",
      text: "CellData",
    });

    this.add(this.bgRect);
    this.add(this.textNode);

    this.on("dblclick dbltap", () => this.startEditing());

    this.updateLayout();
  }

  /* ------------------------------------------------------------------ */
  /* PUBLIC API                                                         */
  /* ------------------------------------------------------------------ */

  setText(text: string) {
    this.textNode.text(text);
    this.updateLayout();
  }

  setBoxSize(w: number, h: number) {
    this.textNode.width(w);
    this.textNode.height(h);
    this.updateLayout();
  }

  setStyle(style: {
    fontSize?: number;
    fontFamily?: string;
    textColor?: string;
    bgColor?: string;
  }) {
    if (style.fontSize !== undefined) this.textNode.fontSize(style.fontSize);

    if (style.fontFamily !== undefined)
      this.textNode.fontFamily(style.fontFamily);

    if (style.textColor !== undefined) this.textNode.fill(style.textColor);

    if (style.bgColor !== undefined) this.bgRect.fill(style.bgColor);

    this.updateLayout();
  }

  /* ------------------------------------------------------------------ */
  /* EDITING LOGIC                                                      */
  /* ------------------------------------------------------------------ */

  private startEditing() {
    const stage = this.getStage();
    if (!stage || typeof window === "undefined" || this._textarea) return;

    const originalText = this.textNode.text();
    this.textNode.hide();

    const textarea = document.createElement("textarea");
    this._textarea = textarea;

    textarea.value = originalText;

    Object.assign(textarea.style, {
      position: "absolute",
      margin: "0px",
      padding: 0,
      border: "1px solid #ccc",
      outline: "none",
      resize: "none",
      overflow: "hidden",
      background: Colors.BG,
      fontSize: `${this.textNode.fontSize()}px`,
      fontFamily: this.textNode.fontFamily(),
      lineHeight: this.textNode.lineHeight().toString(),
      textAlign: this.textNode.align(),
      color: Colors.TEXT,
      zIndex: "1000",
    });

    stage.container().appendChild(textarea);
    this.syncTextareaPosition();
    textarea.focus();

    const stop = (commit: boolean) => {
      if (commit) this.setText(textarea.value || "");
      else this.setText(originalText);

      textarea.remove();
      this._textarea = undefined;
      this.textNode.show();
      this.getLayer()?.batchDraw();
    };

    textarea.oninput = () => {
      this.textNode.text(textarea.value);
      this.syncTextareaPosition();
      this.updateLayout();
    };

    textarea.onkeydown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) stop(true);
      if (e.key === "Escape") stop(false);
    };

    setTimeout(() => {
      window.addEventListener(
        "click",
        (e) => e.target !== textarea && stop(true),
        { once: true },
      );
    }, 0);
  }

  private syncTextareaPosition() {
    if (!this._textarea) return;

    const pos = this.textNode.absolutePosition();
    const textarea = this._textarea;

    Object.assign(textarea.style, {
      left: `${pos.x}px`,
      top: `${pos.y}px`,
      width: `${Math.max(
        20,
        this.textNode.width() + this.paddingAmount * 2,
      )}px`,
      height: `${Math.max(
        20,
        this.textNode.height() + this.paddingAmount * 2,
      )}px`,
    });
  }

  /* ------------------------------------------------------------------ */
  /* LAYOUT                                                             */
  /* ------------------------------------------------------------------ */

  private updateLayout() {
    this.bgRect.setAttrs({
      x: 0,
      y: 0,
      width: this.textNode.width(),
      height: this.textNode.height(),
      cornerRadius: 2,
    });
  }
}
