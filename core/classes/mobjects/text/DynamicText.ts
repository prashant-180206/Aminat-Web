// /* eslint-disable @typescript-eslint/no-unused-vars */
import { AnimGetter } from "@/core/classes/animation/animgetter";
import Konva from "@/lib/konva";
import { DynamicTextProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { Colors } from "@/core/utils/colors";
import { TrackerEndPointsAdder } from "../../factories/mobjects/addTrackerEndPoints";

export class DynamicText extends Konva.Text {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _TYPE: string;
  private _textarea?: HTMLTextAreaElement;
  private _transformer?: Konva.Transformer;
  public cornerRadius: number = 4;
  private paddingAmount: number = 5;
  private numbersAdded: number = 0;
  private changingNumbers: number[] = [];

  changeNumbers(idx: number, val: number) {
    if (this.changeNumbers.length <= idx) return;
    this.changingNumbers[idx] = val;
    this.numbersAdded++;
  }

  private _properties: DynamicTextProperties = {
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    color: Colors.BG_SEC,
    textData: {
      color: Colors.TEXT,
      content: "Hello World",
      fontsize: 36,
      fontfamily: "Arial",
      bold: false,
      italic: false,
      val1: 0,
      val2: 0,
    },
    zindex: 0,
    opacity: 1,
  };

  constructor(TYPE: string, config: Partial<DynamicTextProperties> = {}) {
    super({
      draggable: true,
      lineCap: "round",
      lineJoin: "round",
      name: "Text",
    });
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);
    this._TYPE = TYPE;
    this.properties = { ...this._properties, ...config };
    this.on("dblclick dbltap", () => this.startEditing());
    TrackerEndPointsAdder.addDynamicTextConnectors(this);
  }

  get properties(): DynamicTextProperties {
    return { ...this._properties };
  }

  set properties(val: Partial<DynamicTextProperties>) {
    Object.assign(this._properties, val);
    if (val.scale) this.scale({ x: val.scale, y: val.scale });
    if (val.rotation) this.rotation(val.rotation);
    if (val.textData) {
      const { color, fontfamily, fontsize, italic, bold } = val.textData;
      this.refreshText();
      this.setAttrs({
        fill: color,
        fontFamily: fontfamily,
        fontSize: fontsize,
        fontStyle: `${italic ? "italic" : "normal"} ${
          bold ? "bold" : "normal"
        }`.trim(),
      });
    }
    if (val.position) {
      const p = p2c(val.position.x, val.position.y);
      this.position({
        x: p.x - this.width() / 2,
        y: p.y - this.height() / 2,
      });
    }
  }

  setContent(content: string) {
    // Store the "raw" version as the template
    this._properties.textData.content = content;
    this.refreshText();
  }

  // 2. New helper to sync values to the UI without losing the template
  public refreshText() {
    let displayString = this._properties.textData.content;

    // Replace placeholders with current values
    displayString = displayString.replace(
      /val1/g, // Use regex /g to replace all occurrences
      this._properties.textData.val1.toFixed(2).toString()
    );
    displayString = displayString.replace(
      /val2/g,
      this._properties.textData.val2.toFixed(2).toString()
    );

    this.text(displayString);
    this.getLayer()?.batchDraw();
  }

  private syncTextarea() {
    const stage = this.getStage();
    if (!stage || !this._textarea) return;
    const box = stage.container().getBoundingClientRect();
    const pos = this.absolutePosition();

    // We offset the top/left by paddingAmount so the text stays in the same visual spot
    Object.assign(this._textarea.style, {
      left: `${box.left + pos.x - this.paddingAmount - 2}px`,
      top: `${box.top + pos.y - this.paddingAmount}px`,
      width: `${Math.max(
        20,
        this.width() - this.padding() * 2 + this.paddingAmount * 3
      )}px`,
      height: `${this._properties.textData.fontsize + this.paddingAmount}px`,
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
      backgroundColor: this._properties.color,
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

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(
      pos.x + this.width() / 2,
      pos.y + this.height() / 2
    );
    this._properties.scale = this.scaleX();
  }

  storeAsObj(): MobjectData {
    return { properties: this._properties, id: this.id() };
  }

  loadFromObj(obj: MobjectData) {
    this.properties = obj.properties as DynamicTextProperties;
    this.UpdateFromKonvaProperties();
  }

  type() {
    return this._TYPE;
  }
}
