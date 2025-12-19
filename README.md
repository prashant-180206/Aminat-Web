# Animat Web

Animat Web is an interactive, browser-based animation toolkit focused on mathematical visualizations (inspired by Manim). It uses Konva for 2D canvas rendering and a composable “mobject” class system to build scenes with shapes, vectors, curves, text, and coordinate planes. The `/edit` page provides a visual editor to add and manipulate these objects.

## Target & Vision

- Build math animations in the browser with an approachable, interactive editor.
- Keep authoring math-friendly: positions and sizes are expressed in a centered math coordinate system, not pixels.
- Provide an extensible engine where each visual entity is a typed class with a uniform `properties` API.
- Evolve toward timelines and keyframes for property-based animations.

## High-Level Architecture

- **Scene Engine (Core):** `Scene` wraps a Konva `Stage` and a primary `Layer`, manages mobject lifecycle, and centralizes selection. See [core/classes/scene.ts](core/classes/scene.ts).
- **Mobjects:** Classes that extend Konva nodes but expose strongly-typed `properties` for math-first usage. See [core/classes/mobjects](core/classes/mobjects).
- **Registry:** A name→constructor map lets the editor add new objects by key. See [core/maps/MobjectMap.ts](core/maps/MobjectMap.ts).
- **Coordinates:** Utilities convert between math space and canvas pixels using defaults from [core/config.ts](core/config.ts). See [core/utils/conversion.ts](core/utils/conversion.ts).
- **Animation:** `AnimationManager` groups Konva tweens and plays them in sequence or by group. See [core/classes/animation/animationManager.ts](core/classes/animation/animationManager.ts).
- **Editor UI:** The Next.js app renders `/edit`, providing sidebar tools, property editing, and a canvas area wired to the engine via React context. See [app/edit](app/edit).

## Editor Flow (app/edit)

- **Context wiring:** [hooks/SceneContext.tsx](hooks/SceneContext.tsx) holds `scene`, `activeMobject`, and their IDs. The provider wraps [app/edit/layout.tsx](app/edit/layout.tsx).
- **Scene mount:** [app/edit/scene.tsx](app/edit/scene.tsx) creates a `Scene` on mount with `DEFAULT_WIDTH`/`DEFAULT_HEIGHT` and stores it in context.
- **Add objects:** [app/edit/components/mobjectsTab.tsx](app/edit/components/mobjectsTab.tsx) lists entries from the registry. Clicking one calls `scene.addMobject(key)` and wires up selection.
- **Edit properties:** [app/edit/components/propertiesEditor.tsx](app/edit/components/propertiesEditor.tsx) derives typed inputs from the active mobject via [app/edit/components/input/propertyDescriptor.tsx](app/edit/components/input/propertyDescriptor.tsx). Inputs in [app/edit/components/propertyCard.tsx](app/edit/components/propertyCard.tsx) update `mobj.properties` directly.
- **Sidebar shell:** [app/edit/components/sidebar.tsx](app/edit/components/sidebar.tsx) uses Radix Tabs and a collapsible panel for tools.

## Mobjects Library (core/classes/mobjects)

- **Simple:** [circle](core/classes/mobjects/simple/circle.ts), [rect](core/classes/mobjects/simple/rect.ts), [dot](core/classes/mobjects/simple/dot.ts), [line](core/classes/mobjects/simple/line.ts), [polygon](core/classes/mobjects/simple/polygon.ts), [text](core/classes/mobjects/simple/text.ts), [curve](core/classes/mobjects/simple/curve.ts)
- **Geometric:** [vector](core/classes/mobjects/geometric/vector.ts)
- **Group:** [plane](core/classes/mobjects/group/plane.ts) (axes, grid, numeric labels)

All mobjects:

- Extend a Konva node type (`Konva.Shape`, `Konva.Group`, etc.).
- Maintain a private `_properties` store and expose `get properties()`/`set properties()`.
- Convert between math↔canvas as needed using `p2c`/`c2p`.

Notable implementations:

- **Text (`MText`):** Double-click to inline-edit content using a DOM `<textarea>` overlay and a Konva `Transformer` for width handles.
- **Plane (`MPlane`):** Renders axes, grid lines, and labels based on `xrange`/`yrange`, `labelsize`, `axiscolor`, etc.

## Coordinates & Defaults

- Defaults live in [core/config.ts](core/config.ts): `DEFAULT_WIDTH = 850`, `DEFAULT_HEIGHT = 480`, `DEFAULT_SCALE = 50`.
- Convert canvas→math: `c2p(x, y)`; math→canvas: `p2c(x, y)` ([core/utils/conversion.ts](core/utils/conversion.ts)).
- Most sizes and positions are expressed in math units; mobjects multiply by `DEFAULT_SCALE` internally to render in pixels.

## Scene API (core/classes/scene.ts)

- `addMobject(key: string)`: instantiates via the registry, adds to the layer, assigns an id like `name-N`, and makes it draggable.
- `removeMobject(id: string)`: removes and cleans up the Konva node and internal lists.
- `getMobjectById(id: string)`: convenience lookup in the layer.
- `activeMobject`: tracks the current selection (also mirrored in editor context).

## Animation (core/classes/animation)

- `AnimationManager` stores `Konva.Tween`s, groups them, and advances through groups with `animate()`, `animateNext()`, or `animateGroup(ids)`. Useful for sequencing property changes.
- `CreateAnimation` is a thin extension of `Konva.Tween` for future specialization.

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
- `TrackerManager` exists as a placeholder in [core/classes/Tracker/TrackerManager.ts](core/classes/Tracker/TrackerManager.ts) for future features.
- Parametric curves rely on `mathjs` expressions; invalid expressions will fail to render.

## Roadmap

- Property keyframing and timeline UI hooked to `AnimationManager`.
- Group transforms and nested hierarchies beyond the plane.
- Export to MP4/GIF via headless frame rendering.
- Snapping, rulers, and better selection handles.
