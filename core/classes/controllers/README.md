# Controllers (Property Classes)

Controllers (classes with `*Property` suffix) manage the state, behavior, and UI of Mobjects in the Animat animation system. They form the "business logic" layer that sits between UI interactions and visual Konva objects.

## What is a Controller?

A **Controller** (Property class):
- **Manages state** for a Mobject (position, color, size, etc.)
- **Updates Konva objects** when properties change
- **Generates UI components** for the property panel
- **Handles serialization** (save/load)
- **Syncs state** between user interactions and visual representation
- **Extends BaseProperty** to inherit common functionality

## Controller Architecture

### Class Hierarchy

```
BaseProperty
├── position: {x, y}
├── color: string
├── scale: number
├── rotation: number
├── opacity: number
└── zindex: number

├── Simple Shape Properties
│   ├── DotProperty (extends BaseProperty)
│   │   ├── radius: number
│   │   └── label: LabelProperty
│   ├── CircleProperty (extends BaseProperty)
│   │   └── radius: number
│   └── RectProperty (extends BaseProperty)
│       ├── width: number
│       └── height: number
│
├── Line-based Properties
│   ├── LineProperty (extends BaseProperty)
│   │   ├── points: number[]
│   │   └── strokeWidth: number
│   │
│   └── VectorProperty (extends LineProperty)
│       └── pointerSize: number
│
└── Composite Properties
    ├── PlaneProperty (extends BaseProperty)
    └── NumberLineProperty (extends BaseProperty)
```

## Core Concepts

### 1. State Management

Controllers store property values and keep them synchronized with Konva objects:

```typescript
export class DotProperty extends BaseProperty {
  // State stored in controller
  protected radius: number = 10;
  protected label: LabelProperty;
  
  // References to Konva objects
  protected shapemobj: Konva.Circle;
  protected labelobj: Konva.Text;
  
  constructor(mobj: Dot) {
    super(mobj.circle, mobj);  // Initialize base properties
    this.label = new LabelProperty(mobj.label);
    
    // Sync initial state to Konva
    mobj.circle.radius(this.radius);
  }
}
```

### 2. Update Pattern

The `update()` method is the core mechanism for changing properties:

```typescript
update(prop: Partial<DotProperties>): void {
  // 1. Call parent to handle base properties
  super.update(prop);
  
  // 2. Handle custom properties
  if (prop.radius !== undefined) {
    this.radius = prop.radius;              // Update state
    this.shapemobj.radius(this.radius);     // Sync to Konva
  }
  
  if (prop.label !== undefined) {
    this.label.update(prop.label);          // Delegate to child controller
  }
}
```

**Update Flow:**
1. UI component calls `property.update({ radius: 20 })`
2. Controller updates internal state
3. Controller updates Konva object
4. Canvas automatically redraws

### 3. UI Component Generation

Controllers generate React components for the property panel:

```typescript
getUIComponents(): { name: string; component: React.ReactNode }[] {
  const components = super.getUIComponents();  // Get base UI
  
  components.push({
    name: "Radius",
    component: (
      <SliderInput
        fields={[{
          label: "Radius",
          value: this.radius,
          onChange: (v) => this.update({ radius: v }),
          min: 0,
          max: 100,
          step: 1,
        }]}
        icon={<CircleArrowOutDownRight className="h-4 w-4" />}
      />
    ),
  });
  
  return components;
}
```

### 4. Serialization

Controllers handle converting to/from JSON:

```typescript
// Save state
getData(): DotProperties {
  return {
    ...super.getData(),        // Base properties
    radius: this.radius,       // Custom properties
    label: this.label.getData(),
  };
}

// Restore state
setData(data: DotProperties): void {
  super.setData(data);
  this.radius = data.radius;
  this.label.setData(data.label);
  this.update(data);  // Sync everything
}
```

### 5. Refresh Pattern

The `refresh()` method syncs controller state FROM Konva objects:

```typescript
refresh(): void {
  // Called when object is dragged or externally modified
  const pos = this.actualMobj.position();
  this.position = c2p(pos.x, pos.y);        // Canvas → Position coords
  this.scale = this.actualMobj.scaleX();
  this.rotation = this.actualMobj.rotation();
}
```

