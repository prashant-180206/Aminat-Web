import Konva from "@/lib/konva";
import { Mobject } from "../../types/mobjects";
import { MobjectFactory } from "../factories/Mobjectfactory";

export class MobjectManager {
  private _activeMobject: Mobject | null = null;

  private totalObjects = 0;

  private layer: Konva.Layer;
  private textlayer: Konva.Layer;
  constructor(layer: Konva.Layer, textlayer: Konva.Layer) {
    this.layer = layer;
    this.textlayer = textlayer;
  }
  private _mobjectsMeta: {
    id: string;
    type: string;
    mobject: Mobject;
  }[] = [];
  public get mobjectsMeta(): {
    id: string;
    type: string;
    mobject: Mobject;
  }[] {
    return this._mobjectsMeta;
  }
  public set mobjectsMeta(
    value: {
      id: string;
      type: string;
      mobject: Mobject;
    }[],
  ) {
    this._mobjectsMeta = value;
  }
  get activeMobject(): Mobject | null {
    return this._activeMobject;
  }
  set activeMobject(value: Mobject | null) {
    this._activeMobject = value;
  }

  private mobjectAddCallback: ((mobj: Mobject) => void) | null = null;

  addMobjectFunction(func: (mobj: Mobject) => void) {
    this.mobjectAddCallback = func;
  }
  addMobject(type: string, id?: string): Mobject {
    const mobject = MobjectFactory.create(type, this.layer, this.textlayer!, {
      id,
      number: this.totalObjects++,
    });

    this.mobjectAddCallback?.(mobject);
    this.mobjectsMeta.push({ id: mobject.id(), type, mobject });
    return mobject;
  }

  removeMobject(id: string) {
    this.mobjectsMeta = this.mobjectsMeta.filter((meta) => meta.id !== id);
    this.layer.findOne(`#${id}`)?.destroy();
    this.textlayer.findOne(`#${id}`)?.destroy();
  }

  getMobjectById(id: string): Mobject | null {
    let m = this.layer.findOne(`#${id}`) as Mobject | null;
    if (m) return m;
    m = this.textlayer.findOne(`#${id}`) as Mobject | null;
    return m;
  }

  clear() {
    this.mobjectsMeta.forEach((m) => {
      this.removeMobject(m.id);
    });
    this.mobjectsMeta = [];
  }
}
