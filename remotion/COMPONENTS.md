# Remotion Custom Components Guide

Complete documentation for custom Remotion components for professional video creation.

## Core Components

### 1. **TextAnimation**
Animated text with multiple animation types.

```tsx
<TextAnimation
  delay={0}
  duration={60}
  animationType="fadeIn" // "fadeIn" | "slideIn" | "bounce" | "scale"
  fontSize={48}
  fontWeight="bold"
  color="#000000"
  fontFamily="Arial, sans-serif"
  textAlign="center"
>
  Your Text Here
</TextAnimation>
```

**Props:**
- `delay`: Frame delay before animation starts (default: 0)
- `duration`: Animation duration in frames (default: 30)
- `animationType`: Type of animation effect
- `fontSize`: Font size in pixels
- `fontWeight`: Font weight (100-900 or "bold", "normal")
- `color`: Text color (hex, rgb, etc)
- `fontFamily`: Font family string
- `textAlign`: "left" | "center" | "right"
- `style`: Additional CSS styles

---

### 2. **Background**
Customizable background with optional animated gradients.

```tsx
<Background
  color="#ffffff"
  gradient={{ from: "#3b82f6", to: "#1e40af", angle: 45 }}
  animated={true}
  animationDuration={300}
>
  {children}
</Background>
```

**Props:**
- `color`: Solid background color
- `gradient`: Gradient configuration with `from`, `to`, and `angle`
- `animated`: Enable animated gradient rotation
- `animationDuration`: Duration of gradient animation in frames
- `children`: Content to overlay on background

---

### 3. **Shape**
Animated geometric shapes (circle, rectangle, triangle).

```tsx
<Shape
  type="circle" // "circle" | "rectangle" | "triangle"
  size={100}
  width={150} // for rectangle only
  height={150} // for rectangle only
  color="#3b82f6"
  delay={0}
  duration={60}
  x={100}
  y={100}
  animate={true}
  style={{ opacity: 0.8 }}
/>
```

**Props:**
- `type`: Shape type
- `size`: Base size in pixels
- `color`: Shape color
- `delay`: Frame delay
- `duration`: Animation duration
- `x`, `y`: Position coordinates
- `animate`: Use spring animation
- `style`: Additional styles

---

### 4. **Transition**
Slide and fade transitions between scenes.

```tsx
<Transition
  type="slideLeft" // "fade" | "slideLeft" | "slideRight" | "slideUp" | "slideDown" | "zoom"
  duration={30}
  delay={0}
>
  {children}
</Transition>
```

---

### 5. **Fade**
Simple fade in/out component.

```tsx
<Fade from={0} duration={30} direction="in">
  {children}
</Fade>
```

**Props:**
- `from`: Start frame
- `duration`: Animation duration in frames
- `direction`: "in" | "out"

---

### 6. **AnimatedCounter**
Counter that animates from one number to another.

```tsx
<AnimatedCounter
  from={0}
  to={1000}
  delay={30}
  duration={120}
  fontSize={48}
  color="#3b82f6"
  fontWeight={700}
  prefix="$"
  suffix="K"
  decimalPlaces={0}
/>
```

---

### 7. **ParticleSystem**
Animated particle effects.

```tsx
<ParticleSystem
  count={50}
  color="#3b82f6"
  size={4}
  speed={2}
  duration={300}
  opacity={0.6}
/>
```

---

### 8. **ProgressBar**
Animated progress bar.

```tsx
<ProgressBar
  from={0}
  to={100}
  duration={120}
  color="#3b82f6"
  backgroundColor="#e5e7eb"
  height={8}
  animated={true}
/>
```

---

### 9. **Confetti**
Celebratory confetti effect.

```tsx
<Confetti
  trigger={60}
  duration={120}
  particleCount={50}
  colors={["#ff6b6b", "#4ecdc4", "#45b7d1", "#ffd93d", "#6bcf7f"]}
  gravity={0.3}
/>
```

---

### 10. **Sequence**
Organize content with timing sequences.

```tsx
<Sequence from={0} duration={120} layout="none">
  {children}
</Sequence>
```

---

### 11. **Video**
Embed and control video playback.

```tsx
<Video
  src="/video.mp4"
  from={0}
  duration={300}
  volume={1}
  width="100%"
  height="auto"
  muted={false}
/>
```

---

## Pre-built Compositions

### ProfessionalIntro
Modern intro with gradient effects and accent color.

```tsx
<ProfessionalIntro
  title="Animat"
  subtitle="Professional Video Creation"
  accentColor="#3b82f6"
/>
```

Duration: 300 frames @ 30fps = 10 seconds

---

### TitleSequence
Title and subtitle with decorative shapes.

```tsx
<TitleSequence
  mainTitle="Create Amazing Videos"
  subtitle="With Remotion Components"
  backgroundColor="#ffffff"
  textColor="#000000"
/>
```

Duration: 240 frames @ 30fps = 8 seconds

---

### AnimatedStatsVideo
Professional statistics display with animated counters.

```tsx
<AnimatedStatsVideo
  backgroundColor="#0f172a"
  accentColor="#3b82f6"
/>
```

Duration: 360 frames @ 30fps = 12 seconds

Displays:
- Videos Created (10,000)
- Active Users (50,000)
- Export Hours (25,000)
- Satisfaction (98%)

---

## Common Patterns

### 1. Fade In & Out Sequence
```tsx
<Fade from={0} duration={30} direction="in">
  <TextAnimation delay={0} duration={60} animationType="slideIn">
    Content here
  </TextAnimation>
</Fade>

<Fade from={150} duration={30} direction="out">
  {/* Same content */}
</Fade>
```

### 2. Staggered Animations
```tsx
{items.map((item, index) => (
  <Fade key={index} from={30 * index} duration={60} direction="in">
    <TextAnimation delay={30 * index} duration={60}>
      {item.text}
    </TextAnimation>
  </Fade>
))}
```

### 3. Background with Content
```tsx
<Background
  color="#ffffff"
  gradient={{ from: "#3b82f6", to: "#1e40af" }}
>
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <TextAnimation fontSize={72} animationType="bounce">
      Welcome
    </TextAnimation>
  </AbsoluteFill>
</Background>
```

### 4. Stats Section
```tsx
<AnimatedStatsVideo
  backgroundColor="#0f172a"
  accentColor="#3b82f6"
/>
```

---

## Tips & Best Practices

1. **Frame Timing**: Always calculate frames as `seconds * fps` (30fps standard)
   - 1 second = 30 frames
   - 2 seconds = 60 frames

2. **Color Schemes**: Use consistent accent colors across animations

3. **Performance**: Keep particle counts under 100 for smooth playback

4. **Font Families**: Use web-safe fonts or import from Google Fonts

5. **Transitions**: Use 30-60 frame transitions for smooth effects

6. **Spacing**: Use consistent margins/padding for professional look

7. **Z-Index**: Higher z-index values appear on top

---

## Integration with Remotion Root

All compositions are registered in `Root.tsx`:

```tsx
<Composition
  id="ComponentName"
  component={ComponentName as any}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{}}
/>
```

---

## Video Export Settings

Recommended render settings:
- Resolution: 1920x1080 (Full HD)
- FPS: 30
- Codec: H.264
- Audio Codec: AAC

---

## Need Help?

Refer to individual component files for full implementation details.