**When is refresh() called?**
- After drag operations
- After external modifications
- When loading from saved data

## BaseProperty

All controllers extend `BaseProperty`, which provides:

### Base Properties

```typescript
export interface BaseProperties {
  position: { x: number; y: number };  // Cartesian coordinates
  color: string;                       // Hex color
  scale: number;                       // Uniform scale
  rotation: number;                    // Degrees
  opacity: number;                     // 0-1
  zindex: number;                      // Layer order
}
```

### Base UI Components

BaseProperty provides standard UI controls:

| Property | Component | Description |
|----------|-----------|-------------|
| Position | `NumberInputs` | X/Y coordinate inputs |
| Color | `ColorDisc` | Color picker |
| Scale | `SliderInput` | Scale slider (0.1-5) |
| Rotation | `SliderInput` | Rotation slider (0-360°) |
| Opacity | `SliderInput` | Opacity slider (0-1) |
| Z-Index | `NumberStepperInput` | Layer order stepper |

### Coordinate Conversion

BaseProperty uses utility functions for coordinate conversion:

```typescript
import { c2p, p2c } from "@/core/utils/conversion";

// Position to Canvas: p2c(x, y)
// Canvas to Position: c2p(x, y)

// Usage in update:
if (prop.position !== undefined) {
  const canvasPos = p2c(prop.position.x, prop.position.y);
  this.actualMobj.position(canvasPos);
  this.position = prop.position;
}

// Usage in refresh:
refresh(): void {
  const pos = this.actualMobj.position();
  this.position = c2p(pos.x, pos.y);
}
```

## Controller Categories

### Simple Shape Controllers (`controllers/simple/`)

Control basic shapes with straightforward properties.

**Example: DotProperty**
```typescript
export class DotProperty extends BaseProperty {
  protected radius: number = 10;
  protected label: LabelProperty;
  
  // Manages: radius, label, + all base properties
}
```

**Common simple properties:**
- `CircleProperty`: radius
- `RectProperty`: width, height
- `PolygonProperty`: sides, points

### Line-based Controllers (`controllers/geometry/`)

Extend `LineProperty` for line-based shapes.

**LineProperty provides:**
```typescript
export class LineProperty extends BaseProperty {
  protected points: number[] = [0, 0, 100, 100];
  protected strokeWidth: number = 2;
  
  // Additional: start point, end point accessors
  // TrackerConnector support for endpoints
}
```

**Example: VectorProperty**
```typescript
export class VectorProperty extends LineProperty {
  protected pointerSize: number = 10;
  
  // Inherits: points, strokeWidth
  // Adds: pointerSize for arrow head
}
```

### Text Controllers (`controllers/text/`)

Manage text properties and rendering.

**Common text properties:**
- `fontSize`: number
- `fontFamily`: string
- `align`: "left" | "center" | "right"
- `text` or `formula`: string

### Composite Controllers (`controllers/group/`)

Manage complex objects with multiple parts.

**Example: PlaneProperty**
```typescript
export class PlaneProperty extends BaseProperty {
  protected xRange: [number, number];
  protected yRange: [number, number];
  protected gridSpacing: number;
  
  // Manages grid lines, axes, labels
  // Updates multiple Konva objects
}
```

## Creating a Controller

### Step 1: Define Properties Interface

```typescript
export interface YourShapeProperties extends BaseProperties {
  customProp1: number;
  customProp2: string;
  // ... your properties
}
```

### Step 2: Create Property Class

