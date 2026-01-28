# Core Classes Architecture

This directory contains the core architecture for creating, managing, and controlling custom Konva objects in the Animat animation system.

## Overview

The architecture follows a **separation of concerns** pattern, where:
- **Mobjects** (Mathematical Objects) are the visual Konva elements displayed on canvas
- **Controllers (Properties)** manage the state and behavior of these Mobjects
- **Managers** handle collections and lifecycle of Mobjects
- **Factories** create instances following consistent patterns

## Directory Structure

```
core/classes/
├── mobjects/           # Visual Konva objects (Circle, Dot, Line, etc.)
│   ├── simple/         # Basic shapes (Circle, Dot, Line, Rectangle, etc.)
│   ├── geometric/      # Geometric objects (Vector, Arc)
│   ├── text/           # Text-based objects (Text, LaTeX, Dynamic Text)
│   └── group/          # Composite objects (Plane, NumberLine)
├── controllers/        # Property controllers for Mobjects
│   ├── base/           # Base controller with common properties
│   ├── simple/         # Controllers for simple shapes
│   ├── geometry/       # Controllers for geometric objects
│   ├── text/           # Controllers for text objects
│   ├── group/          # Controllers for composite objects
│   └── input/          # UI input components for controllers
├── managers/           # Manage collections and lifecycle
│   ├── MobjectManager.ts      # Manages all Mobjects in the scene
│   ├── AnimationManager.ts    # Manages animations
│   ├── TrackerManager.ts      # Manages trackers
│   └── ConnectionManager.ts   # Manages connections between trackers and Mobjects
├── factories/          # Factory patterns for creating objects
│   ├── Mobjectfactory.ts      # Creates Mobjects
│   └── mobjects/              # Factory helpers for Mobjects
├── serializers/        # Serialize/deserialize scene data
├── animation/          # Animation-related classes
├── Tracker/            # Tracker system for dynamic values
└── scene.ts            # Main Scene class (extends Konva.Stage)
```

## Architecture Pattern

### 1. Mobjects (Visual Layer)

Mobjects are custom Konva objects that represent visual elements on the canvas. Each Mobject:

- **Extends Konva.Group** (or appropriate Konva class)
- Contains Konva shape primitives (Circle, Arrow, Text, etc.)
- Has a **features** property that holds its controller
- Implements serialization methods (`storeAsObj()`, `loadFromObj()`)
- Has an **AnimGetter** for animation support
- Has a **TrackerConnector** for dynamic value binding

**Example Structure** (Dot):
```typescript
export class Dot extends Konva.Group {
  public circle: Konva.Circle;        // Visual element
  public label: Konva.Text;           // Label element
  public features: DotProperty;       // Controller
  public animgetter: AnimGetter;      // Animation support
  public trackerconnector: TrackerConnector; // Tracker support
  
  constructor(TYPE: string) {
    super();
    this.circle = new Konva.Circle();
    this.label = new Konva.Text();
    this.features = new DotProperty(this);
    // ... initialization
  }
}
```

### 2. Controllers (Property Layer)

Controllers (named with `*Property` suffix) manage the state and behavior of Mobjects. They:

- **Extend BaseProperty** (which provides common properties)
- Store property values (position, color, scale, rotation, etc.)
- Provide `update()` method to modify properties
- Generate UI components via `getUIComponents()`
- Handle serialization with `getData()` and `setData()`
- Sync with Konva objects when properties change

**Example Structure** (DotProperty):
```typescript
export class DotProperty extends BaseProperty {
  protected radius: number = 10;
  protected label: LabelProperty;
  
  constructor(mobj: Dot) {
    super(mobj.circle, mobj);
    this.label = new LabelProperty(mobj.label);
  }
  
  update(prop: Partial<DotProperties>): void {
    super.update(prop);  // Handle base properties
    if (prop.radius !== undefined) {
      this.radius = prop.radius;
      this.shapemobj.radius(this.radius);  // Update Konva object
    }
  }
  
  getUIComponents(): { name: string; component: React.ReactNode }[] {
    // Returns React components for UI controls
  }
}
```

