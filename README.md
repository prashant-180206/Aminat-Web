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

The tracker system enables dynamic, interactive animations by binding numeric values to mobject properties. It consists of four main components working together:

### ValueTracker

- **Location**: [core/classes/Tracker/valuetracker.ts](core/classes/Tracker/valuetracker.ts)
- **Purpose**: Core reactive value holder that notifies all registered updaters when its value changes.
- **Key Features**:
  - Holds a single numeric `_value` with getter/setter
  - Maintains a `Map<string, UpdaterEntry>` of updaters, where each entry contains:
    - `cb`: callback function `(value: number) => void`
    - `expr`: compiled mathjs expression for value transformation
  - When `value` is set, evaluates each expression with `{ t: newValue }` and calls the callback with the result
  - Threshold check: only triggers updates if `Math.abs(oldValue - newValue) >= 0.001`
- **API**:
  - `addUpdater(id: string, cb: (value) => void, expression: string = "t")`: Registers an updater with optional mathjs expression (default is identity `"t"`). Returns `true` on success, `false` if expression is invalid. Immediately invokes callback with current value.
  - `removeUpdater(id: string)`: Unregisters an updater by ID
  - `getUpdaterIds()`: Returns array of all registered updater IDs
  - `animateTo(target, { duration?, easing?, onFinish? })`: Creates a Konva tween that smoothly animates the tracker value over time

### PointValueTracker

- **Location**: [core/classes/Tracker/ptValuetracker.ts](core/classes/Tracker/ptValuetracker.ts)
- **Purpose**: Couples two `ValueTracker`s (`x` and `y`) so 2D attributes (positions, endpoints, etc.) can be driven with independent expressions per axis.
- **Structure**: Provides `.x` and `.y` getters exposing the underlying `ValueTracker` instances.
- **Scene binding**: `Scene.ConnectPtValueTrackerToMobject(trackerName, mobjectId, functionNameX, functionNameY, expressionX, expressionY)` registers two updaters (one per axis) against separate connector functions.
- **Persistence**: Saved in `ptValFuncRelations` with both function names and expressions for X and Y; reapplied during `scene.loadFromObj()`.

### Slider

- **Location**: [core/classes/Tracker/slider.ts](core/classes/Tracker/slider.ts)
- **Purpose**: Visual UI control (Konva.Group) that provides bidirectional binding with a ValueTracker
- **Structure**:
  - Extends `Konva.Group` containing:
    - `track`: Rounded rectangle for the slider rail
    - `thumb`: Draggable circle for value control
  - Stores reference to its `ValueTracker` and `min`/`max` range
- **Bidirectional Binding**:
  - **User → Tracker**: Dragging thumb or clicking track updates `thumb.x()`, which is converted to tracker value: `value = min + (thumb.x / width) * (max - min)`
  - **Tracker → Thumb**: Tracker automatically registers itself as an updater (ID: `"Slider"`) to reposition thumb when value changes externally
- **Configuration**: `width`, `height`, `min`, `max`, `initial`, `trackColor`, `thumbColor`, `thumbRadius`
- **Animation**: Includes `appearAnim()` and `disappearAnim()` tweens for smooth UI transitions
- **API**: `getMin()`, `getMax()`, `setRange(min, max)`, `setValue(v)`, `getValue()`

### TrackerManager

- **Location**: [core/classes/Tracker/TrackerManager.ts](core/classes/Tracker/TrackerManager.ts)
- **Purpose**: Central registry for all ValueTrackers and their optional Sliders in a scene
- **Data Structure**:
  - `Map<string, TrackerMeta>` where `TrackerMeta = { id, tracker: ValueTracker, slider: Slider | null }`
  - Holds reference to the scene's `Konva.Layer` for adding sliders
- **Lifecycle**:
  - `addValueTracker(name, value)`: Creates and registers a new ValueTracker with initial value
  - `addSlider(sliderName, { min, max })`: Creates a Slider for an existing tracker. Returns `{ success, slider }`. **Note**: Slider is created but NOT automatically added to layer—caller must do `layer.add(slider)`
  - `remove(name)`: Destroys slider (if exists) and removes tracker from registry
  - `clear()`: Destroys all sliders and clears the registry
- **Lookup**:
  - `getTracker(name)`: Returns ValueTracker instance or null
  - `getPtValueTracker(name)`: Returns the point tracker wrapper (with `.x` and `.y`) or null
  - `getTrackerMeta(name)`: Returns full TrackerMeta or null
  - `getAllNames()`: Returns array of all tracker names
  - `getAllTrackerMetas()`: Returns array of all TrackerMeta objects
  - `getAllPtTrackerMetas()`: Returns array of point tracker metas (`{ id, tracker: { x, y }, slider }`)
- **Persistence**:
  - `storeAsObj()`: Serializes to `TrackerManagerData` containing array of `{ id, value, sliders: { min, max } | null }`
  - `loadFromObj(obj)`: Recreates trackers and sliders from saved data. **Critical**: Adds sliders to layer during restoration

