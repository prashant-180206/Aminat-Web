Animat Web is an animation framework focused on building mathematical animations in the browser, inspired by Manim. It uses Konva for canvas rendering and a simple, composable `Mobject` system to construct scenes with shapes, vectors, curves, text, and coordinate planes.

## Overview

Animat centers around a `Scene` that manages a Konva `Stage` and `Layer`. Visual elements are implemented as classes (mobjects) wrapping Konva nodes with a unified properties interface and math-friendly coordinates. A small coordinate conversion utility maps between mathematical space and canvas pixels, making it intuitive to position and scale objects.

## Key Features

- **Math Coordinates:** Consistent conversion between math space and canvas via `p2c()` and `c2p()` using defaults from `core/config.ts`.
- **Scene Management:** `Scene` extends `Konva.Stage` and manages a primary `Layer`, offering `addMobject(name)` via a registry.
- **Mobjects Library:** Ready-to-use shapes in `core/classes/mobjects`:
	- **Simple:** `circle`, `rect`, `dot`, `line`, `polygon`, `text`
	- **Geometric:** `vector`
	- **Group:** `plane` (axes, grid, labels)
- **Parametric Curves:** `ParametricCurve` evaluates `Xfunc` and `Yfunc` with `mathjs` to render curves over a parameter range.
- **Interactive Text Editing:** `MText` supports inline editing on double click with a transformer and DOM textarea overlay.
- **Plane/Grid System:** `MPlane` renders axes, grid lines, and numeric labels over configured x/y ranges.
- **Konva Integration:** All mobjects subclass Konva nodes and sync from typed `properties`.

## Project Structure

- **App (Next.js):**
	- [app/edit/page.tsx](app/edit/page.tsx): lazy-loads the scene view and provides UI to add mobjects.
	- [app/edit/scene.tsx](app/edit/scene.tsx): scene composition (lazy loaded).
- **Core (Engine):**
	- [core/config.ts](core/config.ts): default width/height/scale constants.
	- [core/classes/scene.ts](core/classes/scene.ts): `Scene` stage + layer, adds mobjects from a map.
	- [core/maps/MobjectMap.ts](core/maps/MobjectMap.ts): registry mapping names to mobject constructors.
	- [core/types/properties.ts](core/types/properties.ts): typed property interfaces for all mobjects.
	- [core/utils/conversion.ts](core/utils/conversion.ts): `p2c`/`c2p` math↔canvas conversions.
	- Mobjects:
		- [core/classes/mobjects/simple](core/classes/mobjects/simple): `circle`, `rect`, `dot`, `line`, `polygon`, `text`, `curve`
		- [core/classes/mobjects/geometric/vector.ts](core/classes/mobjects/geometric/vector.ts)
		- [core/classes/mobjects/group/plane.ts](core/classes/mobjects/group/plane.ts)
- **Lib:**
	- [lib/konva.ts](lib/konva.ts): Konva import shim.

## Usage

### Run Dev Server

```bash
npm install
npm run dev
```

Open http://localhost:3000 and navigate to `/edit`.

### Add a Mobject to the Scene

From the edit view, the button triggers `scene.addMobject("plane")` by default (see [app/edit/page.tsx](app/edit/page.tsx)). You can add other mobjects available in the registry: `circle`, `curve`, `rect`, `dot`, `line`, `polygon`, `text`, `vector`, `plane`.

Programmatically, after creating a `Scene` with a valid Konva stage config:

```ts
import Scene from "@/core/classes/scene";

const scene = new Scene({ container: "container-id", width: 850, height: 600 });
scene.addMobject("circle");
scene.addMobject("vector");
scene.addMobject("plane");
```

### Working with Properties

Each mobject exposes a typed `properties` getter/setter. For example:

```ts
import { MRect } from "@/core/classes/mobjects/simple/rect";

const rect = new MRect();
rect.properties = {
	position: { x: 0, y: 0 },
	width: 3,
	height: 2,
	color: "skyblue",
	bordercolor: "black",
	thickness: 2,
};
scene.layer.add(rect);
scene.layer.draw();
```

### Coordinates and Scaling

- Canvas defaults come from [core/config.ts](core/config.ts): width 850, height 600, scale 50.
- To place at math coordinates `(x, y)`, set `properties.position = { x, y }` and the node will be positioned via `p2c`.
- Sizes like radius/width/height often multiply by `DEFAULT_SCALE` to remain math-friendly.

## Notes

- Animat is inspired by Manim but tailored for an interactive web UI with Konva.
- Parametric curves rely on `mathjs` `evaluate`, so ensure expressions like `"sin(t)"` and `"t"` are valid.
- Text editing uses DOM overlay; it requires a browser environment (will not run server-side).

## Roadmap Ideas

- Animation timelines and keyframes for mobject properties.
- Grouping/transform hierarchies beyond plane.
- Export to video or GIF with frame rendering.
