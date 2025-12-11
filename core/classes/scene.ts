import Konva from "konva";
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
}

export default Scene;
