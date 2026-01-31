import { interpolate, useCurrentFrame } from "remotion";

interface AlertProps {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = "info",
  title,
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

  const variantClass = {
    info: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    success:
      "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
    warning:
      "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
    error:
      "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
  };

  return (
    <div
      className={`rounded-lg p-4 ${variantClass[variant]} ${className}`}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {title && <div className="font-semibold mb-2">{title}</div>}
      <div>{children}</div>
    </div>
  );
};
