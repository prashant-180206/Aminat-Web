import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface AnimatedCounterProps {
  from: number;
  to: number;
  delay?: number;
  duration?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number | string;
  prefix?: string;
  suffix?: string;
  decimalPlaces?: number;
  style?: React.CSSProperties;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from,
  to,
  delay = 0,
  duration = 60,
  fontSize = 48,
  color = "#000000",
  fontWeight = "bold",
  prefix = "",
  suffix = "",
  decimalPlaces = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const startFrame = delay;
  const endFrame = delay + duration;

  let displayValue = from;

  if (frame >= startFrame && frame < endFrame) {
    const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    displayValue = interpolate(progress, [0, 1], [from, to]);
  } else if (frame >= endFrame) {
    displayValue = to;
  }

  const formattedValue = displayValue.toFixed(decimalPlaces);

  return (
    <div
      style={{
        fontSize,
        color,
        fontWeight,
        ...style,
      }}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </div>
  );
};
