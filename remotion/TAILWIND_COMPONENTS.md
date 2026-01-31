# Remotion Tailwind Components Guide

Complete documentation for Tailwind CSS-powered Remotion components.

## Layout Components

### Container
Responsive container with padding and max-width constraints.

```tsx
<Container maxWidth="lg" padding="md" centered={true}>
  {children}
</Container>
```

**Props:**
- `maxWidth`: "sm" | "md" | "lg" | "xl" | "2xl" | "full" (default: "lg")
- `padding`: "xs" | "sm" | "md" | "lg" | "xl" (default: "md")
- `centered`: Center container (default: true)

---

### Grid
Responsive grid layout with gap control.

```tsx
<Grid columns={3} gap="lg">
  {children}
</Grid>
```

**Props:**
- `columns`: 1 | 2 | 3 | 4 | 6 (default: 3)
- `gap`: "sm" | "md" | "lg" | "xl" (default: "md")

---

### Stack
Flexible layout for horizontal or vertical stacking.

```tsx
<Stack direction="vertical" spacing="md" align="center" justify="center">
  {children}
</Stack>
```

**Props:**
- `direction`: "horizontal" | "vertical" (default: "vertical")
- `spacing`: "xs" | "sm" | "md" | "lg" | "xl" (default: "md")
- `align`: "start" | "center" | "end" (default: "center")
- `justify`: "start" | "center" | "between" | "end" (default: "start")

---

## UI Components

### Heading
Animated heading with 6 levels.

```tsx
<Heading level={1} animation="slideIn" delay={0} duration={60}>
  Your Heading
</Heading>
```

**Props:**
- `level`: 1 | 2 | 3 | 4 | 5 | 6 (default: 1)
- `animation`: "fadeIn" | "slideIn" | "bounce" (default: "fadeIn")
- `delay`: Frame delay
- `duration`: Animation duration in frames

---

### Text
Customizable text with multiple variants.

```tsx
<Text size="base" weight="normal" color="default" align="left" delay={0} duration={30}>
  Your text content
</Text>
```

**Props:**
- `size`: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" (default: "base")
- `weight`: "light" | "normal" | "medium" | "semibold" | "bold" | "black"
- `color`: "default" | "muted" | "primary" | "success" | "warning" | "error"
- `align`: "left" | "center" | "right" | "justify"

---

### Badge
Small badge with multiple variants and sizes.

```tsx
<Badge variant="info" size="md" delay={0} duration={30}>
  Badge Text
</Badge>
```

**Props:**
- `variant`: "default" | "success" | "warning" | "error" | "info"
- `size`: "sm" | "md" | "lg"

---

### Button
Animated button with multiple styles.

```tsx
<Button variant="primary" size="md" delay={0} duration={30}>
  Click Me
</Button>
```

**Props:**
- `variant`: "primary" | "secondary" | "outline" | "ghost" | "danger"
- `size`: "sm" | "md" | "lg"

---

### Pill
Pill-shaped badge with optional icon.

```tsx
<Pill variant="primary" icon="⭐" delay={0} duration={30}>
  Featured
</Pill>
```

**Props:**
- `variant`: "primary" | "secondary" | "success" | "warning" | "danger"
- `icon`: Optional React node for icon

---

### Avatar
User avatar with initials or image.

```tsx
<Avatar
  initials="JD"
  size="md"
  variant="circle"
  delay={0}
  duration={30}
/>
```

**Props:**
- `src`: Image URL (optional)
- `initials`: Fallback initials (default: "US")
- `size`: "sm" | "md" | "lg" | "xl"
- `variant`: "circle" | "rounded"

---

### Alert
Alert message with different severity levels.

```tsx
<Alert variant="info" title="Info" delay={0} duration={30}>
  Alert message content
</Alert>
```

**Props:**
- `variant`: "info" | "success" | "warning" | "error"
- `title`: Optional title

---

### Card
Reusable card component with multiple variants.

```tsx
<Card variant="elevated" delay={0} duration={30}>
  {children}
</Card>
```

**Props:**
- `variant`: "default" | "elevated" | "outlined" | "gradient"
- `animateIn`: Animate on mount (default: true)

---

### Divider
Visual separator with orientation control.

```tsx
<Divider orientation="horizontal" variant="solid" color="default" delay={0} duration={20} />
```

**Props:**
- `orientation`: "horizontal" | "vertical"
- `variant`: "solid" | "dashed" | "dotted"
- `color`: "default" | "muted"

---

## Complex Components

### StatBox
Statistics display with trend indicator.

```tsx
<StatBox
  label="Total Users"
  value="25.5K"
  icon="👥"
  trend={{ value: 12, direction: "up" }}
  variant="primary"
  delay={0}
  duration={30}
/>
```