### 3. Inheritance Hierarchy

Controllers follow an inheritance pattern to share common functionality:

```
BaseProperty (position, color, scale, rotation, opacity, zindex)
    ├── Simple shapes extend BaseProperty
    │   ├── DotProperty (adds radius, label)
    │   ├── CircleProperty (adds radius)
    │   └── RectProperty (adds width, height)
    │
    ├── LineProperty extends BaseProperty (adds points, strokeWidth)
    │   └── VectorProperty extends LineProperty (adds pointerSize)
    │
    └── Composite objects extend BaseProperty
        └── PlaneProperty (adds plane-specific properties)
```

### 4. Managers

Managers handle collections and lifecycle operations:

- **MobjectManager**: Creates, tracks, and removes Mobjects
- **AnimationManager**: Manages animation timeline and keyframes
- **TrackerManager**: Manages tracker instances
- **ConnectionManager**: Links trackers to Mobject properties

### 5. Scene

The Scene class (extends `Konva.Stage`) is the main container:
- Has multiple layers (background, main, text, slider)
- Contains all managers
- Provides methods to add/remove Mobjects and Trackers
- Handles serialization/deserialization of entire scene

## Key Concepts

### Property Updates Flow

When a property is updated:
1. User interacts with UI component
2. UI component calls `property.update()`
3. Controller updates internal state
4. Controller updates corresponding Konva object
5. Canvas is automatically redrawn

### Serialization

All Mobjects can be serialized to JSON:
```typescript
// Save
const data = mobject.storeAsObj();
// Returns: { properties: {...}, id: "Dot-1" }

// Load
mobject.loadFromObj(data);
```

### UI Component Generation

Controllers dynamically generate React UI components:
```typescript
const components = mobject.getUIComponents();
// Returns array of { name: string, component: ReactNode }
// These are rendered in the property panel
```

### Animation Support

Each Mobject has an `AnimGetter` that provides animation capabilities:
- Get/set animated properties
- Create keyframes
- Interpolate values

### Tracker Support

Trackers are dynamic values that can be connected to Mobject properties:
- Sliders, value trackers, computed values
- `TrackerConnector` handles binding between tracker and Mobject
- Changes to tracker automatically update connected properties

## Creating a New Mobject

To create a new custom Mobject, follow these steps:

### 1. Create the Mobject Class

Create file in `mobjects/[category]/your-mobject.ts`:

```typescript
import Konva from "@/lib/konva";
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { YourMobjectProperty, YourMobjectProperties } from "../../controllers/[category]/your-mobject";

export class YourMobject extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  public shape: Konva.Shape;  // Your visual element
  public features: YourMobjectProperty;
  private _TYPE: string;

  constructor(TYPE: string) {
    super();
    this._TYPE = TYPE;
    
    // Create Konva shape
    this.shape = new Konva.Shape();
    this.add(this.shape);
    
    // Initialize support systems
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);
    
    // Initialize controller
    this.features = new YourMobjectProperty(this);
    
    this.name("YourMobject");
  }

  type(): string {
    return this._TYPE;
  }

  get properties(): YourMobjectProperties {
    return { ...this.features.getData() };
  }

  getUIComponents() {
    return this.features.getUIComponents();
  }

  storeAsObj() {
    return {
      properties: this.features.getData(),
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.features.setData(obj.properties as YourMobjectProperties);
    this.features.refresh();
  }
}
```

### 2. Create the Controller (Property Class)

Create file in `controllers/[category]/your-mobject.tsx`:

