import { interpolate, useCurrentFrame } from "remotion";

interface PillProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  delay?: number;
  duration?: number;
}

export const Pill: React.FC<PillProps> = ({
  children,
  icon,
  className = "",
  variant = "primary",
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

  const variantClass = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-slate-300 text-slate-900 dark:bg-slate-700 dark:text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    danger: "bg-red-500 text-white",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${variantClass[variant]} ${className}`}
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
