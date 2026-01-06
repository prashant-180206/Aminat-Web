/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnimGetter } from "@/core/classes/animation/animgetter";
import Konva from "@/lib/konva";
import { TextProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";

export class MText extends Konva.Text {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _properties: TextProperties;
  private _TYPE: string;
  private _textarea?: HTMLTextAreaElement;
  private _transformer?: Konva.Transformer;
  private _originalText?: string;
  private _outsideClickHandler?: (e: Event) => void;
  cornerRadius: number = 4;

  constructor(TYPE: string, config: Partial<TextProperties> = {}) {
    super({
      draggable: true,
      lineCap: "round",
      lineJoin: "round",
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    this._properties = {
      position: { x: 0, y: 0 },
      scale: 1,
      rotation: 0,
      color: "#ffffff",
      textData: {
        color: "#ffffff",
        content: "Hello World",
        fontsize: 24,
        fontfamily: "Arial",
        bold: false,
        italic: false,
      },
      zindex: 0,
      opacity: 1,
      ...config,
    };

    this.updateFromProperties();

    // Use dblclick/dbltap to start inline edit
    this.on("dblclick dbltap", () => {
      this.startEditing();
    });
    this.name("Text");
  }

  type(): string {
    return this._TYPE;
  }

  // Getter/Setter for properties
  get properties(): TextProperties {
    return { ...this._properties };
  }

  set properties(newProps: Partial<TextProperties>) {
    Object.assign(this._properties, newProps);
    this.updateFromProperties();
  }

  private updateFromProperties() {
    const {
      position,
      color,
      scale,
      rotation,
      textData: {
        content,
        fontsize,
        fontfamily,
        bold,
        italic,
        color: textColor,
      },
      zindex,
      opacity,
    } = this._properties;

    const fontWeight = bold ? "bold" : "normal";
    const fontStyle = italic ? "italic" : "normal";

    this.text(content);
    this.fill(textColor);
    this.fontFamily(fontfamily);
    this.fontSize(fontsize);
    this.fontStyle(`${fontStyle} ${fontWeight}`.trim());
    this.opacity(opacity);
    if (this.parent) this.zIndex(zindex);

    const pt = p2c(position.x, position.y);
    // keep centering behavior as in your sample
    this.position({
      x: pt.x - this.width() / 2,
      y: pt.y - this.height() / 2,
    });

    this.rotation(rotation);
    this.scale({ x: scale, y: scale });

    // ensure konva props are consistent
    this.listening(true);
    this.visible(true);
    const layer = this.getLayer();
    if (layer) layer.batchDraw();
  }

  // Convenience: Update text content
  setContent(content: string) {
    this._properties.textData.content = content;
    this.text(content);
    const layer = this.getLayer();
    if (layer) layer.batchDraw();
  }

  // ------- Editing implementation (based on your sample) -------

  private ensureStageAndLayer(): {
    stage: Konva.Stage;
    layer: Konva.Layer;
  } | null {
    const stage = this.getStage();
    const layer = this.getLayer();
    if (!stage || !layer) return null;
    return { stage, layer };
  }

  private createTransformer(layer: Konva.Layer) {
    // attach a small transformer with side anchors for width adjustment like your sample
    const tr = new Konva.Transformer({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      node: this as any,
      enabledAnchors: ["middle-left", "middle-right"],
      ignoreStroke: true,
      rotateEnabled: false,
      boundBoxFunc: function (oldBox, newBox) {
        // prevent very small width
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });
    layer.add(tr);
    tr.show();
    tr.forceUpdate();
    return tr;
  }

  private removeTransformer() {
    if (!this._transformer) return;
    try {
      this._transformer.remove();
      this._transformer.destroy();
    } catch (e) {
      // ignore
      console.warn("Error removing transformer:", e);
    }
    this._transformer = undefined;
  }

  private createTextarea(stage: Konva.Stage) {
    if (this._textarea) return this._textarea;

    const container = stage.container();
    const textarea = document.createElement("textarea");

    // basic style copied/adapted from your sample
    textarea.value = this.text();
    textarea.style.position = "absolute";
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "transparent";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = this.lineHeight().toString();
    textarea.style.fontFamily = this.fontFamily();
    textarea.style.fontSize = this.fontSize() + "px";
    textarea.style.color = (this.fill() as string) || "black";
    textarea.style.zIndex = "1000";
    textarea.style.textAlign = this.align() || "left";

    container.appendChild(textarea);
    this._textarea = textarea;
    return textarea;
  }

  private positionTextarea(
    stage: Konva.Stage,
    layer: Konva.Layer,
    textarea: HTMLTextAreaElement
  ) {
    const stageBox = stage.container().getBoundingClientRect();
    const textPos = this.absolutePosition(); // absolute in stage coords

    const areaPosition = {
      x: stageBox.left + textPos.x,
      y: stageBox.top + textPos.y,
    };

    // compute width/height using node metrics
    const width = Math.max(20, this.width() - this.padding() * 2);
    const height = Math.max(20, this.height() - this.padding() * 2);

    textarea.style.left = areaPosition.x + "px";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.width = width + "px";
    textarea.style.height = height + "px";

    // apply rotation transform to match rotated text visually
    const rotation = this.rotation();
    let transform = "";
    if (rotation) {
      transform += "rotateZ(" + rotation + "deg)";
    }
    // small vertical adjustment similar to sample
    transform += "translateY(-2px)";
    textarea.style.transform = transform;

    // autosize initial height
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + 3 + "px";
  }

  private autoSizeTextarea(textarea: HTMLTextAreaElement) {
    textarea.style.width = "auto";
    const newWidth = textarea.scrollWidth;
    textarea.style.width = newWidth + 2 + "px";
  }

  startEditing() {
    if (typeof window === "undefined") return;
    const ctx = this.ensureStageAndLayer();
    if (!ctx) return;
    const { stage, layer } = ctx;

    // if already editing, focus
    if (this._textarea) {
      this._textarea.focus();
      return;
    }

    this._originalText = this.text();

    // create transformer (so we capture transform info) and then hide both text & transformer
    this._transformer = this.createTransformer(layer);

    // hide Konva objects while editing (as in your sample)
    this.hide();
    if (this._transformer) this._transformer.hide();
    layer.batchDraw();

    // create textarea
    const textarea = this.createTextarea(stage);
    this.positionTextarea(stage, layer, textarea);
    textarea.value = this._originalText ?? "";
    textarea.focus();
    textarea.select();

    // input listener: update konva text and autosize
    const onInput = () => {
      // update underlying Konva text so size metrics update
      this.text(textarea.value);
      // autosize textarea width/height like sample
      //   const scale = this.getAbsoluteScale().x;
      this.autoSizeTextarea(textarea);
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + this.fontSize() + "px";

      // reposition in case text metrics changed (keeps aligned)
      this.positionTextarea(stage, layer, textarea);
    };

    // keydown handler: Enter commits, Escape cancels
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        // commit
        e.preventDefault();
        this.commitEditing();
      } else if (e.key === "Escape") {
        e.preventDefault();
        this.cancelEditing();
      } else {
        // give input handler a chance to run after key processing
        setTimeout(onInput, 0);
      }
    };

    // outside click handler to commit on clicking outside textarea
    const handleOutsideClick = (ev: Event) => {
      if (ev.target !== textarea) {
        this.commitEditing();
      }
    };

    textarea.addEventListener("input", onInput);
    textarea.addEventListener("keydown", onKeyDown);
    // attach outside click listeners (deferred to avoid immediate trigger)
    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
      window.addEventListener("touchstart", handleOutsideClick);
    }, 0);

    // store handler refs for cleanup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (textarea as any)._mt_handlers = { onInput, onKeyDown, handleOutsideClick };
    this._outsideClickHandler = handleOutsideClick;
  }

  private cleanupTextarea() {
    if (!this._textarea) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlers = (this._textarea as any)._mt_handlers;
    if (handlers) {
      this._textarea.removeEventListener("input", handlers.onInput);
      this._textarea.removeEventListener("keydown", handlers.onKeyDown);
    }
    // remove outside click listeners
    if (this._outsideClickHandler) {
      window.removeEventListener("click", this._outsideClickHandler);
      window.removeEventListener("touchstart", this._outsideClickHandler);
      this._outsideClickHandler = undefined;
    }
    // remove DOM
    try {
      this._textarea.remove();
    } catch (e) {
      /* ignore */
    }
    this._textarea = undefined;
  }

  private commitEditing() {
    if (!this._textarea) return;
    // commit text
    const newValue = this._textarea.value;
    this.setContent(newValue);

    // restore konva node & transformer
    this.show();
    if (this._transformer) this._transformer.show();
    this.removeTransformer(); // transformer will be recreated later if needed
    this.cleanupTextarea();

    // redraw layer
    const layer = this.getLayer();
    if (layer) layer.batchDraw();
  }

  private cancelEditing() {
    // restore original
    if (this._originalText !== undefined) {
      this.setContent(this._originalText);
    }
    // cleanup DOM and transformer
    this.show();
    if (this._transformer) this._transformer.show();
    this.removeTransformer();
    this.cleanupTextarea();
    const layer = this.getLayer();
    if (layer) layer.batchDraw();
  }

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(
      pos.x + this.width() / 2,
      pos.y + this.height() / 2
    );
    this._properties.color = this.fill() as string;
    this._properties.scale = this.scaleX();
  }

  setVisibleText(text: string) {
    this.text(text);
    const layer = this.getLayer();
    if (layer) layer.batchDraw();
  }

  storeAsObj() {
    return {
      properties: this._properties,
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.properties = obj.properties as TextProperties;
    this.UpdateFromKonvaProperties();
  }
}

