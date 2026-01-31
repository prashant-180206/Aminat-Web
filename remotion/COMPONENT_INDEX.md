# Component Library Overview

Complete reference for all Remotion components available in Animat.

## Quick Start

```tsx
import {
  // Animations
  TextAnimation,
  Background,
  Shape,
  Transition,
  Fade,
  
  // Layout
  Container,
  Grid,
  Stack,
  
  // UI
  Heading,
  Text,
  Button,
  Card,
  Badge,
  
  // Complex
  StatBox,
  TimelineItem,
  Avatar,
} from "@remotion/components";
```

## Component Categories

### 🎬 Animation & Effects (13 components)

| Component | Purpose | Use Case |
|-----------|---------|----------|
| `TextAnimation` | Animated text with 4 animation types | Title sequences, text reveals |
| `Background` | Solid or gradient backgrounds | Scene backgrounds |
| `GradientBackground` | Animated gradient effect | Dynamic backgrounds |
| `Shape` | Animated geometric shapes | Decorative elements |
| `Transition` | Scene transitions | Scene boundaries |
| `Fade` | Fade in/out effect | Content reveals |
| `ParticleSystem` | Particle effects | Visual enhancements |
| `ProgressBar` | Animated progress bar | Progress indication |
| `Confetti` | Celebratory confetti | Success states |
| `Glitch` | Glitch text effect | Tech/cyberpunk style |
| `Sequence` | Timing control | Synchronization |
| `Video` | Embedded video playback | Video integration |
| `AnimatedCounter` | Number animations | Stats display |

### 🏗️ Layout Components (5 components)

| Component | Purpose | Props |
|-----------|---------|-------|
| `Container` | Centered container | maxWidth, padding, centered |
| `Grid` | Responsive grid | columns (1-6), gap |
| `Stack` | Flex layout | direction, spacing, align, justify |
| `Divider` | Visual separator | orientation, variant, color |
| `Card` | Reusable card | variant, animateIn |

### 🎨 UI Components (8 components)

| Component | Purpose | Variants |
|-----------|---------|----------|
| `Heading` | Title component (h1-h6) | 6 levels, 3 animations |
| `Text` | Paragraph component | 6 sizes, 6 weights, 6 colors |
| `Button` | Clickable button | 5 variants, 3 sizes |
| `Badge` | Small label | 5 variants, 3 sizes |
| `Pill` | Rounded badge | 5 variants |
| `Avatar` | User avatar | 2 variants, 4 sizes |
| `Alert` | Message alert | 4 variants (info/success/warning/error) |
| `CodeBlock` | Code display | 2 themes, line numbers |

### 📊 Complex Components (4 components)

| Component | Purpose | Features |
|-----------|---------|----------|
| `StatBox` | Statistics display | Icon, trend indicator, 5 variants |
| `TimelineItem` | Timeline step | 3 states (pending/active/completed) |
| `Tabs` | Tabbed interface | 3 variants (underline/pills/cards) |

## Composition Gallery

### Pre-built Compositions (4 types)

1. **ProfessionalIntro** (300 frames)
   - Modern gradient background
   - Animated title and subtitle
   - Professional styling

2. **TitleSequence** (240 frames)
   - Simple title composition
   - Decorative shapes
   - Clean design

3. **AnimatedStatsVideo** (360 frames)
   - 4 stat cards with animated counters
   - Professional layout
   - Dark theme

4. **StatsShowcase** (360 frames) - NEW
   - 4 stat boxes with trends
   - Blue color scheme
   - Responsive grid

5. **FeatureShowcase** (450 frames) - NEW
   - 4 feature cards with badges
   - Call-to-action button
   - Clean layout

6. **TestimonialShowcase** (420 frames) - NEW
   - 3 testimonial cards
   - User avatars
   - Dark theme

7. **ProcessShowcase** (360 frames) - NEW
   - 4-step timeline
   - Process visualization
   - Light theme

## Animation Timing

All components use frame-based timing (@ 30fps default):

- 30 frames = 1 second
- 60 frames = 2 seconds
- 120 frames = 4 seconds
- 300 frames = 10 seconds
- 450 frames = 15 seconds

## Tailwind Integration

All components are built with Tailwind CSS:

