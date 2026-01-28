# Managers and Factories

This document explains the Manager and Factory patterns used in the Animat animation system to create, organize, and coordinate Mobjects, animations, and trackers.

## Overview

**Managers** handle collections, lifecycle, and coordination of objects:
- **MobjectManager**: Creates and manages all Mobjects in the scene
- **AnimationManager**: Manages animation timeline and keyframes
- **TrackerManager**: Manages tracker instances (sliders, values)
- **ConnectionManager**: Links trackers to Mobject properties
- **TrackerAnimator**: Animates tracker values

**Factories** create objects following consistent patterns:
- **MobjectFactory**: Creates Mobject instances from type strings
- Uses **MobjectMap** to map type strings to constructors

## MobjectManager

Manages the lifecycle of all Mobjects in a scene.

### Responsibilities

1. **Create Mobjects**: Via MobjectFactory
2. **Track Mobjects**: Maintain registry of all instances
3. **Remove Mobjects**: Clean up when deleted
4. **Provide Access**: Get Mobjects by ID

### API

```typescript
export class MobjectManager {
  private _activeMobject: Mobject | null;
  private totalObjects: number;
  private layer: Konva.Layer;
  private textlayer: Konva.Layer;
  private _mobjectsMeta: Array<{
    id: string;
    type: string;
    mobject: Mobject;
  }>;
  
  // Create a new Mobject
  addMobject(type: string, id?: string): Mobject
  
  // Remove a Mobject
  removeMobject(id: string): void
  
  // Get Mobject by ID
  getMobjectById(id: string): Mobject | null
  
  // Clear all Mobjects
  clear(): void
  
  // Add callback for when Mobjects are created
  addMobjectFunction(func: (mobj: Mobject) => void): void
}
```

### Usage

```typescript
// In Scene constructor
this.mobjManager = new MobjectManager(this.layer, this.textlayer);

// Create a Mobject
const dot = this.mobjManager.addMobject("Dot");
// Returns: Dot instance with auto-generated ID "Dot-0"

// Create with custom ID
const circle = this.mobjManager.addMobject("Circle", "myCircle");

// Get Mobject
const mobject = this.mobjManager.getMobjectById("Dot-0");

// Remove Mobject
this.mobjManager.removeMobject("Dot-0");

// Add callback for new Mobjects
this.mobjManager.addMobjectFunction((mobj) => {
  console.log("New mobject created:", mobj.id());
  // Setup event listeners, etc.
});
```

### Internal State

```typescript
private _mobjectsMeta: {
  id: string;        // "Dot-0"
  type: string;      // "Dot"
  mobject: Mobject;  // Dot instance
}[]
```

This registry allows:
- Fast lookup by ID
- Iteration over all Mobjects
- Type tracking for serialization

### Active Mobject

The manager tracks which Mobject is currently selected:

```typescript
get activeMobject(): Mobject | null
set activeMobject(value: Mobject | null)
```

Used by UI to show property panel for selected Mobject.

### Object Numbering

```typescript
private totalObjects = 0;

addMobject(type: string, id?: string): Mobject {
  const mobject = MobjectFactory.create(type, this.layer, this.textlayer, {
    id: id ?? `${type}-${this.totalObjects++}`,
    number: this.totalObjects,
  });
  // ...
}
```

Ensures unique IDs when not specified.

## MobjectFactory

Creates Mobject instances from type strings.

### Responsibilities

1. **Instantiate Mobjects**: Call constructor based on type
2. **Add to Layers**: Place in appropriate layer (layer vs textlayer)
3. **Configure**: Set ID, draggable, initial properties
4. **Return Instance**: Ready-to-use Mobject

### API

```typescript
export class MobjectFactory {
  static create(
    type: string,
    layer: Konva.Layer,
    textlayer: Konva.Layer,
    opts: {
      number?: number;
      id?: string;
    }
  ): Mobject
}
```

### Implementation