```typescript
import Konva from "@/lib/konva";
import { BaseProperties, BaseProperty } from "../base/base";
import { YourMobject } from "../../mobjects/[category]/your-mobject";
import SliderInput from "../input/sliderInput";

export interface YourMobjectProperties extends BaseProperties {
  // Add your custom properties
  customProp: number;
}

export class YourMobjectProperty extends BaseProperty {
  protected customProp: number = 0;

  constructor(mobj: YourMobject) {
    super(mobj.shape, mobj);
    // Initialize custom properties
    this.update({ customProp: this.customProp });
  }

  override update(prop: Partial<YourMobjectProperties>): void {
    super.update(prop);  // Handle base properties
    
    if (prop.customProp !== undefined) {
      this.customProp = prop.customProp;
      // Update the Konva shape
      if (this.shapemobj instanceof Konva.Shape) {
        // Update visual properties
      }
    }
  }

  override getUIComponents(): { name: string; component: React.ReactNode }[] {
    const components = super.getUIComponents();
    
    components.push({
      name: "Custom Property",
      component: (
        <SliderInput
          key={"CustomProp"}
          fields={[{
            label: "Custom",
            value: this.customProp,
            onChange: (v) => this.update({ customProp: v }),
            min: 0,
            max: 100,
            step: 1,
          }]}
        />
      ),
    });
    
    return components;
  }

  override getData(): YourMobjectProperties {
    return {
      ...super.getData(),
      customProp: this.customProp,
    };
  }

  override setData(data: YourMobjectProperties): void {
    super.setData(data);
    this.customProp = data.customProp;
    this.update(data);
  }

  override refresh(): void {
    // Called when object is dragged or externally modified
    const pos = this.actualMobj.position();
    this.position = c2p(pos.x, pos.y);
    this.scale = this.actualMobj.scaleX();
    this.rotation = this.actualMobj.rotation();
  }
}
```

### 3. Register in MobjectMap

Add your Mobject to `core/maps/MobjectMap.ts`:

```typescript
import { YourMobject } from "../classes/mobjects/[category]/your-mobject";
import { YourIcon } from "lucide-react";

const MobjectMap: MobjectMapType = {
  // ... existing mobjects
  YourMobject: {
    func: () => new YourMobject("YourMobject"),
    name: "Your Mobject",
    Icon: YourIcon,
  },
};
```

### 4. Update Type Definitions

Add to `core/types/mobjects.ts`:

```typescript
import { YourMobject } from "../classes/mobjects/[category]/your-mobject";

export type Mobject =
  | MCircle
  | YourMobject  // Add your type
  | ... // other types
```

## Best Practices

1. **Separation of Concerns**: Keep visual logic in Mobjects, state management in Controllers
2. **Always extend BaseProperty**: Inherit common functionality (position, color, scale, etc.)
3. **Use TypeScript interfaces**: Define property interfaces for type safety
4. **Implement all lifecycle methods**: `storeAsObj()`, `loadFromObj()`, `refresh()`
5. **Provide UI components**: Make properties editable through `getUIComponents()`
6. **Use coordinate conversion**: Use `c2p()` (canvas to position) and `p2c()` (position to canvas) utilities
7. **Call super methods**: When overriding `update()`, `getData()`, etc., call `super` first
8. **Keep Mobjects simple**: Complex logic should be in Controllers, not Mobjects

## Common Patterns

### Adding a Label to a Mobject

```typescript
// In Mobject
public label: Konva.Text;
this.label = new Konva.Text();
this.add(this.label);

// In Controller
protected label: LabelProperty;
this.label = new LabelProperty(mobj.label);
```

### Handling Line/Path-based Shapes

```typescript
// Extend LineProperty instead of BaseProperty
export class YourLineProperty extends LineProperty {
  // You get points, strokeWidth automatically
}
```

### Creating Composite Objects

```typescript
// Group multiple Konva shapes
export class CompositeObject extends Konva.Group {
  public shape1: Konva.Circle;
  public shape2: Konva.Rect;
  // Both are added to the group
}
```

## Debugging Tips

- Use `refresh()` to sync controller state from Konva object
- Check console for serialization errors during save/load
- Use `zIndex` to control rendering order
- Remember that `position` is relative to layer position (center of canvas)
- Text objects go in `textlayer`, most others in `layer`

## Related Documentation

- [Mobjects Documentation](./mobjects/README.md)
- [Controllers Documentation](./controllers/README.md)
- [Managers Documentation](./managers/README.md)
- [Animation System](./animation/README.md)
- [Tracker System](./Tracker/README.md)
