import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

interface ConfettiProps {
  trigger?: number;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  gravity?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({
  trigger = 0,
  duration = 120,
  particleCount = 50,
  colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#ffd93d", "#6bcf7f"],
  gravity = 0.3,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const startFrame = trigger;
    const endFrame = trigger + duration;

    if (frame < startFrame || frame > endFrame) return null;

    const progress = (frame - startFrame) / (endFrame - startFrame);
    const angle = (i / particleCount) * Math.PI * 2;
    const velocity = 8;
    const x = Math.cos(angle) * velocity * fps * progress * 2;
    const y =
      Math.sin(angle) * velocity * fps * progress * 2 +
      progress * progress * gravity * fps * fps;
    const rotation = progress * 360 * 3;
    const opacity = Math.max(0, 1 - progress);

    const startX = width / 2;
    const startY = height / 2;
    const color = colors[i % colors.length];

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: startX + x,
          top: startY + y,
          width: "12px",
          height: "12px",
          backgroundColor: color,
          borderRadius: "50%",
          opacity,
          transform: `rotate(${rotation}deg)`,
          boxShadow: `0 0 10px ${color}`,
          pointerEvents: "none",
        }}
      />
    );
  });

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {particles}
    </div>
  );
};