```typescript
export class YourShapeProperty extends BaseProperty {
  // 1. Declare state
  protected customProp1: number = 0;
  protected customProp2: string = "default";
  
  // 2. Constructor
  constructor(mobj: YourShape) {
    super(mobj.shape, mobj);
    
    // Initialize custom properties
    this.update({
      customProp1: this.customProp1,
      customProp2: this.customProp2,
    });
  }
  
  // 3. Update method
  override update(prop: Partial<YourShapeProperties>): void {
    super.update(prop);
    
    if (prop.customProp1 !== undefined) {
      this.customProp1 = prop.customProp1;
      // Update Konva object
      if (this.shapemobj instanceof Konva.Shape) {
        // Apply changes
      }
    }
    
    if (prop.customProp2 !== undefined) {
      this.customProp2 = prop.customProp2;
      // Update Konva object
    }
  }
  
  // 4. UI Components
  override getUIComponents(): { name: string; component: React.ReactNode }[] {
    const components = super.getUIComponents();
    
    components.push({
      name: "Custom Prop 1",
      component: (
        <SliderInput
          fields={[{
            label: "Custom 1",
            value: this.customProp1,
            onChange: (v) => this.update({ customProp1: v }),
            min: 0,
            max: 100,
            step: 1,
          }]}
        />
      ),
    });
    
    return components;
  }
  
  // 5. Serialization
  override getData(): YourShapeProperties {
    return {
      ...super.getData(),
      customProp1: this.customProp1,
      customProp2: this.customProp2,
    };
  }
  
  override setData(data: YourShapeProperties): void {
    super.setData(data);
    this.customProp1 = data.customProp1;
    this.customProp2 = data.customProp2;
    this.update(data);
  }
  
  // 6. Refresh
  override refresh(): void {
    const pos = this.actualMobj.position();
    this.position = c2p(pos.x, pos.y);
    this.scale = this.actualMobj.scaleX();
    this.rotation = this.actualMobj.rotation();
  }
}
```

## UI Input Components

Controllers use these React components for UI:

### SliderInput

For numeric ranges:
```typescript
<SliderInput
  fields={[{
    label: "Radius",
    value: this.radius,
    onChange: (v) => this.update({ radius: v }),
    min: 0,
    max: 100,
    step: 1,
  }]}
  icon={<CircleIcon />}
  message="Adjust radius"
/>
```

### NumberInputs

For multiple numeric values (like x, y):
```typescript
<NumberInputs
  inputs={[
    {
      label: "X",
      value: this.position.x,
      onChange: (v) => this.update({ position: { ...this.position, x: v } }),
    },
    {
      label: "Y",
      value: this.position.y,
      onChange: (v) => this.update({ position: { ...this.position, y: v } }),
    },
  ]}
  icon={<Move />}
/>
```

### ColorDisc

For color selection:
```typescript
<ColorDisc
  size={8}
  value={this.color}
  onChange={(val) => this.update({ color: val })}
/>
```

### NumberStepperInput

For discrete values:
```typescript
<NumberStepperInput
  label="Z-Index"
  value={this.zindex}
  onChange={(v) => this.update({ zindex: v })}
  step={1}
/>
```

## Common Patterns

### Pattern 1: Delegating to Child Controllers

When a Mobject has sub-components (like labels):

```typescript
export class ShapeProperty extends BaseProperty {
  protected label: LabelProperty;  // Child controller
  
  constructor(mobj: Shape) {
    super(mobj.shape, mobj);
    this.label = new LabelProperty(mobj.label);
  }
  
  override update(prop: Partial<ShapeProperties>): void {
    super.update(prop);
    
    // Delegate to child
    if (prop.label !== undefined) {
      this.label.update(prop.label);
    }
  }
  
  override getData(): ShapeProperties {
    return {
      ...super.getData(),
      label: this.label.getData(),  // Get child data
    };
  }
}
```

### Pattern 2: Computed Properties

When properties depend on each other:

```typescript
export class LineProperty extends BaseProperty {
  protected points: number[] = [0, 0, 100, 100];
  
  // Computed from points
  get startPoint() {
    return { x: this.points[0], y: this.points[1] };
  }
  
  get endPoint() {
    return { x: this.points[2], y: this.points[3] };
  }
  
  setStartPoint(x: number, y: number) {
    this.points[0] = x;
    this.points[1] = y;
    this.update({ points: this.points });
  }
}
```

### Pattern 3: Conditional Updates

When updates trigger side effects:

```typescript
override update(prop: Partial<DotProperties>): void {
  super.update(prop);
  
  // Position change affects label
  if (prop.position !== undefined && this.label) {
    const text = this.label.defaultText
      .replace("posx", this.position.x.toFixed(1))
      .replace("posy", this.position.y.toFixed(1));
    this.labelobj.text(text);
  }
}
```

### Pattern 4: Multiple Shape Updates

When one property affects multiple shapes:

