import { MVector } from "../../mobjects/geometric/vector";
import { MDashedLine } from "../../mobjects/simple/dashedLine";
import { MLine } from "../../mobjects/simple/line";
import { DynamicText } from "../../mobjects/text/DynamicText";

export class TrackerEndPointsAdder {
  static addDynamicTextConnectors(mobject: DynamicText) {
    mobject.trackerconnector.addConnectorFunc("Val1", (val: number) => {
      if (Math.abs(mobject.properties.textData.val1 - val) < 0.01) return;
      mobject.properties = {
        textData: {
          ...mobject.properties.textData,
          val1: val,
        },
      };
    });
    mobject.trackerconnector.addConnectorFunc("Val2", (val: number) => {
      if (Math.abs(mobject.properties.textData.val2 - val) < 0.01) return;
      mobject.properties = {
        textData: {
          ...mobject.properties.textData,
          val2: val,
        },
      };
    });
  }

  static addLinePointConnectors(mobject: MLine | MVector | MDashedLine) {
    const directions = ["startX", "startY", "endX", "endY"] as const;

    directions.forEach((key) => {
      mobject.trackerconnector.addConnectorFunc(key, (value: number) => {
        const { lineEnds } = mobject.properties;
        const newEnds = { ...lineEnds };

        if (key === "startX") newEnds.start.x = value;
        if (key === "startY") newEnds.start.y = value;
        if (key === "endX") newEnds.end.x = value;
        if (key === "endY") newEnds.end.y = value;

        mobject.properties = { lineEnds: newEnds };
      });
    });
  }
}
