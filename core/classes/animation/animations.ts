// // anim/getAnim.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import Konva from "@/lib/konva";
// import { p2c } from "@/core/utils/conversion";
// import { DEFAULT_SCALE } from "@/core/config";

// import MCircle from "../mobjects/simple/circle";
// import { Line } from "konva/lib/shapes/Line";
// import { ParametricCurve } from "../mobjects/simple/curve";
// import { MVector } from "../mobjects/geometric/vector";
// import { MText } from "../mobjects/simple/text";
// import { AnimationType } from "./animationManager";

// // export type AnimationType =
// //   | "create"
// //   | "destroy"
// //   | "move"
// //   | "scaleMove"
// //   | "radiuschange"
// //   | "moveLineEnd"
// //   | "moveLineStart"
// //   | "changeCurveRange"
// //   | "writetext";

// type GetAnimOptions = {
//   duration?: number;
//   easing?: (t: number) => number;

//   // common
//   to?: { x: number; y: number };
//   scale?: number;

//   // numeric targets
//   target1?: number;
//   target2?: number;

//   onFinish?: () => void;
// };

// export function getAnim(
//   node: Konva.Node,
//   type: AnimationType,
//   options: GetAnimOptions = {}
// ): Konva.Tween | null {
//   const {
//     duration = 0.6,
//     easing = Konva.Easings.EaseInOut,
//     onFinish,
//   } = options;

//   /* ---------------- High-level scene animations ---------------- */

//   if (type === "create") {
//     const targetScaleX = node.scaleX() || 1;
//     const targetScaleY = node.scaleY() || 1;
//     const targetOpacity = "opacity" in node ? (node as any).opacity() : 1;

//     node.scale({ x: 0, y: 0 });
//     (node as any).opacity?.(0);

//     return new Konva.Tween({
//       node,
//       duration,
//       easing,
//       scaleX: targetScaleX,
//       scaleY: targetScaleY,
//       opacity: targetOpacity,
//     });
//   }

//   if (type === "destroy") {
//     return new Konva.Tween({
//       node,
//       duration,
//       easing,
//       scaleX: 0,
//       scaleY: 0,
//       opacity: 0,
//       onFinish,
//     });
//   }

//   if (type === "move") {
//     if (!options.to) return null;
//     const canvas = p2c(options.to.x, options.to.y);

//     return new Konva.Tween({
//       node,
//       duration,
//       easing,
//       x: canvas.x,
//       y: canvas.y,
//     });
//   }

//   if (type === "scaleMove") {
//     if (!options.to || typeof options.scale !== "number") return null;
//     const canvas = p2c(options.to.x, options.to.y);

//     return new Konva.Tween({
//       node,
//       duration,
//       easing,
//       x: canvas.x,
//       y: canvas.y,
//       scaleX: options.scale,
//       scaleY: options.scale,
//     });
//   }

//   /* ---------------- Object-specific animations ---------------- */

//   if (type === "radiuschange" && node instanceof MCircle) {
//     return new Konva.Tween({
//       node,
//       radius: (options.target1 ?? 0) * DEFAULT_SCALE,
//       duration,
//       easing,
//     });
//   }

//   if (
//     type === "moveLineEnd" &&
//     (node instanceof Line || node instanceof MVector)
//   ) {
//     return new Konva.Tween({
//       node,
//       duration,
//       easing,
//       points: [
//         node.points()[0],
//         node.points()[1],
//         options.target1 ?? node.points()[2],
//         options.target2 ?? node.points()[3],
//       ],
//     });
//   }

//   if (
//     type === "moveLineStart" &&
//     (node instanceof Line || node instanceof MVector)
//   ) {
//     return new Konva.Tween({
//       node,
//       duration,
//       easing,
//       points: [
//         options.target1 ?? node.points()[0],
//         options.target2 ?? node.points()[1],
//         node.points()[2],
//         node.points()[3],
//       ],
//     });
//   }

//   if (type === "changeCurveRange" && node instanceof ParametricCurve) {
//     const [startMin, startMax] = node.properties.parameterRange;
//     const endMin = options.target1 ?? startMin;
//     const endMax = options.target2 ?? startMax;

//     const proxy = { alpha: 0 };

//     return new Konva.Tween({
//       node: proxy as any,
//       alpha: 1,
//       duration,
//       easing,
//       onUpdate: () => {
//         const a = proxy.alpha;
//         node.setParameterRange([
//           startMin + (endMin - startMin) * a,
//           startMax + (endMax - startMax) * a,
//         ]);
//       },
//     });
//   }

//   if (type === "writetext" && node instanceof MText) {
//     const fullText = node.properties.content;
//     const proxy = { t: 0 };

//     node.setContent("");

//     return new Konva.Tween({
//       node: proxy as any,
//       t: fullText.length,
//       duration: Math.max(0.3, fullText.length * 0.05),
//       easing: Konva.Easings.Linear,
//       onUpdate: () => {
//         node.setContent(fullText.slice(0, Math.floor(proxy.t)));
//       },
//       onFinish: () => {
//         node.setContent(fullText);
//       },
//     });
//   }

//   return null;
// }
