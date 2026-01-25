import { TrackerEndPointsAdder } from "../../factories/mobjects/addTrackerEndPoints";
import { MText } from "./text";

export class DynamicText extends MText {
  private _dynamicContent: {
    val1: number;
    val2: number;
  } = {
    val1: 0,
    val2: 0,
  };
  // private
  get dynamicContent(): { val1: number; val2: number } {
    return { ...this._dynamicContent };
  }
  set dynamicContent(val: Partial<{ val1: number; val2: number }>) {
    this._dynamicContent.val1 = val.val1 || this._dynamicContent.val1;
    this._dynamicContent.val2 = val.val2 || this._dynamicContent.val2;
    const line = this.defaultText;
    const updatedLine = line
      .replace(
        /val1/g,
        val.val1?.toFixed(1).toString() ||
          this._dynamicContent.val1.toFixed(1).toString(),
      )
      .replace(
        /val2/g,
        val.val2?.toFixed(1).toString() ||
          this._dynamicContent.val2.toFixed(1).toString(),
      );
    this.textNode.text(updatedLine);
  }
  constructor(type: string) {
    super(type);
    TrackerEndPointsAdder.addDynamicTextConnectors(this);
  }
}
