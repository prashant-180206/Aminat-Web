import Konva from "@/lib/konva";
import MobjectMap, { Mobject } from "../maps/MobjectMap";

class Scene extends Konva.Stage {
  layer: Konva.Layer;
  private TotalObjects: number = 0;
  private Mobjects: string[] = [];
  constructor(config: Konva.StageConfig) {
    super(config);
    const layer = new Konva.Layer();
    this.add(layer);
    this.layer = layer as Konva.Layer;
  }
  activeMobject: Mobject | null = null;

  addMobject(str: string) {
    const mobject = MobjectMap[str].func();
    mobject.setDraggable(true);
    // mobject.properties
    const addid = `${mobject.name() || "mobject"}-${this.TotalObjects}`;
    mobject.id(addid);

    mobject.on("click", () => {
      this.activeMobject = mobject;
      mobject?.UpdateFromKonvaProperties();
    });
    // this.onActiveMobjectChange();
    this.TotalObjects += 1;
    mobject.properties = { zindex: this.TotalObjects };
    this.Mobjects.push(addid);
    this.layer.add(mobject as Konva.Shape);
    this.layer.draw();
    return mobject;
  }

  getMobjectById(id: string) {
    return this.layer.findOne(`#${id}`) as Mobject;
  }
}

export default Scene;