```typescript
static create(type, layer, textlayer, opts): Mobject {
  // 1. Create instance from MobjectMap
  const mobject = MobjectMap[type].func();
  
  // 2. Add to appropriate layer
  if (mobject instanceof MText || mobject instanceof Konva.Image) {
    textlayer.add(mobject);  // Text → text layer
  } else {
    layer.add(mobject);      // Shapes → main layer
  }
  
  // 3. Set ID
  mobject.id(opts.id ?? `${mobject.name()}-${opts.number}`);
  
  // 4. Make draggable
  mobject.setDraggable(true);
  
  // 5. Set initial z-index
  const zin = mobject.zIndex();
  mobject.features.update({ zindex: zin });
  
  return mobject;
}
```

### Usage

```typescript
// Direct usage (typically through MobjectManager)
const dot = MobjectFactory.create("Dot", layer, textlayer, {
  id: "myDot",
  number: 1,
});

// Returns fully configured Dot instance
```

## MobjectMap

Maps type strings to Mobject constructors.

### Structure

```typescript
const MobjectMap: MobjectMapType = {
  [typeName]: {
    func: () => new MobjectClass(typeName),
    name: "Display Name",
    Icon: LucideIcon,
  }
}
```

### Example

```typescript
import { Dot } from "../classes/mobjects/simple/dot";
import { DotIcon } from "lucide-react";

const MobjectMap = {
  Dot: {
    func: () => new Dot("Dot"),
    name: "Dot",
    Icon: DotIcon,
  },
  Circle: {
    func: () => new MCircle("Circle"),
    name: "Circle",
    Icon: Circle,
  },
  // ... more types
};
```

### Adding New Mobject Types

```typescript
// 1. Import your Mobject
import { MyShape } from "../classes/mobjects/simple/myshape";
import { MyIcon } from "lucide-react";

// 2. Add to MobjectMap
const MobjectMap = {
  // ... existing types
  MyShape: {
    func: () => new MyShape("MyShape"),
    name: "My Shape",
    Icon: MyIcon,
  },
};
```

### Usage

```typescript
// Get all available types
Object.keys(MobjectMap);
// ["Dot", "Circle", "Rect", ...]

// Get constructor
const dotConstructor = MobjectMap["Dot"].func;
const dot = dotConstructor();  // new Dot("Dot")

// Get icon for UI
const DotIcon = MobjectMap["Dot"].Icon;
<DotIcon className="h-4 w-4" />
```

## AnimationManager

Manages the animation timeline and keyframes.

### Responsibilities

1. **Timeline Management**: Play, pause, seek
2. **Keyframe Storage**: Store animation data
3. **Interpolation**: Calculate intermediate values
4. **Cleanup**: Remove animations for deleted objects

### Key Concepts

```typescript
export class AnimationManager {
  // Add animation for a Mobject property
  addAnimation(
    mobjectId: string,
    property: string,
    keyframes: Keyframe[]
  ): void
  
  // Remove animations for deleted Mobject
  removeAnimForMobject(mobjectId: string): void
  
  // Remove animations for deleted Tracker
  removeAnimForTracker(trackerId: string): void
  
  // Get value at current time
  getValueAtTime(
    mobjectId: string,
    property: string,
    time: number
  ): any
  
  // Play/pause/seek
  play(): void
  pause(): void
  seek(time: number): void
}
```

### Usage

```typescript
// In Scene
this.animManager = new AnimationManager();

// Add keyframe animation
this.animManager.addAnimation("Dot-0", "position", [
  { time: 0, value: { x: 0, y: 0 }, easing: "linear" },
  { time: 2, value: { x: 100, y: 100 }, easing: "easeInOut" },
]);

// Remove when Mobject deleted
this.animManager.removeAnimForMobject("Dot-0");
```

## TrackerManager

Manages tracker instances (sliders, value trackers).

### Responsibilities

1. **Create Trackers**: Different types (slider, value, computed)
2. **Track Instances**: Registry of all trackers
3. **Provide Access**: Get trackers by ID
4. **Cleanup**: Remove trackers

### API

