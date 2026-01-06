import MobjectMap from "@/core/maps/MobjectMap";
import { Mobject } from "@/core/types/mobjects";
import Konva from "@/lib/konva";
// import { Mobject } from ".../types/mobjects";
// import MobjectMap from "../maps/MobjectMap";

// factories/MobjectFactory.ts
export class MobjectFactory {
  static create(
    type: string,
    layer: Konva.Layer,
    opts: {
      id?: string;
      zIndex: number;
      onSelect: ((m: Mobject) => void) | null;
    }
  ): Mobject {
    const mobject = MobjectMap[type].func();

    mobject.id(opts.id ?? `${mobject.name()}-${opts.zIndex}`);
    mobject.properties = { zindex: opts.zIndex };
    mobject.setDraggable(true);

    mobject.on("click", () => {
      if (opts.onSelect) opts.onSelect(mobject);
      mobject.UpdateFromKonvaProperties();
    });

    mobject.on("dragend", () => {
      mobject.UpdateFromKonvaProperties();
    });

    layer.add(mobject);
    return mobject;
  }
}
