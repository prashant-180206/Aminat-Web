import { interpolate, useCurrentFrame } from "remotion";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  delay?: number;
  duration?: number;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  delay = 0,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const startFrame = delay;
  const endFrame = delay + duration;

  let opacity = 0;
  let translateY = 10;

  if (frame >= startFrame && frame < endFrame) {
    const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    opacity = progress;
    translateY = interpolate(progress, [0, 1], [10, 0]);
  } else if (frame >= endFrame) {
    opacity = 1;
    translateY = 0;
  }

  const sizeClass = {
    sm: "px-3 py-1.5 text-sm font-medium rounded-md",
    md: "px-5 py-2.5 text-base font-semibold rounded-lg",
    lg: "px-8 py-3.5 text-lg font-bold rounded-xl",
  };

  const variantClass = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg",
    secondary:
      "bg-slate-200 hover:bg-slate-300 text-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-900",
    ghost:
      "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg",
  };

  return (
    <button
      className={`inline-block transition-all duration-200 active:scale-95 ${sizeClass[size]} ${variantClass[variant]} ${className}`}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {children}
    </button>
  );
};
