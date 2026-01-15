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
      id?: string;
      zIndex: number;
    }
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

    mobject.id(opts.id ?? `${mobject.name()}-${opts.zIndex}`);
    mobject.setDraggable(true);

    // mobject.on("dragend", () => {
    //   mobject.UpdateFromKonvaProperties();
    // });

    return mobject;
  }
}
