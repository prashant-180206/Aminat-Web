# Animat Web

Animat Web is an interactive, browser-based animation toolkit focused on mathematical visualizations (inspired by Manim). It uses Konva for 2D canvas rendering and a composable “mobject” class system to build scenes with shapes, vectors, curves, text, and coordinate planes. The `/edit` page provides a visual editor to add and manipulate these objects.

## Target & Vision

- Build math animations in the browser with an approachable, interactive editor.
- Keep authoring math-friendly: positions and sizes are expressed in a centered math coordinate system, not pixels.
- Provide an extensible engine where each visual entity is a typed class with a uniform `properties` API.
- Evolve toward timelines and keyframes for property-based animations.

## High-Level Architecture

- **Scene Engine:** `Scene` wraps `Konva.Stage` + a primary `Konva.Layer`, adds/removes mobjects, tracks `activeMobject`, and integrates `AnimationManager` + `TrackerManager`. See [core/classes/scene.ts](core/classes/scene.ts).
- **Mobjects:** Typed classes extending Konva nodes with math-first `properties`, per-node `animgetter`, and a public `trackerconnector`. See [core/classes/mobjects](core/classes/mobjects).
- **Registry:** `MobjectMap` maps keys → constructors for editor creation. See [core/maps/MobjectMap.ts](core/maps/MobjectMap.ts).
- **Coordinates:** `p2c`/`c2p` convert math↔canvas using defaults from [core/config.ts](core/config.ts). See [core/utils/conversion.ts](core/utils/conversion.ts).
- **Animation:** Per-node catalogs (`AnimGetter`) produce tweens; `AnimationManager` groups and plays them. See [core/classes/animation](core/classes/animation).
- **Trackers:** `ValueTracker`, `Slider`, and `TrackerManager` manage numeric controls; `TrackerConnector` binds tracker values to node attributes. See [core/classes/Tracker](core/classes/Tracker).
- **Editor UI:** The Next.js `/edit` page provides sidebar tools, property editing, and canvas wired via React context. See [app/edit](app/edit).

## Editor Flow (app/edit)

- **Context wiring:** [hooks/SceneContext.tsx](hooks/SceneContext.tsx) holds `scene`, `activeMobject`, and their IDs. The provider wraps [app/edit/layout.tsx](app/edit/layout.tsx).
- **Scene mount:** [app/edit/scene.tsx](app/edit/scene.tsx) creates a `Scene` on mount with `DEFAULT_WIDTH`/`DEFAULT_HEIGHT` and stores it in context.
- **Add objects:** [app/edit/components/mobjectsTab.tsx](app/edit/components/mobjectsTab.tsx) lists entries from the registry. Clicking one calls `scene.addMobject(key)` and wires up selection.
- **Edit properties:** [app/edit/components/propertiesEditor.tsx](app/edit/components/propertiesEditor.tsx) derives typed inputs from the active mobject via [app/edit/components/input/propertyDescriptor.tsx](app/edit/components/input/propertyDescriptor.tsx). Inputs in [app/edit/components/propertyCard.tsx](app/edit/components/propertyCard.tsx) update `mobj.properties` directly.
- **Sidebar shell:** [app/edit/components/sidebar.tsx](app/edit/components/sidebar.tsx) uses Radix Tabs and a collapsible panel for tools.

 

## Extending the System

1. Create a class that extends a Konva node and exposes typed `properties`.

```ts
// Example: Minimal ellipse (sketch)
class MEllipse extends Konva.Ellipse {
  private _properties = { position: { x: 0, y: 0 }, rx: 2, ry: 1, color: "#09f", scale: 1, rotation: 0, opacity: 1, zindex: 0 };
  get properties() { return { ...this._properties }; }
  set properties(p: Partial<typeof this._properties>) { Object.assign(this._properties, p); /* sync Konva + p2c */ }
}
```

1. Register it in [core/maps/MobjectMap.ts](core/maps/MobjectMap.ts):

```ts
import { Ellipse } from "lucide-react";
// ...
ellipse: { func: () => new MEllipse(), name: "Ellipse", Icon: Ellipse }
```

It will automatically appear in the `/edit` sidebar. If you add new property shapes, extend the descriptors in [app/edit/components/input/propertyDescriptor.tsx](app/edit/components/input/propertyDescriptor.tsx) and rendering in [app/edit/components/propertyCard.tsx](app/edit/components/propertyCard.tsx).

## Development

- Node/PNPM/NPM: standard Next.js 16 app with React 19.
- Key deps: `konva`, `react-konva`, `lucide-react`, `@radix-ui/*`, `mathjs`.

Scripts:

```bash
npm install
npm run dev   # start dev server on http://localhost:3000
npm run build # build
npm run start # start production build
npm run lint  # run eslint
```

Open the editor at <http://localhost:3000/edit>

## Notes & Limitations

