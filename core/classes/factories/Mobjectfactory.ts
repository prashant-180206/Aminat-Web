import MobjectMap from "@/core/maps/MobjectMap";
import { Mobject } from "@/core/types/mobjects";
import Konva from "@/lib/konva";

// factories/MobjectFactory.ts
export class MobjectFactory {
  static create(
    type: string,
    layer: Konva.Layer,
    textlayer: Konva.Layer,
    opts: {
      number?: number;
      id?: string;
    },
  ): Mobject {
    const mobject = MobjectMap[type].func();

    if (
      (mobject instanceof Konva.Text || mobject instanceof Konva.Image) &&
      textlayer
    ) {
      textlayer.add(mobject);
    } else {
      layer.add(mobject);
    }

    mobject.id(opts.id ?? `${mobject.name()}-${opts.number}`);
    mobject.setDraggable(true);

    return mobject;
  }
}