```typescript
override update(prop: Partial<PlaneProperties>): void {
  super.update(prop);
  
  if (prop.gridSpacing !== undefined) {
    this.gridSpacing = prop.gridSpacing;
    
    // Update all grid lines
    this.gridLines.forEach(line => {
      // Recalculate positions
    });
    
    // Update tick marks
    this.ticks.forEach(tick => {
      // Recalculate positions
    });
  }
}
```

## Advanced Topics

### Working with Konva Types

Controllers interact with specific Konva types:

```typescript
if (this.shapemobj instanceof Konva.Circle) {
  this.shapemobj.radius(this.radius);
}

if (this.shapemobj instanceof Konva.Line) {
  this.shapemobj.points(this.points);
  this.shapemobj.strokeWidth(this.strokeWidth);
}

if (this.shapemobj instanceof Konva.Arrow) {
  this.shapemobj.pointerLength(this.pointerSize);
}
```

### Event Handling

Controllers can listen to Konva events:

```typescript
constructor(mobj: Shape) {
  super(mobj.shape, mobj);
  
  // Auto-refresh on drag
  this.actualMobj.on("dragmove", this.refresh.bind(this));
  
  // Custom events
  this.actualMobj.on("transform", () => {
    this.refresh();
  });
}
```

### Validation

Add validation to update():

```typescript
override update(prop: Partial<ShapeProperties>): void {
  if (prop.radius !== undefined) {
    // Clamp value
    const radius = Math.max(1, Math.min(100, prop.radius));
    this.radius = radius;
    this.shapemobj.radius(this.radius);
  }
}
```

## Best Practices

### 1. Always Call Super

✅ **Good**:
```typescript
override update(prop: Partial<YourProperties>): void {
  super.update(prop);  // Handle base properties first
  // Then handle custom properties
}
```

❌ **Bad**:
```typescript
override update(prop: Partial<YourProperties>): void {
  // Forgot to call super - base properties won't update!
  if (prop.customProp) { ... }
}
```

### 2. Use Type Guards

✅ **Good**:
```typescript
if (this.shapemobj instanceof Konva.Circle) {
  this.shapemobj.radius(this.radius);
}
```

❌ **Bad**:
```typescript
// Assumes type - might error
(this.shapemobj as Konva.Circle).radius(this.radius);
```

### 3. Keep State in Controller

✅ **Good**: State in controller, Konva for rendering
```typescript
protected radius: number = 10;  // Source of truth

update({ radius: 20 });
this.shapemobj.radius(this.radius);  // Sync to Konva
```

❌ **Bad**: Konva as source of truth
```typescript
// Don't do this
get radius() {
  return (this.shapemobj as Konva.Circle).radius();
}
```

### 4. Implement All Methods

Always implement:
- `update()`
- `getData()`
- `setData()`
- `getUIComponents()`
- `refresh()`

### 5. Use Proper TypeScript

Define interfaces for type safety:
```typescript
export interface YourProperties extends BaseProperties {
  customProp: number;
}

export class YourProperty extends BaseProperty {
  override update(prop: Partial<YourProperties>): void
  override getData(): YourProperties
  override setData(data: YourProperties): void
}
```

## Debugging Tips

| Issue | Solution |
|-------|----------|
| Property not updating | Check if `update()` modifies Konva object |
| UI component not working | Verify `onChange` calls `update()` |
| Save/load broken | Ensure `getData()`/`setData()` are complete |
| Position wrong after drag | Implement `refresh()` properly |
| Type errors | Use type guards before accessing specific properties |
| Updates not visible | Call `layer.draw()` after updates (auto in most cases) |

## Testing Controllers

```typescript
// Create mobject
const dot = new Dot("Dot");

// Test initial state
console.log(dot.properties);

// Test update
dot.features.update({ radius: 20, color: "#ff0000" });
console.log(dot.properties.radius);  // 20

// Test serialization
const data = dot.storeAsObj();
const newDot = new Dot("Dot");
newDot.loadFromObj(data);
console.log(newDot.properties.radius);  // 20

// Test UI
const components = dot.getUIComponents();
console.log(components.length);  // Should have components
```

## Related Documentation

- [Mobjects Documentation](../mobjects/README.md)
- [Input Components](./input/README.md)
- [Main Architecture](../README.md)