```typescript
export class TrackerManager {
  // Create tracker
  add(type: string, id?: string): Tracker
  
  // Remove tracker
  remove(id: string): void
  
  // Get tracker by ID
  getById(id: string): Tracker | null
  
  // Get all trackers
  getAll(): Tracker[]
}
```

### Tracker Types

- **Slider**: User-controlled value with UI slider
- **ValueTracker**: Numeric value that can be animated
- **ComputedTracker**: Value computed from expression

### Usage

```typescript
// In Scene
this.trackerManager = new TrackerManager(layer, sliderLayer);

// Create slider
const slider = this.trackerManager.add("Slider", "mySlider");

// Get tracker value
const value = slider.getValue();

// Connect to Mobject (via ConnectionManager)
```

## ConnectionManager

Links trackers to Mobject properties for dynamic updates.

### Responsibilities

1. **Connect**: Link tracker to Mobject property
2. **Disconnect**: Remove connection
3. **Update**: Propagate tracker changes to Mobjects
4. **Cleanup**: Remove connections when objects deleted

### API

```typescript
export class ConnectionManager {
  // Connect tracker to property
  connect(
    trackerId: string,
    mobjectId: string,
    property: string
  ): void
  
  // Disconnect
  disconnect(connectionId: string): void
  
  // Get connections for Mobject
  getConnectionsForMobject(mobjectId: string): Connection[]
}
```

### Usage

```typescript
// In Scene
this.connManager = new ConnectionManager(
  this.trackerManager,
  this.mobjManager
);

// Connect slider to dot position.x
this.connManager.connect("mySlider", "Dot-0", "position.x");

// Now when slider changes, dot x position updates automatically
```

### Connection Flow

```
Slider UI
  ↓ onChange
Tracker.setValue()
  ↓ triggers
ConnectionManager.update()
  ↓ calls
Mobject.features.update({ position: { x: value } })
  ↓ updates
Konva.Circle.position({ x: value })
  ↓ triggers
Canvas redraw
```

## TrackerAnimator

Animates tracker values over time.

### Responsibilities

1. **Animate Trackers**: Move sliders/values during playback
2. **Sync with Timeline**: Coordinate with AnimationManager
3. **Update UI**: Move slider handles during animation

### API

```typescript
export class TrackerAnimator {
  // Add tracker animation
  addAnimation(
    trackerId: string,
    keyframes: Keyframe[]
  ): void
  
  // Update trackers at specific time
  updateAtTime(time: number): void
}
```

### Usage

```typescript
// In Scene
this.trackerAnimator = new TrackerAnimator(
  this.animManager,
  this.trackerManager,
  this.sliderLayer
);

// Animate slider from 0 to 10 over 3 seconds
this.trackerAnimator.addAnimation("mySlider", [
  { time: 0, value: 0 },
  { time: 3, value: 10 },
]);
```

## Scene Integration

The Scene class brings all managers together:

```typescript
class Scene extends Konva.Stage {
  // Layers
  private layer: Konva.Layer;
  private textlayer: Konva.Layer;
  private sliderLayer: Konva.Layer;
  
  // Managers
  mobjManager: MobjectManager;
  trackerManager: TrackerManager;
  connManager: ConnectionManager;
  animManager: AnimationManager;
  trackerAnimator: TrackerAnimator;
  
  constructor(config: Konva.StageConfig) {
    super(config);
    
    // Create layers
    this.layer = new Konva.Layer();
    this.textlayer = new Konva.Layer();
    this.sliderLayer = new Konva.Layer();
    
    // Initialize managers
    this.mobjManager = new MobjectManager(this.layer, this.textlayer);
    this.trackerManager = new TrackerManager(this.layer, this.sliderLayer);
    this.connManager = new ConnectionManager(
      this.trackerManager,
      this.mobjManager
    );
    this.animManager = new AnimationManager();
    this.trackerAnimator = new TrackerAnimator(
      this.animManager,
      this.trackerManager,
      this.sliderLayer
    );
  }
  
  // Public API delegates to managers
  addMobject(type: string, id?: string): Mobject {
    return this.mobjManager.addMobject(type, id);
  }
  
  removeMobject(id: string) {
    this.mobjManager.removeMobject(id);
    this.animManager.removeAnimForMobject(id);
  }
  
  removeTracker(id: string) {
    this.trackerManager.remove(id);
    this.animManager.removeAnimForTracker(id);
  }
}
```

