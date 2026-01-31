import { interpolate, useCurrentFrame } from "remotion";

interface ProgressBarProps {
  from?: number;
  to?: number;
  duration?: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  animated?: boolean;
  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  from = 0,
  to = 100,
  duration = 60,
  color = "#3b82f6",
  backgroundColor = "#e5e7eb",
  height = 8,
  animated = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const startFrame = from;
  const endFrame = from + duration;

  let progress = 0;

  if (frame >= startFrame && frame < endFrame) {
    progress = interpolate(frame, [startFrame, endFrame], [0, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame >= endFrame) {
    progress = to;
  }

  return (
    <div
      style={{
        width: "100%",
        height,
        backgroundColor,
        borderRadius: height / 2,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: color,
          borderRadius: height / 2,
          transition: animated ? "width 0.1s ease-out" : "none",
          boxShadow: `0 0 20px ${color}40`,
        }}
      />
    </div>
  );
};
