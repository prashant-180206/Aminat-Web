import Konva from "konva";
import { DEFAULT_HEIGHT, DEFAULT_SCALE, DEFAULT_WIDTH } from "../config";
import MobjectMap from "../maps/MobjectMap";

class Scene extends Konva.Stage {
  layer: Konva.Layer;
  constructor(config: Konva.StageConfig) {
    super(config);
    const layer = new Konva.Layer();
    this.add(layer);
    this.layer = layer as Konva.Layer;
  }

  addMobject(str: string) {
    const mobject = MobjectMap[str]();
    mobject.setDraggable(true);
    this.layer.add(mobject as Konva.Shape);
    this.layer.draw();
  }

  static c2p(x: number, y: number) {
    return {
      x: (x - DEFAULT_WIDTH / 2) / DEFAULT_SCALE,
      y: (y - DEFAULT_HEIGHT / 2) / DEFAULT_SCALE,
    };
  }

  static p2c(x: number, y: number) {
    return {
      x: x * DEFAULT_SCALE + DEFAULT_WIDTH / 2,
      y: y * DEFAULT_SCALE + DEFAULT_HEIGHT / 2,
    };
  }
}

export default Scene;
