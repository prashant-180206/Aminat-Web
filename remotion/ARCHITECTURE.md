<!-- HTML Component Map - Visual Reference -->

# 🎬 Component Map & Architecture

## Component Hierarchy

```
REMOTION COMPONENTS
├── ANIMATION LAYER (13)
│   ├── Text Effects
│   │   ├── TextAnimation    (4 animation types)
│   │   └── Glitch          (Cyberpunk style)
│   │
│   ├── Shapes & Effects
│   │   ├── Shape           (Geometric shapes)
│   │   ├── ParticleSystem  (Particle effects)
│   │   ├── Confetti        (Celebration)
│   │   └── ProgressBar     (Progress indication)
│   │
│   ├── Transitions & Views
│   │   ├── Transition      (6 transition types)
│   │   ├── Fade            (Fade in/out)
│   │   └── Sequence        (Timing control)
│   │
│   └── Media & Backgrounds
│       ├── Background          (Solid/gradient)
│       ├── GradientBackground  (Animated)
│       ├── Video               (Embed video)
│       └── AnimatedCounter     (Number anim)
│
├── LAYOUT LAYER (5) - Tailwind
│   ├── Container  (Responsive wrapper)
│   ├── Grid       (Multi-column grid)
│   ├── Stack      (Flex layout)
│   ├── Card       (Content container)
│   └── Divider    (Visual separator)
│
├── UI LAYER (8) - Tailwind
│   ├── Typography
│   │   ├── Heading  (H1-H6)
│   │   └── Text     (Paragraphs)
│   │
│   ├── Interactive
│   │   ├── Button     (5 variants)
│   │   ├── Badge      (Small labels)
│   │   └── Pill       (Rounded badges)
│   │
│   ├── Display
│   │   ├── Avatar     (User images)
│   │   ├── Alert      (Messages)
│   │   └── CodeBlock  (Code display)
│   │
│   └── Feedback
│       └── (Modal, Toast, etc. - future)
│
└── COMPLEX LAYER (4) - Tailwind
    ├── StatBox       (Statistics with trends)
    ├── TimelineItem  (Process steps)
    ├── Tabs          (Tabbed interface)
    └── (More coming...)
```

## Typical Video Composition Architecture

```
COMPOSITION
│
├── Background (Animated)
│   └── GradientBackground or Background
│
├── Container (Layout wrapper)
│   │
│   ├── Header Section
│   │   ├── Heading (animated)
│   │   └── Text (animated)
│   │
│   ├── Content Section
│   │   ├── Grid (for layout)
│   │   │   ├── Card
│   │   │   │   ├── Badge
│   │   │   │   ├── Heading
│   │   │   │   └── Text
│   │   │   │
│   │   │   └── StatBox (with trend)
│   │   │
│   │   └── Stack (vertical)
│   │       ├── TimelineItem
│   │       ├── TimelineItem
│   │       └── TimelineItem
│   │
│   ├── Divider
│   │
│   └── CTA Section
│       └── Button
│
└── Effects (Overlay)
    ├── ParticleSystem
    ├── Confetti
    └── Transitions
```

## Data Flow

```
Props
  ↓
Root.tsx (registers compositions)
  ↓
Composition (MyComposition, StatsShowcase, etc)
  ↓
Container (layout wrapper)
  ↓
Grid/Stack (content organization)
  ↓
Cards/Components (individual elements)
  ↓
Animation (via delay/duration)
  ↓
Render → MP4
```

## Component Usage Map

### For Building Layouts
```
START → Container
        ↓
        Grid/Stack
        ↓
        Card/Component
```

### For Adding Content
```
Heading + Text → Badge/Pill
       ↓
       Button/Link
```

### For Data Display
```
StatBox → (in Grid)
TimelineItem → (in Stack)
Tabs → (as container)
```

### For Visual Effects
```
Background/GradientBackground (base)
       ↓
Shape/ParticleSystem (decorative)
       ↓
Transition/Fade (timing)
```

## Component Dependencies

### Independent (No dependencies)
```
TextAnimation, Shape, Glitch, AnimatedCounter,
Heading, Text, Button, Badge, Pill, Avatar, Alert
```

### Layout (Use Container/Grid/Stack)
```
Card, Divider, CodeBlock
```

### Data Visualization
```
StatBox, TimelineItem, Tabs
(typically used within Grid/Stack/Container)
```

### Effects (Use with anything)
```
Background, GradientBackground, ParticleSystem,
Confetti, ProgressBar, Transition, Fade
```

## Animation Flow

```
Frame Timeline
┌─────────────────────────────────────────────────────┐
│  0-30 frames         30-60 frames      60-90 frames │
│  (Item 1 animates)   (Item 2 animates) (Item 3)     │
│  Fade in/Slide in    Fade in/Slide in  Fade in      │
└─────────────────────────────────────────────────────┘

Staggering creates:
- Cascading effect
- Visual interest
- Better pacing
- Professional look
```

