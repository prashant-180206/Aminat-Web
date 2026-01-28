import MobjectMap from "@/core/maps/MobjectMap";
import { Mobject } from "@/core/types/mobjects";
import Konva from "@/lib/konva";
import { MText } from "../mobjects/text/text";

/**
 * Factory for creating Mobject instances.
 *
 * Uses the Factory pattern to create Mobjects from type strings.
 * Handles:
 * - Instantiation via MobjectMap
 * - Layer assignment (text vs main layer)
 * - ID assignment
 * - Initial configuration (draggable, z-index)
 *
 * @example
 * ```typescript
 * const dot = MobjectFactory.create("Dot", layer, textlayer, {
 *   id: "myDot",
 *   number: 1
 * });
 * ```
 */
export class MobjectFactory {
  /**
   * Create a new Mobject instance.
   *
   * @param type - Type of Mobject to create (must exist in MobjectMap)
   * @param layer - Main Konva layer for shapes
   * @param textlayer - Text Konva layer for text objects
   * @param opts - Options object
   * @param opts.number - Sequential number for auto-generated IDs
   * @param opts.id - Optional custom ID
   * @returns Configured Mobject instance, ready to use
   *
   * @throws Error if type doesn't exist in MobjectMap
   */
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
      (mobject instanceof MText || mobject instanceof Konva.Image) &&
      textlayer
    ) {
      textlayer.add(mobject);
    } else {
      layer.add(mobject);
    }

    mobject.id(opts.id ?? `${mobject.name()}-${opts.number}`);
    mobject.setDraggable(true);

    const zin = mobject.zIndex();
    mobject.features.update({ zindex: zin });
    return mobject;
  }
}