### TrackerConnector

- **Location**: [core/classes/Tracker/TrackerConnector.ts](core/classes/Tracker/TrackerConnector.ts)
- **Purpose**: Per-mobject registry of connector functions that allow trackers to control mobject properties
- **Built-in Connectors**: Each mobject has a `trackerconnector` instance with predefined functions:
  - `x`: Updates mobject's X position in math coordinates
  - `y`: Updates mobject's Y position in math coordinates
  - `rotation`: Updates rotation in degrees
  - `scale`: Updates uniform scale factor
  - `opacity`: Updates opacity (0-1)
- **API**:
  - `addConnectorFunc(name: string, func: (value: number) => void)`: Registers a custom connector function
  - `getConnectorFunc(name: string)`: Retrieves connector function by name
  - `getConnectorFuncNames()`: Returns array of all available connector names

### Scene Integration & Data Flow

The `Scene` class orchestrates tracker-mobject connections:

1. **Connection Storage**: Scene maintains `valFuncRelations: ValFuncRelations[]` where each entry is:

   ```ts
   { trackerName: string, mobjectId: string, functionName: string, expression: string }
   ```

2. **Creating Connections**:

   ```ts
   ConnectValueTrackerToMobject(trackerName, mobjectId, functionName, expression): boolean
   ```

   - Retrieves tracker and mobject
   - Gets connector function from mobject's `trackerconnector`
   - Calls `tracker.addUpdater(uniqueId, connectorFunc, expression)`
   - Stores relation in `valFuncRelations` for persistence
   - Returns `true` on success

  Scene also maintains `ptValFuncRelations: PtValFuncRelations[]` where each entry is:

  ```ts
  { trackerName: string, mobjectId: string, functionNameX: string, functionNameY: string, expressionX: string, expressionY: string }
  ```

  Connections are created with:

  ```ts
  ConnectPtValueTrackerToMobject(trackerName, mobjectId, functionNameX, functionNameY, expressionX, expressionY)
  ```
  - Fetches point tracker (`x` and `y`), mobject, and two connector functions
  - Registers two updaters (one per axis) with independent expressions
  - Persists the relation in `ptValFuncRelations`

3. **Persistence Flow**:
   - **Save** (`scene.storeAsObj()`):
     - Serializes all mobjects with their properties
     - Calls `trackerManager.storeAsObj()` to save tracker values and slider configs
     - Stores `valFuncRelations` and `ptValFuncRelations` arrays (updater connections)
     - Packages into `SceneData` object
   - **Load** (`scene.loadFromObj(obj)`):
     - Recreates all mobjects via `addMobject()` and restores their properties
     - Calls `trackerManager.loadFromObj()` which:
       - Recreates ValueTrackers with saved values
       - Recreates Sliders with saved ranges and **adds them to layer**
     - Iterates `valFuncRelations` and `ptValFuncRelations` to reconnect trackers to mobject functions (X and Y independently for point trackers)
     - **Important**: Updaters are NOT stored in ValueTracker—they're regenerated from `valFuncRelations`

### Complete Usage Example

```ts
// 1. Create scene and mobject
const scene = new Scene({ container: "canvas", width: 850, height: 480 });
const circle = scene.addMobject("circle");

// 2. Create tracker with initial value
const { tracker, success } = scene.trackerManager.addValueTracker("xPos", 0);

// 3. (Optional) Add slider UI
const { success: sliderSuccess, slider } = scene.trackerManager.addSlider("xPos", {
  min: -5,
  max: 5
});
if (sliderSuccess && slider) {
  scene.layer.add(slider);
  slider.position({ x: 50, y: 400 });
  slider.appearAnim().play();
}

// 4. Connect tracker to mobject property with expression
scene.ConnectValueTrackerToMobject(
  "xPos",           // tracker name
  circle.id(),      // mobject ID
  "x",              // connector function name
  "2 * sin(t)"      // mathjs expression: transforms tracker value
);

// 5. Animate tracker (slider and circle move together)
tracker.animateTo(3, { duration: 2, easing: "EaseInOut" }).play();

// 6. Save entire scene (includes all connections)
const sceneData = scene.storeAsObj();
localStorage.setItem("myScene", JSON.stringify(sceneData));

// 7. Load scene later (everything reconnects automatically)
const loaded = JSON.parse(localStorage.getItem("myScene"));
scene.loadFromObj(loaded);
```

### Design Rationale

- **Separation of Concerns**: ValueTracker handles reactive value propagation, Slider handles UI, TrackerManager handles registry
- **Expression Flexibility**: Mathjs expressions allow non-linear mappings (e.g., `"sin(t * pi)"`, `"t^2"`) without code changes
- **Updater Pattern**: Single tracker can drive multiple mobject properties simultaneously
- **Persistence Strategy**: Storing `valFuncRelations` instead of updater state allows reconnection with fresh mobject instances after load
- **Lazy Slider Creation**: Sliders are optional UI—trackers can exist and be animated without visual controls

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