- Server-side rendering is disabled for the scene; Konva nodes are created client-side in [app/edit/scene.tsx](app/edit/scene.tsx).
- `TrackerManager` registers `ValueTracker`s and optional `Slider`s; see [core/classes/Tracker/TrackerManager.ts](core/classes/Tracker/TrackerManager.ts).
- Parametric curves rely on `mathjs` expressions; invalid expressions will fail to render.

## Roadmap

- Property keyframing and timeline UI hooked to `AnimationManager`.
- Group transforms and nested hierarchies beyond the plane.
- Export to MP4/GIF via headless frame rendering.
- Snapping, rulers, and better selection handles.

<!-- Core Details removed; content promoted to top-level sections below -->

## Coordinates & Defaults

- Defaults: see [core/config.ts](core/config.ts)
  - `DEFAULT_WIDTH = 850`, `DEFAULT_HEIGHT = 480`, `DEFAULT_SCALE = 50`.
- Conversions: see [core/utils/conversion.ts](core/utils/conversion.ts)
  - Canvas → Math: $x_\text{math} = \frac{x - \text{DEFAULT\_WIDTH}/2}{\text{DEFAULT\_SCALE}}$, $y_\text{math} = \frac{y - \text{DEFAULT\_HEIGHT}/2}{\text{DEFAULT\_SCALE}}$.
  - Math → Canvas: $x_\text{px} = x\cdot\text{DEFAULT\_SCALE} + \text{DEFAULT\_WIDTH}/2$, $y_\text{px} = y\cdot\text{DEFAULT\_SCALE} + \text{DEFAULT\_HEIGHT}/2$.

## Scene

- Class: [core/classes/scene.ts](core/classes/scene.ts)
- Responsibilities:
  - Owns a Konva `Stage` and primary `Layer`.
  - Adds/removes mobjects via the registry [core/maps/MobjectMap.ts](core/maps/MobjectMap.ts).
  - Tracks `activeMobject` and updates it on click (`UpdateFromKonvaProperties()`).
  - Orchestrates animation playback through `AnimationManager`.
  - Hosts `TrackerManager` for UI-bound numeric controls.
- Key methods:
  - `addMobject(type: string): Mobject` — instantiates, IDs, draggables, layers.
  - `removeMobject(id: string)` — destroys and redraws.
  - `getAnimationGroups(): AnimInfo[][]`, `playCurrentGroup()`, `resetAnimations()`, `moveAnimationGroup()`.

## Mobjects

All mobjects expose a typed `properties` object and keep Konva attributes in sync. They also implement `UpdateFromKonvaProperties()` to reflect manual edits back into `properties`.

- Circle: [core/classes/mobjects/simple/circle.ts](core/classes/mobjects/simple/circle.ts)
  - Properties: `radius`, `color`, `bordercolor`, `thickness`, `position`, `scale`, `rotation`, `opacity`, `zindex`.
  - Sync: `radius` uses math units scaled by `DEFAULT_SCALE`.
- Rect: [core/classes/mobjects/simple/rect.ts](core/classes/mobjects/simple/rect.ts)
  - Properties: `width`, `height`, `cornerRadius`, plus base.
  - Positioning centers by subtracting half width/height for visual middle alignment.
- Line: [core/classes/mobjects/simple/line.ts](core/classes/mobjects/simple/line.ts)
  - Properties: `start`, `end`, `thickness`, plus base.
  - `points` are set using math→canvas conversion for endpoints.
- Dot: [core/classes/mobjects/simple/dot.ts](core/classes/mobjects/simple/dot.ts)
  - Properties: `radius` plus base; stroke width is zero.
- Polygon: [core/classes/mobjects/simple/polygon.ts](core/classes/mobjects/simple/polygon.ts)
  - Properties: `points[]`, `thickness`, `bordercolor`, plus base.
  - Uses custom `sceneFunc` and `hitFunc` to draw in local coords; points are converted relative to node origin.
- Text: [core/classes/mobjects/simple/text.ts](core/classes/mobjects/simple/text.ts)
  - Properties: `content`, `fontsize`, `fontfamily`, `bold`, `italic`, plus base.
  - Inline editing: double-click to open a DOM textarea overlay; includes a Konva `Transformer` for resizing.
- Curve (Parametric): [core/classes/mobjects/simple/curve.ts](core/classes/mobjects/simple/curve.ts)
  - Properties: `parameterRange`, `Xfunc`, `Yfunc`, `thickness`, `bordercolor`, plus base.
  - Sampling: builds points by evaluating expressions with `mathjs`; converts to canvas and offsets by position.
- Vector: [core/classes/mobjects/geometric/vector.ts](core/classes/mobjects/geometric/vector.ts)
  - Based on `Konva.Arrow`; Properties inherit from `Line` and add `pointerSize`.
- Plane: [core/classes/mobjects/group/plane.ts](core/classes/mobjects/group/plane.ts)
  - Renders axes/grid/labels from `xrange`/`yrange`; configurable `labelsize`, `axiscolor`, `gridthickness`, etc.

