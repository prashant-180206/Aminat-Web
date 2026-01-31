import { interpolate, useCurrentFrame } from "remotion";

interface StatBoxProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; direction: "up" | "down" };
  variant?: "default" | "primary" | "success" | "warning" | "error";
  delay?: number;
  duration?: number;
}

export const StatBox: React.FC<StatBoxProps> = ({
  label,
  value,
  icon,
  trend,
  variant = "default",
  delay = 0,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const startFrame = delay;
  const endFrame = delay + duration;

  let opacity = 0;
  let scale = 0.9;

  if (frame >= startFrame && frame < endFrame) {
    const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    opacity = progress;
    scale = interpolate(progress, [0, 1], [0.9, 1]);
  } else if (frame >= endFrame) {
    opacity = 1;
    scale = 1;
  }

  const variantClass = {
    default:
      "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700",
    primary:
      "bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700",
    success:
      "bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700",
    warning:
      "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700",
    error: "bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700",
  };

  return (
    <div
      className={`rounded-lg p-6 border-2 ${variantClass[variant]}`}
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        {icon && <div className="text-3xl">{icon}</div>}
        {trend && (
          <span
            className={`text-sm font-semibold ${trend.direction === "up" ? "text-green-600" : "text-red-600"}`}
          >
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
          </span>
        )}
      </div>
      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">
        {label}
      </p>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
};
