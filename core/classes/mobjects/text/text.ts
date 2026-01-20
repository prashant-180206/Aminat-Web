import { AnimGetter } from "@/core/classes/animation/animgetter";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { TextProperties, TextProperty } from "../../controllers/text/text";
import { MobjectAnimAdder } from "../../factories/mobjects/addAnimations";

export class MText extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  public features: TextProperty;

  // Public sub-elements
  public textNode: Konva.Text;
  public bgRect: Konva.Rect;

  private _TYPE: string;
  private _textarea?: HTMLTextAreaElement;
  private _transformer?: Konva.Transformer;
  private paddingAmount: number = 10;
  public defaultText: string = "";

  constructor(TYPE: string) {
    super({
      draggable: true,
      name: "TextGroup",
    });

    this._TYPE = TYPE;

    // 1. Initialize Background Rectangle
    this.bgRect = new Konva.Rect({
      x: 0,
      y: 0,
      name: "Background",
      listening: true, // Allows dragging via the background
    });

    // 2. Initialize Text Node
    this.textNode = new Konva.Text({
      lineCap: "round",
      lineJoin: "round",
      name: "Text",
      padding: 10, // Internal text padding
    });

    // Add to Group
    this.add(this.bgRect);
    this.add(this.textNode);

    // standard logic
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);
    this.features = new TextProperty(this);

    // Event Listeners
    this.on("dblclick dbltap", () => this.startEditing());

    // Auto-resize background when text changes
    this.textNode.on("transform change", () => this.updateLayout());
    MobjectAnimAdder.addTextAnimations(this);

    this.updateLayout();
  }

  /**
   * Syncs the Background Rect size and color to the Text Node
   */
  public updateLayout() {
    const width = this.textNode.width();
    const height = this.textNode.height();

    this.bgRect.setAttrs({
      x: 0,
      y: 0,
      width: width,
      height: height,
      fill: this.features.getData().color || "transparent",
      cornerRadius: 4,
    });
  }

  get properties(): TextProperties {
    return { ...this.features.getData() };
  }

  getUIComponents() {
    return this.features.getUIComponents();
  }

  setContent(content: string) {
    this.defaultText = content;
    this.textNode.text(content);
    this.updateLayout();
  }

  private syncTextarea() {
    const stage = this.getStage();
    if (!stage || !this._textarea) return;

    // Use absolute position of the textNode (inside the group)
    const pos = this.textNode.absolutePosition();
    const area = this._textarea;

    Object.assign(area.style, {
      left: `${pos.x}px`,
      top: `${pos.y}px`,
      width: `${Math.max(
        20,
        this.textNode.width() -
          this.textNode.padding() * 2 +
          this.paddingAmount * 3,
      )}px`,
      // Height matches font size or scroll height
      height: `${
        this.features.getData().textData.fontsize + this.paddingAmount
      }px`,
      transform: `rotateZ(${this.rotation()}deg) translateY(-2px)`,
    });

    area.style.height = area.scrollHeight + "px";
  }

  startEditing() {
    const stage = this.getStage(),
      layer = this.getLayer();
    if (!stage || !layer || typeof window === "undefined" || this._textarea)
      return;

    const original = this.textNode.text();
    this.textNode.hide();

    this._transformer = new Konva.Transformer({
      nodes: [this.textNode],
      enabledAnchors: ["middle-left", "middle-right"],
      rotateEnabled: false,
      boundBoxFunc: (oldB, newB) => (newB.width > 30 ? newB : oldB),
      visible: false,
    });
    layer.add(this._transformer).batchDraw();

    const area = document.createElement("textarea");
    Object.assign(area.style, {
      position: "absolute",
      margin: "0px",
      overflow: "hidden",
      outline: "none",
      resize: "none",
      zIndex: "1000",
      padding: `${this.paddingAmount}px`,
      borderRadius: `4px`,
      color: this.features.getData().textData.color,
      backgroundColor: this.features.getData().color, // Editor background usually white for contrast
      lineHeight: this.textNode.lineHeight().toString(),
      fontFamily: this.textNode.fontFamily(),
      fontSize: this.textNode.fontSize() + "px",
      textAlign: this.textNode.align(),
    });

    area.value = original;
    stage.container().appendChild(area);
    this._textarea = area;
    this.syncTextarea();
    area.focus();

    const stop = (commit: boolean) => {
      this.setContent(commit ? area.value || "N/A" : original);
      this.textNode.show();
      this._transformer?.destroy();
      window.removeEventListener("click", clickHandler);
      area.remove();
      this._textarea = undefined;
      this.updateLayout();
      layer.batchDraw();
    };

    const clickHandler = (e: Event) => e.target !== area && stop(true);

    area.oninput = () => {
      this.textNode.text(area.value);
      this.syncTextarea();
      this.updateLayout(); // Real-time background resize
    };

    area.onkeydown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) stop(true);
      else if (e.key === "Escape") stop(false);
    };

    setTimeout(() => window.addEventListener("click", clickHandler), 0);
  }

  storeAsObj(): MobjectData {
    return {
      properties: {
        ...this.features.getData(),
        text: this.defaultText,
      } as TextProperties,
      id: this.id(),
    };
  }

  loadFromObj(obj: MobjectData & { properties: { text?: string } }) {
    this.features.setData(obj.properties as TextProperties);
    this.features.refresh();
    if (obj.properties.text) {
      this.defaultText = obj.properties.text;
      this.setContent((obj.properties.text as string) || "");
    }
    this.updateLayout();
  }

  type() {
    return this._TYPE;
  }
}
