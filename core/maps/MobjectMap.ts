import Konva from "konva";
import MCircle from "../classes/mobjects/simple/circle";

export type MobjectMapType = {
  [key: string]: () => Konva.Shape | MCircle;
};

const MobjectMap: MobjectMapType = {
  circle: () => new MCircle(),
};

export default MobjectMap;
