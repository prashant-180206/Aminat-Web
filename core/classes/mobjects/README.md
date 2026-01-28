# Mobjects (Mathematical Objects)

Mobjects are the visual building blocks of the Animat animation system. They represent geometric shapes, text, and composite objects that can be animated, tracked, and manipulated on the Konva canvas.

## What is a Mobject?

A **Mobject** (Mathematical Object) is a custom Konva object that:
- **Extends Konva.Group** to contain multiple Konva primitives
- Has a **controller** (Property class) that manages its state
- Supports **animations** through the AnimGetter
- Can be **connected to trackers** for dynamic values
- Is **serializable** to/from JSON for saving/loading
- Provides **UI components** for property editing

## Mobject Categories

### Simple Shapes (`mobjects/simple/`)

Basic geometric shapes with straightforward properties.

| Mobject | Description | Key Properties |
|---------|-------------|----------------|
| **Dot** | A point/circle with optional label | radius, label |
| **Circle** | A circle shape | radius |
| **Rect** | A rectangle | width, height |
| **Line** | A straight line between two points | points, strokeWidth |
| **DashedLine** | A dashed line | points, strokeWidth, dash |
| **Polygon** | A closed polygon | points, sides |
| **Curve** | A parametric curve | points, tension, closed |

### Geometric Objects (`mobjects/geometric/`)

Mathematical and geometric constructs.

| Mobject | Description | Key Properties |
|---------|-------------|----------------|
| **Vector** | An arrow/vector | points, strokeWidth, pointerSize |
| **DoubleArrow** | Arrow with heads on both ends | points, strokeWidth, pointerSize |
| **Arc** | An arc segment | radius, angle, startAngle |

### Text Objects (`mobjects/text/`)

Text-based elements for labels and formulas.

| Mobject | Description | Key Properties |
|---------|-------------|----------------|
| **MText** | Simple text | text, fontSize, fontFamily |
| **LatexText** | LaTeX mathematical formulas | formula, fontSize |
| **DynamicText** | Text with dynamic tracker values | text, fontSize, trackers |

### Composite/Group Objects (`mobjects/group/`)

Complex objects made of multiple primitives.

| Mobject | Description | Key Properties |
|---------|-------------|----------------|
| **MPlane** | Coordinate plane with grid | xRange, yRange, gridSpacing |
| **MNumberLine** | Number line with ticks | range, tickSpacing, labels |

## Mobject Structure

Every Mobject follows this structure:

```typescript
export class YourMobject extends Konva.Group {
  // Core systems (required)
  public animgetter: AnimGetter;              // Animation support
  public trackerconnector: TrackerConnector;  // Tracker support
  public features: YourMobjectProperty;       // Controller
  private _TYPE: string;                      // Type identifier
  
  // Visual elements (Konva primitives)
  public shape: Konva.Shape;
  public label?: Konva.Text;
  
  constructor(TYPE: string) {
    super();
    this._TYPE = TYPE;
    
    // 1. Create Konva primitives
    this.shape = new Konva.Circle();
    this.add(this.shape);
    
    // 2. Initialize support systems
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);
    
    // 3. Initialize controller
    this.features = new YourMobjectProperty(this);
    
    // 4. Set name
    this.name("YourMobject");
    
    // 5. Add animation/tracker support (optional)
    MobjectAnimAdder.addAnimations(this);
    TrackerEndPointsAdder.addConnectors(this);
  }
  
  // Required methods
  type(): string { return this._TYPE; }
  get properties() { return this.features.getData(); }
  getUIComponents() { return this.features.getUIComponents(); }
  storeAsObj() { return { properties: this.features.getData(), id: this.id() }; }
  loadFromObj(obj: MobjectData) {
    this.features.setData(obj.properties);
    this.features.refresh();
  }
}
```

## Key Components

### 1. AnimGetter

Provides animation capabilities:
```typescript
this.animgetter = new AnimGetter(this);

// Used internally by animation system to:
// - Get current property values
// - Set property values during animation
// - Interpolate between keyframes
```

### 2. TrackerConnector

Enables dynamic value binding:
```typescript
this.trackerconnector = new TrackerConnector(this);

// Allows properties to be connected to:
// - Sliders
// - Value trackers
// - Computed expressions
```

### 3. Features (Controller)

Manages state and behavior:
```typescript
this.features = new YourMobjectProperty(this);

// The controller:
// - Stores property values
// - Updates Konva primitives when properties change
// - Generates UI components for editing
// - Handles serialization
```

## Property Access Patterns

### Getting Properties
```typescript
// Get all properties as an object
const props = mobject.properties;
// { position: {x: 0, y: 0}, color: "#fff", radius: 10, ... }

// Get specific property
const radius = mobject.features.getData().radius;
```

### Setting Properties
```typescript
// Update through controller
mobject.features.update({ radius: 20, color: "#ff0000" });

// Properties automatically sync to Konva objects
```

### UI Component Generation
```typescript
// Get React components for property panel
const components = mobject.getUIComponents();
// Returns: [
//   { name: "Position", component: <NumberInputs .../> },
//   { name: "Color", component: <ColorDisc .../> },
//   { name: "Radius", component: <SliderInput .../> }
// ]
```

## Serialization

Mobjects can be saved and loaded:

### Saving
```typescript
const data = mobject.storeAsObj();
// {
//   id: "Dot-1",
//   properties: {
//     position: {x: 0, y: 0},
//     color: "#ffffff",
//     radius: 10,
//     // ... all properties
//   }
// }
```

### Loading
```typescript
mobject.loadFromObj(data);
// Restores all properties from saved data
```

## Common Patterns

### Pattern 1: Shape with Label

Many shapes have an optional label:

```typescript
export class ShapeWithLabel extends Konva.Group {
  public shape: Konva.Circle;
  public label: Konva.Text;
  public features: ShapeProperty;
  
  constructor(TYPE: string) {
    super();
    
    // Add shape
    this.shape = new Konva.Circle();
    this.add(this.shape);
    
    // Add label
    this.label = new Konva.Text();
    this.add(this.label);
    
    // Controller manages both
    this.features = new ShapeProperty(this);
    
    // Add label animations
    MobjectAnimAdder.addLabelAnimations(this);
  }
}
```

### Pattern 2: Line-based Shapes

Lines, vectors, and curves:

```typescript
export class LineBasedShape extends Konva.Group {
  public line: Konva.Line | Konva.Arrow;
  public features: LineProperty;
  
  constructor(TYPE: string) {
    super();
    
    this.line = new Konva.Arrow({
      points: [0, 0, 100, 100],
      strokeWidth: 2,
    });
    this.add(this.line);
    
    this.features = new LineProperty(this);
    
    // Add tracker endpoints
    TrackerEndPointsAdder.addLinePointConnectors(this);
    
    // Add line animations
    MobjectAnimAdder.addLineAnimations(this);
  }
}
```

### Pattern 3: Composite Objects

Complex objects with multiple parts:

```typescript
export class CompositeObject extends Konva.Group {
  public background: Konva.Rect;
  public grid: Konva.Line[];
  public axes: Konva.Line[];
  public features: CompositeProperty;
  
  constructor(TYPE: string) {
    super();
    
    // Create multiple primitives
    this.background = new Konva.Rect();
    this.grid = [];
    this.axes = [];
    
    // Add all to group
    this.add(this.background);
    // ... add grid lines and axes
    
    // Controller manages all parts
    this.features = new CompositeProperty(this);
  }
}
```

## Layer Assignment

Mobjects are added to different layers based on their type:

```typescript
// In MobjectFactory.create():
if (mobject instanceof MText || mobject instanceof Konva.Image) {
  textlayer.add(mobject);  // Text objects → text layer
} else {
  layer.add(mobject);      // Everything else → main layer
}
```

**Why separate layers?**
- Text renders on top of shapes
- Different listening modes for edit/play
- Performance optimization

## Animation Support

Mobjects integrate with the animation system:

### Adding Animation Support
```typescript
// In constructor
MobjectAnimAdder.addLabelAnimations(this);
MobjectAnimAdder.addLineAnimations(this);
```

### What This Provides
- Automatic property interpolation
- Keyframe support
- Easing functions
- Timeline integration

### Animated Properties
Through `animgetter`, the following can be animated:
- Position (x, y)
- Color
- Scale
- Rotation
- Opacity
- Custom properties (radius, points, etc.)

## Tracker Support

Mobjects can be connected to trackers:

### Adding Tracker Support
```typescript
// In constructor
TrackerEndPointsAdder.addLinePointConnectors(this);
```

### Connection Types
- **Point tracking**: Endpoints follow tracker values
- **Value tracking**: Properties bound to tracker values
- **Expression tracking**: Properties computed from expressions

### Example
```typescript
// Connect dot position to tracker
dot.trackerconnector.connectProperty("position", trackerId);
// Now dot position updates automatically with tracker
```

## Best Practices

### 1. Keep Mobjects Visual-Only
✅ **Good**: Store Konva objects, delegate logic to controller
```typescript
export class Dot extends Konva.Group {
  public circle: Konva.Circle;
  public features: DotProperty;  // Controller handles logic
}
```

❌ **Bad**: Business logic in Mobject
```typescript
export class Dot extends Konva.Group {
  updateRadius(value: number) {
    // Don't do calculations here
    // Controller should handle this
  }
}
```

### 2. Use Composition

✅ **Good**: Combine primitives in a Group
```typescript
export class Vector extends Konva.Group {
  public line: Konva.Arrow;
  public label: Konva.Text;
  // Both in one group
}
```

### 3. Initialize All Support Systems

✅ **Always include**:
```typescript
this.animgetter = new AnimGetter(this);
this.trackerconnector = new TrackerConnector(this);
this.features = new YourProperty(this);
```

### 4. Implement All Interface Methods

✅ **Required methods**:
```typescript
type(): string
get properties()
getUIComponents()
storeAsObj()
loadFromObj(obj)
```

### 5. Use Proper Naming

- Mobject class: `MYourShape` or `YourShape`
- Type: Same as class name
- Name: Descriptive (`this.name("YourShape")`)

## Example: Complete Mobject Implementation

See [Dot implementation](./simple/dot.ts) for a complete example showing:
- Konva primitive setup (Circle, Text)
- Controller integration
- Animation support
- Label management
- Serialization

## Testing Your Mobject

1. **Add to MobjectMap**: Register in `core/maps/MobjectMap.ts`
2. **Test creation**: Use MobjectFactory to create instance
3. **Test properties**: Verify controller updates work
4. **Test UI**: Check UI components render
5. **Test serialization**: Save and load scene
6. **Test animation**: Add keyframes and play
7. **Test tracker**: Connect to a tracker

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Mobject not visible | Check layer assignment, zIndex, opacity |
| Properties don't update | Ensure controller `update()` modifies Konva object |
| Can't animate | Add `MobjectAnimAdder` support |
| Serialization fails | Implement `getData()`/`setData()` in controller |
| Position offset | Use `c2p()`/`p2c()` for coordinate conversion |
| Text behind shapes | Use `textlayer` instead of `layer` |

## Related Documentation

- [Controllers Documentation](../controllers/README.md)
- [Animation System](../animation/README.md)
- [Main Architecture](../README.md)
