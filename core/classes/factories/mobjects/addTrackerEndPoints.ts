import { MArc } from "../../mobjects/geometric/arc";
import { MVector } from "../../mobjects/geometric/vector";
import { ParametricCurve } from "../../mobjects/simple/curve";
import { MDashedLine } from "../../mobjects/simple/dashedLine";
import { MLine } from "../../mobjects/simple/line";
import { DynamicText } from "../../mobjects/text/DynamicText";

export class TrackerEndPointsAdder {
  static addDynamicTextConnectors(mobject: DynamicText) {
    mobject.trackerconnector.addConnectorFunc("Val1", (val: number) => {
      if (Math.abs(mobject.dynamicContent.val1 - val) < 0.01) return;
      mobject.dynamicContent = { val1: val };
    });
    mobject.trackerconnector.addConnectorFunc("Val2", (val: number) => {
      if (Math.abs(mobject.dynamicContent.val2 - val) < 0.01) return;
      mobject.dynamicContent = { val2: val };
    });
  }

  static addLinePointConnectors(mobject: MLine | MVector | MDashedLine) {
    const directions = ["startX", "startY", "endX", "endY"] as const;

    directions.forEach((key) => {
      mobject.trackerconnector.addConnectorFunc(key, (value: number) => {
        const { lineEnds } = mobject.features.getData();
        const newEnds = { ...lineEnds };

        if (key === "startX") newEnds.start.x = value;
        if (key === "startY") newEnds.start.y = value;
        if (key === "endX") newEnds.end.x = value;
        if (key === "endY") newEnds.end.y = value;

        mobject.features.update({ lineEnds: newEnds });
      });
    });
  }
  static addCurvePointConnectors(mobj: ParametricCurve) {
    mobj.trackerconnector.addConnectorFunc("Tend", (val: number) => {
      const range = mobj.features.getData().parameterRange;
      if (Math.abs(range[1] - val) < 0.01) return;
      mobj.features.update({ parameterRange: [range[0], val] });
    });
    mobj.trackerconnector.addConnectorFunc("Tstart", (val: number) => {
      const range = mobj.features.getData().parameterRange;
      if (Math.abs(range[0] - val) < 0.01) return;
      mobj.features.update({ parameterRange: [val, range[1]] });
    });
    // To be implemented for curved lines
  }

  static addArcPointConnectors(mobj: MArc) {
    mobj.trackerconnector.addConnectorFunc("StartAngle", (val: number) => {
      if (Math.abs(mobj.features.getData().startAngle - val) < 0.01) return;
      mobj.features.update({ startAngle: val });
    });
    mobj.trackerconnector.addConnectorFunc("EndAngle", (val: number) => {
      if (Math.abs(mobj.features.getData().endAngle - val) < 0.01) return;
      mobj.features.update({ endAngle: val });
    });
  }
}