---

### TimelineItem
Timeline step indicator with status.

```tsx
<TimelineItem
  title="Step Title"
  description="Step description"
  variant="completed" // "completed" | "active" | "pending"
  index={0}
  delay={0}
  duration={30}
/>
```

---

### Tabs
Tabbed interface with multiple variants.

```tsx
<Tabs
  tabs={[
    { label: "Tab 1", content: <div>Content 1</div> },
    { label: "Tab 2", content: <div>Content 2</div> },
  ]}
  defaultTab={0}
  variant="underline" // "underline" | "pills" | "cards"
/>
```

---

### CodeBlock
Syntax-highlighted code block.

```tsx
<CodeBlock
  code="const hello = 'world';"
  language="javascript"
  showLineNumbers={true}
  theme="dark"
/>
```

---

### GradientBackground
Animated gradient background layer.

```tsx
<GradientBackground
  from="#3b82f6"
  to="#8b5cf6"
  angle={135}
  animated={true}
  animationDuration={300}
>
  {children}
</GradientBackground>
```

---

## Pre-built Compositions

### StatsShowcase
Beautiful statistics display (360 frames @ 30fps = 12s)

```tsx
<StatsShowcase title="Platform Statistics" />
```

---

### FeatureShowcase
Feature cards with descriptions (450 frames = 15s)

```tsx
<FeatureShowcase title="Key Features" />
```

---

### TestimonialShowcase
Customer testimonials with avatars (420 frames = 14s)

```tsx
<TestimonialShowcase title="What Creators Say" />
```

---

### ProcessShowcase
Step-by-step process timeline (360 frames = 12s)

```tsx
<ProcessShowcase title="How It Works" />
```

---

## Common Patterns

### Feature Card
```tsx
<Card variant="elevated" className="p-6">
  <Stack direction="vertical" spacing="md">
    <Badge variant="info">Feature</Badge>
    <Heading level={3}>Feature Title</Heading>
    <Text color="muted">Feature description</Text>
  </Stack>
</Card>
```

### Stats Grid
```tsx
<Grid columns={2} gap="lg">
  <StatBox label="Metric 1" value="100" icon="📊" />
  <StatBox label="Metric 2" value="200" icon="💰" />
  <StatBox label="Metric 3" value="300" icon="⚡" />
  <StatBox label="Metric 4" value="400" icon="🎯" />
</Grid>
```

### Testimonial Card
```tsx
<Card variant="outlined" className="p-8">
  <Stack direction="vertical" spacing="md">
    <Text size="lg" className="italic">"{testimonial}"</Text>
    <Divider orientation="horizontal" />
    <Stack direction="horizontal" spacing="md" align="center">
      <Avatar initials="JD" />
      <div>
        <Heading level={4}>Author Name</Heading>
        <Text size="sm" color="muted">Role Title</Text>
      </div>
    </Stack>
  </Stack>
</Card>
```

---

## Color Palette

All components support Tailwind's color scheme:

**Primary**: Blue (blue-500, blue-600, etc.)
**Success**: Green (green-500, green-600, etc.)
**Warning**: Yellow (yellow-500, yellow-600, etc.)
**Error**: Red (red-500, red-600, etc.)
**Neutral**: Slate (slate-100 to slate-900)

---

## Animation Defaults

- Default delay: 0 frames
- Default duration: 30 frames (1 second at 30fps)
- All components support frame-based animation
- Animations are non-blocking and concurrent

---

## Tips & Best Practices

1. **Consistency**: Use same spacing and gap values throughout
2. **Colors**: Leverage Tailwind's color palette for consistency
3. **Timing**: Stagger animations by 20-30 frames for visual interest
4. **Responsive**: Components adapt to content naturally
5. **Performance**: Grid with gap is more efficient than margins
6. **Accessibility**: Use semantic HTML (Heading levels 1-6)
7. **Dark Mode**: All components support dark mode classes

---

## Tailwind Classes Reference

All components fully support Tailwind's utility classes through the `className` prop:

```tsx
<Card className="shadow-2xl rounded-3xl">
  <Heading className="text-gradient">Title</Heading>
  <Text className="line-clamp-3">Long text...</Text>
</Card>
```

Common utilities:
- `p-*` (padding), `m-*` (margin)
- `rounded-*`, `shadow-*`
- `text-*`, `font-*`, `line-clamp-*`
- `border-*`, `bg-*`, `text-opacity-*`
- `flex`, `grid`, `space-*`

---

For more Tailwind classes, visit [tailwindcss.com](https://tailwindcss.com)
