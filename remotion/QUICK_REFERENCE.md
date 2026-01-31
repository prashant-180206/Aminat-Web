# Remotion Components Quick Reference

## At a Glance

### 30 Total Components
- **Animation**: 13 components
- **Layout**: 5 components  
- **UI**: 8 components
- **Complex**: 4 components

### 8 Pre-built Compositions
Ready-to-use video templates

---

## Animation Components (Use for movement & effects)

```
TextAnimation      - Animated text with 4 effects
Shape              - Circles, rectangles, triangles
Transition         - Scene transitions (6 types)
Fade               - Fade in/out
ParticleSystem     - Particle effects
ProgressBar        - Animated progress bar
Confetti           - Celebratory effect
Glitch             - Glitch text effect
AnimatedCounter    - Number animations
Background         - Solid/gradient background
GradientBackground - Animated gradients
Video              - Embedded video
Sequence           - Timing control
```

---

## Layout Components (Use for structure)

```
Container   maxWidth="lg" padding="md"
Grid        columns={3} gap="lg"
Stack       direction="vertical" spacing="md"
Divider     orientation="horizontal"
Card        variant="elevated"
```

---

## UI Components (Use for interface elements)

```
Heading     level={1-6} animation="slideIn"
Text        size="base" weight="bold" color="primary"
Button      variant="primary" size="md"
Badge       variant="info" size="md"
Pill        variant="success"
Avatar      initials="AB" size="md"
Alert       variant="success" title="Success!"
CodeBlock   language="javascript" theme="dark"
```

---

## Complex Components (Use for content)

```
StatBox       label="Users" value="1K" trend={{value: 12, direction: "up"}}
TimelineItem  title="Step 1" variant="active" index={0}
Tabs          defaultTab={0} variant="underline"
```

---

## Pre-built Compositions (Render directly)

```
ProfessionalIntro      (300 frames) - Modern intro
TitleSequence          (240 frames) - Simple titles
AnimatedStatsVideo     (360 frames) - 4 animated stats
StatsShowcase          (360 frames) - Beautiful stats display
FeatureShowcase        (450 frames) - Feature cards
TestimonialShowcase    (420 frames) - Customer testimonials
ProcessShowcase        (360 frames) - Step-by-step timeline
```

---

## Common Patterns

### Stats Grid (2x2)
```tsx
<Grid columns={2} gap="lg">
  <StatBox label="X" value="100" />
  <StatBox label="Y" value="200" />
  <StatBox label="Z" value="300" />
  <StatBox label="W" value="400" />
</Grid>
```

### Feature List
```tsx
<Stack direction="vertical" spacing="lg">
  {features.map((f, i) => (
    <Card key={i} delay={60 + i*30} duration={60}>
      <Badge>{f.tag}</Badge>
      <Heading level={3}>{f.title}</Heading>
      <Text color="muted">{f.desc}</Text>
    </Card>
  ))}
</Stack>
```

### Timeline Process
```tsx
<Stack direction="vertical" spacing="lg">
  {steps.map((s, i) => (
    <TimelineItem
      key={i}
      title={s.title}
      variant={i === 0 ? "active" : "pending"}
      index={i}
      delay={60 + i*30}
    />
  ))}
</Stack>
```

---

## Animation Timing Quick Math

**@ 30 FPS (default)**
```
30 frames   = 1 second
60 frames   = 2 seconds
90 frames   = 3 seconds
120 frames  = 4 seconds
150 frames  = 5 seconds
300 frames  = 10 seconds
450 frames  = 15 seconds
```

**For staggered animations:**
- Start at frame 0
- Add 20-30 frames between each item
- Total = first delay + final duration

---

## Color & Style Reference

### Text Colors
```tsx
<Text color="default" />   // Slate-900 / dark:white
<Text color="muted" />     // Slate-600 / dark:slate-400
<Text color="primary" />   // Blue-600
<Text color="success" />   // Green-600
<Text color="warning" />   // Yellow-600
<Text color="error" />     // Red-600
```

### Button Variants
```tsx
<Button variant="primary" />    // Blue background
<Button variant="secondary" />  // Gray background
<Button variant="outline" />    // Bordered
<Button variant="ghost" />      // Text only
<Button variant="danger" />     // Red background
```

### Badge Variants
```tsx
<Badge variant="default" />   // Gray
<Badge variant="success" />   // Green
<Badge variant="warning" />   // Yellow
<Badge variant="error" />     // Red
<Badge variant="info" />      // Blue
```

### Card Variants
```tsx
<Card variant="default" />     // Plain white
<Card variant="elevated" />    // Shadow
<Card variant="outlined" />    // Border
<Card variant="gradient" />    // Blue-purple gradient
```

---

## Import Template

```tsx
import {
  // Animation
  TextAnimation, Background, GradientBackground, Shape, 
  Transition, Fade, ParticleSystem, ProgressBar, Confetti, 
  Glitch, AnimatedCounter, Sequence, Video,
  
  // Layout
  Container, Grid, Stack, Divider, Card,
  
  // UI
  Heading, Text, Button, Badge, Pill, Avatar, Alert, CodeBlock,
  
  // Complex
  StatBox, TimelineItem, Tabs,
  
  // Compositions
  ProfessionalIntro, StatsShowcase, FeatureShowcase,
  TestimonialShowcase, ProcessShowcase,
} from "@remotion/components";
```

---

## File Structure

```
remotion/
├── components/
│   ├── Animation/       (13 files)
│   ├── Layout/          (5 files)
│   ├── UI/              (8 files)
│   ├── Complex/         (4 files)
│   └── index.ts
├── compositions/
│   ├── (8 composition files)
│   └── index.ts
├── Root.tsx
├── COMPONENTS.md
├── TAILWIND_COMPONENTS.md
└── COMPONENT_INDEX.md
```

---

## Key Features

✅ **Frame-based timing** - Precise animation control
✅ **Tailwind CSS** - Consistent, beautiful styling
✅ **Dark mode** - Built-in support
✅ **Responsive** - Adapts to content
✅ **Composable** - Mix and match components
✅ **Animated** - All components can animate
✅ **TypeScript** - Full type safety
✅ **Production-ready** - Export to video

---

## Render Command

```bash
# Render any composition
remotion render [composition-id] output.mp4

# Example
remotion render StatsShowcase output.mp4
remotion render FeatureShowcase feature-video.mp4
remotion render TestimonialShowcase testimonials.mp4
```

---

## Pro Tips

1. **Use Container** - Wraps for consistency
2. **Stack > margins** - More predictable spacing
3. **Grid for layouts** - Responsive by default
4. **Delay animations** - Keep delay < duration for smoothness
5. **Batch updates** - Use Fade to fade in groups
6. **One primary color** - For visual coherence
7. **Limit particles** - Keep < 100 for performance

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Components don't appear | Check delay + duration timing |
| Styling looks wrong | Verify Tailwind is enabled |
| Animation too fast | Increase duration frames |
| Dark mode not working | Ensure dark: prefix works |
| Performance slow | Reduce ParticleSystem count |

---

## Resources

- **Remotion Docs**: https://remotion.dev
- **Tailwind Docs**: https://tailwindcss.com
- **Component Guide**: [TAILWIND_COMPONENTS.md](./TAILWIND_COMPONENTS.md)
- **Full Index**: [COMPONENT_INDEX.md](./COMPONENT_INDEX.md)

---

Generated: 2026-01-29
Last Updated: Comprehensive Tailwind Component Suite
