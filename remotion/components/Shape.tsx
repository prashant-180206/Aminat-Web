import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";

interface ShapeProps {
  type: "circle" | "rectangle" | "triangle";
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  animate?: boolean;
  style?: React.CSSProperties;
}

export const Shape: React.FC<ShapeProps> = ({
  type,
  size = 100,
  width,
  height,
  color = "#000000",
  delay = 0,
  duration = 60,
  x = 0,
  y = 0,
  animate = false,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = delay;

  let opacity = 0;
  let scale = 1;

  if (frame >= startFrame && frame < startFrame + duration) {
    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );

    if (animate) {
      const springValue = spring({
        fps,
        frame: frame - startFrame,
        config: { damping: 10, mass: 1, stiffness: 100 },
      });
      scale = interpolate(springValue, [0, 1], [0, 1]);
    } else {
      scale = progress;
    }
    opacity = progress;
  } else if (frame >= startFrame + duration) {
    opacity = 1;
    scale = 1;
  }

  let shapeElement = null;
  const shapeStyle: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    opacity,
    transform: `scale(${scale})`,
    transformOrigin: "center",
  };

  if (type === "circle") {
    shapeElement = (
      <div
        style={{
          ...shapeStyle,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: color,
          ...style,
        }}
      />
    );
  } else if (type === "rectangle") {
    shapeElement = (
      <div
        style={{
          ...shapeStyle,
          width: width || size,
          height: height || size,
          backgroundColor: color,
          ...style,
        }}
      />
    );
  } else if (type === "triangle") {
    shapeElement = (
      <div
        style={{
          ...shapeStyle,
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid ${color}`,
          ...style,
        }}
      />
    );
  }

  return shapeElement;
};