## Color & Styling System

```
Tailwind Integration
    ↓
Component Props
    ├── variant    (primary, secondary, etc.)
    ├── size       (sm, md, lg, xl)
    ├── color      (default, primary, success, etc.)
    └── className  (custom Tailwind utilities)
    ↓
Rendered Output
    ├── Dark mode support (dark: prefix)
    ├── Responsive design (sm: md: lg: prefixes)
    ├── Consistent spacing
    └── Professional typography
```

## Composition Types

### 1. Stats & Metrics
```
GradientBackground
├── Container
└── Grid [columns=2]
    ├── StatBox
    ├── StatBox
    ├── StatBox
    └── StatBox
```

### 2. Features Showcase
```
GradientBackground
├── Container
├── Heading + Text
└── Stack [direction=vertical]
    ├── Card → Badge + Heading + Text
    ├── Card → Badge + Heading + Text
    ├── Card → Badge + Heading + Text
    └── Card → Badge + Heading + Text
```

### 3. Testimonials
```
GradientBackground
├── Container
└── Stack [direction=vertical]
    ├── Card
    │   ├── Text (quote)
    │   ├── Divider
    │   └── Stack [direction=horizontal]
    │       ├── Avatar
    │       └── (Heading + Text)
    └── ...
```

### 4. Process/Timeline
```
GradientBackground
├── Container
└── Stack [direction=vertical]
    ├── Card → TimelineItem [variant=active]
    ├── Card → TimelineItem [variant=pending]
    ├── Card → TimelineItem [variant=pending]
    └── Card → TimelineItem [variant=pending]
```

## File Organization

```
remotion/
├── components/
│   ├── Animation/
│   │   ├── TextAnimation.tsx
│   │   ├── Shape.tsx
│   │   ├── ParticleSystem.tsx
│   │   └── ... (10 more)
│   │
│   ├── Layout/
│   │   ├── Container.tsx
│   │   ├── Grid.tsx
│   │   ├── Stack.tsx
│   │   ├── Card.tsx
│   │   └── Divider.tsx
│   │
│   ├── UI/
│   │   ├── Heading.tsx
│   │   ├── Text.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Pill.tsx
│   │   ├── Avatar.tsx
│   │   ├── Alert.tsx
│   │   └── CodeBlock.tsx
│   │
│   ├── Complex/
│   │   ├── StatBox.tsx
│   │   ├── TimelineItem.tsx
│   │   └── Tabs.tsx
│   │
│   └── index.ts (exports all)
│
├── compositions/
│   ├── Original/
│   │   ├── MyComposition.tsx
│   │   ├── ProfessionalIntro.tsx
│   │   ├── TitleSequence.tsx
│   │   └── AnimatedStatsVideo.tsx
│   │
│   ├── New/
│   │   ├── StatsShowcase.tsx
│   │   ├── FeatureShowcase.tsx
│   │   ├── TestimonialShowcase.tsx
│   │   └── ProcessShowcase.tsx
│   │
│   └── index.ts (exports all)
│
├── Root.tsx (Main registry)
├── README.md (Updated overview)
├── QUICK_REFERENCE.md (1-page cheat sheet)
├── TAILWIND_COMPONENTS.md (API docs)
├── COMPONENT_INDEX.md (Full catalog)
├── COMPONENT_REFERENCE.md (Quick lookup)
├── EXAMPLES.md (Copy-paste examples)
└── SETUP_COMPLETE.md (Summary)
```

## Performance Optimization

```
Component Usage
    ↓
Frame Calculation
    ├── delay = 30 * index
    ├── duration = 60 (typical)
    └── total = last_delay + duration
    ↓
Rendering
    ├── Skip heavy particle counts (< 100)
    ├── Use Stack instead of margins (more efficient)
    ├── Batch animations with Fade
    └── Limit grid columns (≤ 6)
    ↓
Export
    ├── 1920x1080 resolution
    ├── 30fps
    ├── H.264 codec
    └── AAC audio
```

## Decision Tree: Which Component?

```
Start: What do I want to create?

├─ Text → TextAnimation (animated) or Text (simple)
├─ Layout → Container, Grid, Stack
├─ Background → Background or GradientBackground
├─ Card/Box → Card
├─ Numbers → AnimatedCounter
├─ Buttons → Button
├─ Labels → Badge or Pill
├─ User profiles → Avatar
├─ Lists → Stack + Card
├─ Grids → Grid + Card
├─ Statistics → StatBox
├─ Process → TimelineItem (in Stack)
├─ Code → CodeBlock
├─ Tabs → Tabs
├─ Separator → Divider
├─ Effects → ParticleSystem, Confetti
├─ Transitions → Transition, Fade
├─ Messages → Alert
└─ Variables → Heading, Text, Badge
```

---

**This is your complete component architecture reference! 🎬**
