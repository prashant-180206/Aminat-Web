import { AnimGetter } from "@/core/classes/animation/animgetter";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { TextProperties, TextProperty } from "../../controllers/text/text";

export class MText extends Konva.Text {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _TYPE: string;
  private _textarea?: HTMLTextAreaElement;
  private _transformer?: Konva.Transformer;
  public cornerRadius: number = 4;
  private paddingAmount: number = 5;
  public features: TextProperty;

  constructor(TYPE: string) {
    super({
      draggable: true,
      lineCap: "round",
      lineJoin: "round",
      name: "Text",
    });
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);
    this._TYPE = TYPE;
    this.features = new TextProperty(this);
    this.on("dblclick dbltap", () => this.startEditing());
  }

  get properties(): TextProperties {
    return { ...this.features.getData() };
  }
  getUIComponents() {
    return this.features.getUIComponents();
  }

  setContent(content: string) {
    this.text(content);
  }

  private syncTextarea() {
    const stage = this.getStage();
    if (!stage || !this._textarea) return;
    const pos = this.absolutePosition();

    // We offset the top/left by paddingAmount so the text stays in the same visual spot
    Object.assign(this._textarea.style, {
      left: `${pos.x - this.paddingAmount - 2}px`,
      top: `${pos.y - this.paddingAmount}px`,
      width: `${Math.max(
        20,
        this.width() - this.padding() * 2 + this.paddingAmount * 3,
      )}px`,
      height: `${
        this.features.getData().textData.fontsize + this.paddingAmount
      }px`,
      transform: `rotateZ(${this.rotation()}deg) translateY(-2px)`,
    });
    this._textarea.style.height = this._textarea.scrollHeight + "px";
  }

  startEditing() {
    const stage = this.getStage(),
      layer = this.getLayer();
    if (!stage || !layer || typeof window === "undefined" || this._textarea)
      return;

    const original = this.text();
    this.hide();

    this._transformer = new Konva.Transformer({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nodes: [this] as any,
      enabledAnchors: ["middle-left", "middle-right"],
      rotateEnabled: false,
      boundBoxFunc: (oldB, newB) => (newB.width > 30 ? newB : oldB),
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
      borderRadius: `${this.cornerRadius}px`,
      backgroundColor: this.features.getData().textData.color,
      lineHeight: this.lineHeight().toString(),
      fontFamily: this.fontFamily(),
      fontSize: this.fontSize() + "px",
      textAlign: this.align(),
    });

    area.value = original;
    stage.container().appendChild(area);
    this._textarea = area;
    this.syncTextarea();
    area.focus();

    const stop = (commit: boolean) => {
      this.setContent(commit ? area.value || "N/A" : original);
      this.show();
      this._transformer?.destroy();
      window.removeEventListener("click", clickHandler);
      area.remove();
      this._textarea = undefined;
      layer.batchDraw();
    };

    const clickHandler = (e: Event) => e.target !== area && stop(true);
    area.oninput = () => {
      this.text(area.value);
      this.syncTextarea();
    };
    area.onkeydown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) stop(true);
      else if (e.key === "Escape") stop(false);
    };

    setTimeout(() => window.addEventListener("click", clickHandler), 0);
  }

  storeAsObj(): MobjectData {
    return { properties: this.features.getData(), id: this.id() };
  }

  loadFromObj(obj: MobjectData) {
    this.features.setData(obj.properties as TextProperties);
    this.features.refresh();
  }

  type() {
    return this._TYPE;
  }
}