## Animation

- Manager: [core/classes/animation/animationManager.ts](core/classes/animation/animationManager.ts)
  - Stores tweens (`AnimInfo`), groups IDs into playback sets, cycles with `animate()`.
  - Group control: `moveGroup(index, up|down)`, `removeAnimation(id)`, `resetAll()`.
- Getter (per-node catalog): [core/classes/animation/animgetter.ts](core/classes/animation/animgetter.ts)
  - Built-ins registered per node: `Create`, `Destroy`, `Move`.
    - `Create`: scales from 0 and fades in to node’s current scale/opacity.
    - `Destroy`: scales to 0 and fades out.
    - `Move`: animates `x,y` with easing, converts math→canvas via `p2c`.
  - Extend via `addAnimFunc(name, meta)` where `meta.func(args) => AnimInfo`.
- Easing registry: [core/maps/easingMap.ts](core/maps/easingMap.ts)
  - Keys: `Linear`, `EaseIn`, `EaseOut`, `EaseInOut`, `BackEaseIn`, `BackEaseOut`, `BackEaseInOut`, `BounceEaseIn`, `BounceEaseOut`, `BounceEaseInOut`, `StrongEaseIn`, `StrongEaseOut`, `StrongEaseInOut`.

## Trackers & UI Controls

- `ValueTracker`: [core/classes/Tracker/valuetracker.ts](core/classes/Tracker/valuetracker.ts)
  - Holds a numeric value, notifies registered updaters each change.
  - `animateTo(target, { duration, easing, onFinish })` returns a Konva tween that drives the value smoothly.
- `Slider`: [core/classes/Tracker/slider.ts](core/classes/Tracker/slider.ts)
  - Konva UI component bound to a `ValueTracker`; draggable thumb updates the tracker; tracker changes reposition the thumb.
  - Configurable `min`, `max`, `width`, `height`, `trackColor`, `thumbColor`, `thumbRadius`.
- `TrackerManager`: [core/classes/Tracker/TrackerManager.ts](core/classes/Tracker/TrackerManager.ts)
  - Registers named `ValueTracker`s; optionally materializes a `Slider` and adds it to the layer.
  - Helpers: `animateTrackerTo(name, target)`, `animateSliderIn(name)`, `animateSliderOut(name)`.
- `TrackerConnector`: [core/classes/Tracker/TrackerConnector.ts](core/classes/Tracker/TrackerConnector.ts)
  - Per-mobject public `trackerconnector` for binding trackers to node attributes.
  - Built-in connectors: `x`, `y`, `rotation`, `scale` (uniform), `opacity`.
  - API: `addConnectorFunc(name, (value) => void)`, `getConnectorFunc(name)`, `getConnectorFuncNames()`.

## Typings

- Animation types: [core/types/animation.ts](core/types/animation.ts)
  - `AnimInfo`: `{ id, mobjId, type, label, anim: Konva.Tween }`.
  - `AnimMeta`: per-catalog entry with `title`, `type`, `input` schema, and `func(args)` to produce `AnimInfo`.
- Mobjects union: [core/types/mobjects.ts](core/types/mobjects.ts)
  - `Mobject` union of all concrete classes; `MobjectMapType` for registry entries.
- Properties: [core/types/properties.ts](core/types/properties.ts)
  - `BaseProperties` plus specific `CircleProperties`, `RectangleProperties`, `TextProperties`, `PolygonProperties`, `DotProperties`, `LineProperties`, `VectorProperties`, `CurveProperties`, `PlaneProperties`.

## Usage Examples

Bind a slider to move a dot on X:

```ts
const scene = /* created stage */;
const dot = scene.addMobject("dot");
const tracker = scene["trackerManager"].addValueTracker("xTracker", { initial: 0, min: -5, max: 5, slider: { width: 240, position: { x: 20, y: 420 } } });

// Connect tracker to dot's x
const xConnector = dot.trackerconnector.getConnectorFunc("x");
if (xConnector) tracker.addUpdater((v) => xConnector(v));

// Animate slider appearance
scene["trackerManager"].animateSliderIn("xTracker")?.play();
```

Create and play a move animation group:

```ts
// Build an animation via per-node catalog
const moveMeta = dot.animgetter.getAnimMeta("Move");
const move = moveMeta?.func({ duration: 1, easing: "EaseInOut", toX: 2, toY: 1 });

if (move) {
  const ids = scene.addAnimations(move);
  scene.playCurrentGroup(); // plays the group containing `move`
}
```

## Implementation Notes

- Property setters use partial objects; only provided keys are synced to Konva, allowing fine-grained updates.
- `UpdateFromKonvaProperties()` reads back Konva state to `properties` for manual drags/edits; not all visual attributes are mirrored to avoid noisy writes.
- Many mobjects perform math→canvas conversions on assignment; sizes and positions are consistently expressed as math units.
