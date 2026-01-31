import { interpolate, useCurrentFrame } from "remotion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined" | "gradient";
  delay?: number;
  duration?: number;
  animateIn?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  delay = 0,
  duration = 30,
  animateIn = true,
}) => {
  const frame = useCurrentFrame();
  const startFrame = delay;
  const endFrame = delay + duration;

  let opacity = 1;
  let scale = 1;

  if (animateIn) {
    if (frame < startFrame) {
      opacity = 0;
      scale = 0.9;
    } else if (frame < endFrame) {
      const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      opacity = progress;
      scale = interpolate(progress, [0, 1], [0.9, 1]);
    }
  }

  const baseClass =
    "rounded-lg overflow-hidden transition-all duration-200 ease-out";
  const variantClass = {
    default: "bg-white dark:bg-slate-900 shadow-md",
    elevated:
      "bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700",
    outlined:
      "bg-transparent border-2 border-slate-300 dark:border-slate-600 backdrop-blur-sm",
    gradient:
      "bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl text-white",
  };

  return (
    <div
      className={`${baseClass} ${variantClass[variant]} ${className}`}
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      {children}
    </div>
  );
};
