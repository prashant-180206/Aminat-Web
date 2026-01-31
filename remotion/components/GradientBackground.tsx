import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface GradientBackgroundProps {
  from: string;
  to: string;
  angle?: number;
  animated?: boolean;
  animationDuration?: number;
  children?: React.ReactNode;
  className?: string;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  from,
  to,
  angle = 135,
  animated = false,
  animationDuration = 300,
  children,
  className = "",
}) => {
  const frame = useCurrentFrame();

  let currentAngle = angle;
  if (animated) {
    currentAngle = interpolate(
      frame % animationDuration,
      [0, animationDuration],
      [angle, angle + 360],
    );
  }

  return (
    <AbsoluteFill
      className={`bg-gradient-to-br ${className}`}
      style={{
        background: `linear-gradient(${currentAngle}deg, ${from}, ${to})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
