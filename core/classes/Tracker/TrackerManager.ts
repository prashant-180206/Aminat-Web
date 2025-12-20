// import Konva from "@/lib/konva";

// type UpdateCallback = (value: number) => void;

// export class ValueTracker {
//   private _value: number;
//   private _onUpdate: UpdateCallback[] = [];

//   constructor(initialValue: number) {
//     this._value = initialValue;
//   }

//   get value(): number {
//     return this._value;
//   }

//   set value(v: number) {
//     this._value = v;
//     this._onUpdate.forEach((cb) => cb(v));
//   }

//   /**
//    * Register a callback that runs every frame
//    */
//   addUpdater(cb: UpdateCallback) {
//     this._onUpdate.push(cb);
//   }

//   /**
//    * Animate the value using a Konva Tween
//    */
//   animateTo(
//     target: number,
//     config: {
//       duration?: number;
//       easing?: (t: number) => number;
//       onFinish?: () => void;
//     } = {}
//   ): Konva.Tween {
//     const proxy = { v: this._value };

//     const tween = new Konva.Tween({
//       node: proxy as any,
//       v: target,
//       duration: config.duration ?? 1,
//       easing: config.easing ?? Konva.Easings.Linear,
//       onUpdate: () => {
//         this.value = proxy.v;
//       },
//       onFinish: config.onFinish,
//     });

//     return tween;
//   }
// }