## Manager Coordination

Managers work together to provide complete functionality:

### Example: Deleting a Mobject

```typescript
scene.removeMobject("Dot-0");

// Internally:
// 1. MobjectManager removes from registry
mobjManager.removeMobject("Dot-0");
//    - Destroys Konva object
//    - Removes from _mobjectsMeta

// 2. AnimationManager removes animations
animManager.removeAnimForMobject("Dot-0");
//    - Removes all keyframes for this Mobject

// 3. ConnectionManager cleans up (implicit)
//    - Connections become invalid
//    - Can be garbage collected
```

### Example: Creating Animated Mobject with Tracker

```typescript
// 1. Create Mobject
const dot = scene.addMobject("Dot");

// 2. Create Tracker
const slider = scene.trackerManager.add("Slider", "xSlider");

// 3. Connect tracker to Mobject
scene.connManager.connect("xSlider", dot.id(), "position.x");

// 4. Animate tracker
scene.trackerAnimator.addAnimation("xSlider", [
  { time: 0, value: 0 },
  { time: 5, value: 100 },
]);

// Now when animation plays:
// - TrackerAnimator updates slider value
// - ConnectionManager propagates to dot.position.x
// - Dot moves across screen
```

## Best Practices

### 1. Use Managers Through Scene

✅ **Good**: Access via Scene
```typescript
scene.addMobject("Dot");
scene.removeMobject("Dot-0");
```

❌ **Bad**: Direct manager access
```typescript
scene.mobjManager.addMobject("Dot");  // Skip Scene API
```

### 2. Clean Up Properly

✅ **Good**: Remove from all managers
```typescript
removeMobject(id: string) {
  this.mobjManager.removeMobject(id);
  this.animManager.removeAnimForMobject(id);
  // Connections clean up automatically
}
```

❌ **Bad**: Partial cleanup
```typescript
removeMobject(id: string) {
  this.mobjManager.removeMobject(id);
  // Forgot to remove animations - memory leak!
}
```

### 3. Use Factory Pattern

✅ **Good**: Use factory
```typescript
const mobject = MobjectFactory.create(type, layer, textlayer, opts);
```

❌ **Bad**: Direct instantiation
```typescript
const dot = new Dot("Dot");
layer.add(dot);  // Inconsistent setup
```

### 4. Register New Types

✅ **Good**: Add to MobjectMap
```typescript
const MobjectMap = {
  MyShape: {
    func: () => new MyShape("MyShape"),
    name: "My Shape",
    Icon: MyIcon,
  },
};
```

## Debugging Tips

| Issue | Check |
|-------|-------|
| Mobject not found | Verify ID in `mobjManager.mobjectsMeta` |
| Animation not playing | Check `animManager` has keyframes |
| Tracker not updating | Verify connection in `connManager` |
| Memory leak | Ensure cleanup in all managers |
| Wrong layer | Check Factory layer assignment logic |

## Testing Managers

```typescript
// Test MobjectManager
const manager = new MobjectManager(layer, textlayer);
const dot = manager.addMobject("Dot");
console.log(manager.getMobjectById(dot.id()));  // Should return dot
manager.removeMobject(dot.id());
console.log(manager.getMobjectById(dot.id()));  // Should return null

// Test Factory
const circle = MobjectFactory.create("Circle", layer, textlayer, {
  id: "testCircle",
  number: 1,
});
console.log(circle.id());  // "testCircle"
console.log(circle.name());  // "Circle"
```

## Related Documentation

- [Main Architecture](../README.md)
- [Mobjects Documentation](../mobjects/README.md)
- [Controllers Documentation](../controllers/README.md)
- [Scene Documentation](../scene.ts)