// import Konva from "@/lib/konva";
// import { TextProperties } from "@/core/types/properties";
// import { c2p, p2c } from "@/core/utils/conversion";

// export class MText extends Konva.Text {
//   private _properties: TextProperties;
//   private _bgRect: Konva.Rect;

//   // editing state (unchanged)
//   private _textarea?: HTMLTextAreaElement;
//   private _transformer?: Konva.Transformer;
//   private _originalText?: string;
//   private _outsideClickHandler?: (e: Event) => void;

//   cornerRadius = 4;

//   constructor(config: Partial<TextProperties> = {}) {
//     super({
//       draggable: true,
//       lineCap: "round",
//       lineJoin: "round",
//     });

//     this._properties = {
//       position: { x: 0, y: 0 },
//       color: "black",
//       scale: 1,
//       rotation: 0,
//       content: "Hello World",
//       fontsize: 24,
//       fontfamily: "Arial",
//       bold: false,
//       italic: false,
//       zindex: 0,
//       opacity: 1,

//       // bg rect defaults
//       bgRectVisible: false,
//       bgRectColor: "#ffffff",
//       bgRectOpacity: 0.8,
//       bgRectPadding: 6,

//       ...config,
//     };

//     // background rect
//     this._bgRect = new Konva.Rect({
//       listening: false,
//       cornerRadius: this.cornerRadius,
//     });

