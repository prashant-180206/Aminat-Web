import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface BackgroundProps {
  color?: string;
  gradient?: {
    from: string;
    to: string;
    angle?: number;
  };
  animated?: boolean;
  animationDuration?: number;
  children?: React.ReactNode;
}

export const Background: React.FC<BackgroundProps> = ({
  color = "#ffffff",
  gradient,
  animated = false,
  animationDuration = 300,
  children,
}) => {
  const frame = useCurrentFrame();

  const backgroundColor = color;
  let backgroundImage = undefined;

  if (gradient) {
    const angle = gradient.angle || 45;
    backgroundImage = `linear-gradient(${angle}deg, ${gradient.from}, ${gradient.to})`;
  }

  if (animated && gradient) {
    const rotation = interpolate(
      frame % animationDuration,
      [0, animationDuration],
      [0, 360],
    );
    backgroundImage = `linear-gradient(${rotation}deg, ${gradient.from}, ${gradient.to})`;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        backgroundImage,
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
