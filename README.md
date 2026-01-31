# Animat

Animat is a scene-based animation system built on top of Konva. It provides a structured **Scene** architecture for creating, animating, and exporting mathematical and geometric visuals with a rich property-driven UI.

## Web UI Overview

The application includes a full web interface built on Next.js, organized into distinct modules:

- **Editor** (Projects): Create and edit scenes, manage Mobjects and properties, and preview animations.
	- Main entry: /project
	- Editor views: /project/[projectId]/edit

- **Learning Module**: Student-facing content that surfaces only published topics, subtopics, tutorials, and tests.
	- Entry: /learn

- **Teacher Portal**: Content management for topics, subtopics, tutorials, and tests (publish/unpublish supported).
	- Entry: /teacher

- **Auth**: Sign in / sign up with role selection (student/teacher).
	- Routes: /auth/signin, /auth/signup

Role-based access control protects teacher/admin routes and APIs.

## Scene System Overview

At the heart of the app is a **Scene** (extends `Konva.Stage`) that manages layers, objects, animations, and dynamic trackers. The Scene contains multiple layers (background, main, text, slider) and coordinates all subsystems.

### Core Scene Features

- **Mobjects (Mathematical Objects):** Visual building blocks (shapes, text, composite objects) that extend `Konva.Group`.
- **Property Controllers:** Each Mobject is driven by a `*Property` controller responsible for state, UI, and synchronization.
- **Managers:** Centralized managers for Mobjects, animations, trackers, and connections.
- **Factories:** Standardized creation of Mobjects through type-based factories.
- **Serialization:** Save/restore complete scene state to/from JSON.
- **Animation:** Keyframe-based animation support through `AnimGetter`.
- **Trackers:** Dynamic values (sliders, expressions) that can bind to Mobject properties.

## Core Architecture

The architecture follows a **separation of concerns** pattern:

1. **Mobjects** = Visual layer (Konva objects)
2. **Controllers (Properties)** = State + UI + behavior
3. **Managers** = Lifecycle and orchestration
4. **Factories** = Consistent object creation

### Mobjects (Visual Layer)

Mobjects are custom Konva groups that:

- Encapsulate visual primitives (e.g., `Konva.Circle`, `Konva.Text`)
- Expose a controller via `features`
- Support animations via `AnimGetter`
- Support tracker bindings via `TrackerConnector`
- Implement `storeAsObj()` / `loadFromObj()` for serialization

Examples include:

- **Simple Shapes:** `Dot`, `Circle`, `Rect`, `Line`, `Polygon`, `Curve`
- **Geometric Objects:** `Vector`, `DoubleArrow`, `Arc`
- **Text:** `MText`, `LatexText`, `DynamicText`
- **Composite:** `MPlane`, `MNumberLine`

### Controllers (Property Layer)

Controllers (`*Property`) manage Mobject state and UI:

- Store properties (position, color, size, rotation, etc.)
- Provide `update()` to sync changes to Konva
- Generate UI components via `getUIComponents()`
- Handle persistence via `getData()` / `setData()`
- Refresh state from the canvas when objects move

All controllers extend `BaseProperty`, which provides the standard property set (position, color, scale, rotation, opacity, z-index).

### Managers

Managers coordinate scene-level behavior:

- **MobjectManager:** create, track, remove Mobjects
- **AnimationManager:** timeline and keyframes
- **TrackerManager:** tracker lifecycle and values
- **ConnectionManager:** tracker bindings to Mobject properties
- **TrackerAnimator:** animation of tracker values

### Factories

Factories ensure consistent object creation:

- **MobjectFactory:** builds objects from type strings
- **MobjectMap:** maps type identifiers to constructors

## Serialization & Persistence

Each Mobject provides:

- `storeAsObj()` → JSON snapshot
- `loadFromObj()` → restore from JSON

The Scene serializes/deserializes the full project state by combining all Mobjects, controllers, trackers, and animations.

## Animation Support

Animation is driven by the `AnimGetter` attached to every Mobject:

- Retrieve current values for animation
- Set values during playback
- Interpolate between keyframes

## Tracker System

Trackers provide dynamic, reactive values:

- Slider-controlled values
- Computed expressions
- Automatic propagation to bound properties

The `TrackerConnector` binds trackers to Mobject properties so changes update the scene instantly.

## Where to Learn More

- Core architecture: [core/classes/README.md](core/classes/README.md)
- Managers & factories: [core/classes/managers/README.md](core/classes/managers/README.md)
- Mobjects catalog: [core/classes/mobjects/README.md](core/classes/mobjects/README.md)
- Controllers & UI: [core/classes/controllers/README.md](core/classes/controllers/README.md)

---

If you want a deeper breakdown of Scene methods or how to add new Mobjects/controllers, check the core READMEs above.
