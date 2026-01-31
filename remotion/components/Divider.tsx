import { interpolate, useCurrentFrame } from "remotion";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  variant?: "solid" | "dashed" | "dotted";
  color?: "default" | "muted";
  delay?: number;
  duration?: number;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  className = "",
  variant = "solid",
  color = "default",
  delay = 0,
  duration = 20,
}) => {
  const frame = useCurrentFrame();
  const startFrame = delay;
  const endFrame = delay + duration;

  let scaleValue = 0;

  if (frame >= startFrame && frame < endFrame) {
    scaleValue = interpolate(frame, [startFrame, endFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame >= endFrame) {
    scaleValue = 1;
  }

  const variantClass = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
  };

  const colorClass = {
    default: "border-slate-300 dark:border-slate-600",
    muted: "border-slate-200 dark:border-slate-700",
  };

  const baseClass = `${variantClass[variant]} ${colorClass[color]}`;

  if (orientation === "horizontal") {
    return (
      <div
        className={`w-full border-t-2 ${baseClass} ${className}`}
        style={{
          transform: `scaleX(${scaleValue})`,
          transformOrigin: "left",
        }}
      />
    );
  }

  return (
    <div
      className={`h-full border-l-2 ${baseClass} ${className}`}
      style={{
        transform: `scaleY(${scaleValue})`,
        transformOrigin: "top",
      }}
    />
  );
};