- ✅ Full dark mode support
- ✅ Responsive design
- ✅ Consistent styling
- ✅ Custom className support
- ✅ Color variants
- ✅ Size variants

## Common Props

### Animation Props (used by most components)
```tsx
{
  delay?: number;        // Start frame (default: 0)
  duration?: number;     // Animation frames (default: 30)
  className?: string;    // Tailwind classes
  style?: CSSProperties; // Inline styles
}
```

### Size Variants
```tsx
"sm"   // Small
"md"   // Medium (default)
"lg"   // Large
"xl"   // Extra Large
```

### Color Variants
```tsx
"default"   // Neutral/slate
"primary"   // Blue
"success"   // Green
"warning"   // Yellow
"error"     // Red
```

## Code Examples

### Example 1: Feature Card
```tsx
<Card variant="elevated" className="p-6">
  <Badge variant="info">New</Badge>
  <Heading level={3}>Feature Name</Heading>
  <Text color="muted">Feature description</Text>
</Card>
```

### Example 2: Stats Grid
```tsx
<Grid columns={2} gap="lg">
  <StatBox label="Users" value="25.5K" icon="👥" trend={{ value: 12, direction: "up" }} />
  <StatBox label="Revenue" value="$125K" icon="💰" trend={{ value: 8, direction: "up" }} />
</Grid>
```

### Example 3: Timeline
```tsx
<Stack direction="vertical" spacing="lg">
  {steps.map((step, i) => (
    <TimelineItem
      title={step.title}
      description={step.description}
      variant={i === 0 ? "active" : "pending"}
      index={i}
      delay={60 + i * 30}
      duration={60}
    />
  ))}
</Stack>
```

### Example 4: With Gradient Background
```tsx
<GradientBackground from="#3b82f6" to="#8b5cf6" animated>
  <Container maxWidth="lg">
    <Heading level={1}>Amazing Content</Heading>
  </Container>
</GradientBackground>
```

## Export & Rendering

### Available Compositions for Export

All compositions can be rendered via:

```bash
remotion render [composition-id] [output-path]
```

Available IDs:
- `MyComposition`
- `ProfessionalIntro`
- `TitleSequence`
- `AnimatedStats`
- `StatsShowcase`
- `FeatureShowcase`
- `TestimonialShowcase`
- `ProcessShowcase`

### Render Settings

**Recommended:**
- Resolution: 1920x1080 (Full HD)
- FPS: 30
- Codec: H.264
- Audio: AAC

## Best Practices

1. **Use Container for consistency** - Wrap content in Container
2. **Stack for spacing** - Use Stack instead of manual margins
3. **Grid for layouts** - Use Grid for multi-column layouts
4. **Stagger animations** - Delay each item by 20-30 frames
5. **Color palette** - Stick to one primary color
6. **Typography** - Use Heading levels (1-6) semantically
7. **Whitespace** - Use proper padding via Container

## Performance Tips

- Keep particle count < 100
- Use Stack for layout (more efficient)
- Batch animations with Fade
- Limit grid columns to 4-6
- Preload images/videos

## Dark Mode

All components support dark mode automatically:

```tsx
<Text className="text-slate-900 dark:text-white">
  Adapts to dark mode
</Text>
```

Built-in dark support:
- `dark:bg-*`, `dark:text-*`, `dark:border-*`
- All UI components have dark variants
- GradientBackground works with any color

## Extending Components

Create custom components using base utilities:

```tsx
export const MyCard: React.FC<Props> = (props) => {
  const frame = useCurrentFrame();
  const opacity = // your animation logic
  
  return (
    <Card className="custom-styles" style={{ opacity }}>
      {/* content */}
    </Card>
  );
};
```

## Troubleshooting

**Components not rendering?**
- Check frame timing (delay + duration)
- Verify imports from `@remotion/components`

**Styling not applying?**
- Ensure Tailwind CSS is configured
- Check className syntax
- Verify dark mode classes

**Animation too fast/slow?**
- Adjust duration prop (frames)
- Remember: 30 fps = 1 second

---

For detailed documentation, see:
- [COMPONENTS.md](./COMPONENTS.md) - Original components guide
- [TAILWIND_COMPONENTS.md](./TAILWIND_COMPONENTS.md) - Tailwind components guide
