import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface ParticleSystemProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  duration?: number;
  opacity?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count = 50,
  color = "#3b82f6",
  size = 4,
  speed = 2,
  duration = 300,
  opacity = 0.6,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = Array.from({ length: count }).map((_, i) => {
    const randomX = (Math.sin(i * 12.9898) * 43758.5453) % width;
    const randomY = (Math.sin(i * 78.233) * 43758.5453) % height;
    const randomSpeed = (Math.sin(i * 23.456) * 0.5 + 1) * speed;

    const x = randomX;
    const y = (randomY - frame * randomSpeed) % (height + size);

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: color,
          opacity,
          boxShadow: `0 0 ${size * 2}px ${color}`,
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
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {particles}
    </div>
  );
};
