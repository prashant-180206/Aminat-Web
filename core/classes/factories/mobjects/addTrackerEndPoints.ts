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
}
