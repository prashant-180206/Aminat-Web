import { interpolate, useCurrentFrame } from "remotion";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
  delay?: number;
  duration?: number;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  delay = 0,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const startFrame = delay;
  const endFrame = delay + duration;

  let opacity = 0;
  let scale = 0.8;

  if (frame >= startFrame && frame < endFrame) {
    const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    opacity = progress;
    scale = interpolate(progress, [0, 1], [0.8, 1]);
  } else if (frame >= endFrame) {
    opacity = 1;
    scale = 1;
  }

  const sizeClass = {
    sm: "px-2 py-1 text-xs font-medium",
    md: "px-3 py-1.5 text-sm font-semibold",
    lg: "px-4 py-2 text-base font-bold",
  };

  const variantClass = {
    default:
      "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
    success:
      "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-100",
    warning:
      "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    error: "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-100",
    info: "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  };

  return (
    <span
      className={`inline-block rounded-full font-medium tracking-wide ${sizeClass[size]} ${variantClass[variant]} ${className}`}
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      {children}
    </span>
  );
};
