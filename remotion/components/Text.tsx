import { interpolate, useCurrentFrame } from "remotion";

interface TextProps {
  children: React.ReactNode;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "black";
  color?: "default" | "muted" | "primary" | "success" | "warning" | "error";
  align?: "left" | "center" | "right" | "justify";
  className?: string;
  delay?: number;
  duration?: number;
}

export const Text: React.FC<TextProps> = ({
  children,
  size = "base",
  weight = "normal",
  color = "default",
  align = "left",
  className = "",
  delay = 0,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const startFrame = delay;
  const endFrame = delay + duration;

  let opacity = 0;

  if (frame >= startFrame && frame < endFrame) {
    opacity = interpolate(frame, [startFrame, endFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame >= endFrame) {
    opacity = 1;
  }

  const sizeClass = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };

  const weightClass = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    black: "font-black",
  };

  const colorClass = {
    default: "text-slate-900 dark:text-slate-100",
    muted: "text-slate-600 dark:text-slate-400",
    primary: "text-blue-600 dark:text-blue-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    error: "text-red-600 dark:text-red-400",
  };

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  return (
    <p
      className={`transition-opacity ${sizeClass[size]} ${weightClass[weight]} ${colorClass[color]} ${alignClass[align]} ${className}`}
      style={{
        opacity,
      }}
    >
      {children}
    </p>
  );
};