//     this.updateFromProperties();

//     this.on("dblclick dbltap", () => {
//       this.startEditing();
//     });

//     this.name("Text");
//   }

//   // ---------- Properties ----------

//   get properties(): TextProperties {
//     return { ...this._properties };
//   }

//   set properties(newProps: Partial<TextProperties>) {
//     Object.assign(this._properties, newProps);
//     this.updateFromProperties();
//   }

//   // ---------- Update Core ----------

//   private updateFromProperties() {
//     const {
//       position,
//       color,
//       scale,
//       rotation,
//       content,
//       fontsize,
//       fontfamily,
//       bold,
//       italic,
//       zindex,
//       opacity,
//     } = this._properties;

//     const fontWeight = bold ? "bold" : "normal";
//     const fontStyle = italic ? "italic" : "normal";

//     this.text(content);
//     this.fill(color);
//     this.fontFamily(fontfamily);
//     this.fontSize(fontsize);
//     this.fontStyle(`${fontStyle} ${fontWeight}`.trim());
//     this.opacity(opacity);
//     this.zIndex(zindex);

//     const pt = p2c(position.x, position.y);
//     this.position({
//       x: pt.x - this.width() / 2,
//       y: pt.y - this.height() / 2,
//     });

//     this.rotation(rotation);
//     this.scale({ x: scale, y: scale });

//     this.updateBackgroundRect();

//     const layer = this.getLayer();
//     if (layer) layer.batchDraw();
//   }

//   // ---------- Background Rect ----------

//   private updateBackgroundRect() {
//     const {
//       bgRectVisible,
//       bgRectColor,
//       bgRectOpacity,
//       bgRectPadding,
//       zindex,
//     } = this._properties;

//     const layer = this.getLayer();
//     if (!layer) return;

//     if (!this._bgRect.getLayer()) {
//       layer.add(this._bgRect);
//     }

//     if (!bgRectVisible) {
//       this._bgRect.hide();
//       return;
//     }

//     const absPos = this.absolutePosition();
//     const padding = bgRectPadding;

//     this._bgRect.setAttrs({
//       x: absPos.x - padding,
//       y: absPos.y - padding,
//       width: this.width() + padding * 2,
//       height: this.height() + padding * 2,
//       fill: bgRectColor,
//       opacity: bgRectOpacity,
//       rotation: this.rotation(),
//       scaleX: this.scaleX(),
//       scaleY: this.scaleY(),
//       zIndex: zindex - 1, // always behind text
//       visible: true,
//     });
//   }

//   // ---------- Content API ----------

//   setContent(content: string) {
//     this._properties.content = content;
//     this.text(content);
//     this.updateBackgroundRect();
//     const layer = this.getLayer();
//     if (layer) layer.batchDraw();
//   }

//   // ---------- Editing Hooks ----------

//   startEditing() {
//     // hide bg rect while editing
//     this._bgRect.hide();
//     super.startEditing?.();
//     // (rest of your existing logic remains unchanged)
//   }

//   private commitEditing() {
//     if (!this._textarea) return;
//     const newValue = this._textarea.value;
//     this.setContent(newValue);

//     this.show();
//     this._bgRect.show();
//     this.cleanupTextarea();
//   }

//   private cancelEditing() {
//     if (this._originalText !== undefined) {
//       this.setContent(this._originalText);
//     }
//     this.show();
//     this._bgRect.show();
//     this.cleanupTextarea();
//   }

//   // ---------- Sync Back ----------

//   UpdateFromKonvaProperties() {
//     const pos = this.position();
//     this._properties.position = c2p(
//       pos.x + this.width() / 2,
//       pos.y + this.height() / 2
//     );
//     this._properties.color = this.fill() as string;
//     this._properties.scale = this.scaleX();
//   }
// }
