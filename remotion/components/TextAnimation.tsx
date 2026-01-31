import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";

interface TextAnimationProps {
  children: string;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  delay?: number;
  duration?: number;
  animationType?: "fadeIn" | "slideIn" | "bounce" | "scale";
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
  style?: React.CSSProperties;
}

export const TextAnimation: React.FC<TextAnimationProps> = ({
  children,
  fontSize = 48,
  fontWeight = "bold",
  color = "#000000",
  delay = 0,
  duration = 30,
  animationType = "fadeIn",
  fontFamily = "Arial, sans-serif",
  textAlign = "center",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = delay;
  const endFrame = delay + duration;

  let opacity = 1;
  let transform = "translate(0, 0) scale(1)";

  if (frame < startFrame) {
    opacity = 0;
  } else if (frame < endFrame) {
    const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    switch (animationType) {
      case "fadeIn":
        opacity = progress;
        break;
      case "slideIn":
        opacity = progress;
        transform = `translateX(${interpolate(progress, [0, 1], [-100, 0])}px)`;
        break;
      case "bounce":
        opacity = 1;
        const bounceSpring = spring({
          fps,
          frame: frame - startFrame,
          config: { damping: 10, mass: 1, stiffness: 100 },
        });
        transform = `scale(${interpolate(bounceSpring, [0, 1], [0.5, 1])})`;
        break;
      case "scale":
        opacity = progress;
        transform = `scale(${interpolate(progress, [0, 1], [0.5, 1])})`;
        break;
    }
  } else {
    opacity = 1;
  }

  return (
    <div
      style={{
        fontSize,
        fontWeight,
        color,
        fontFamily,
        textAlign,
        opacity,
        transform,
        transition: "all 0.1s ease-out",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
