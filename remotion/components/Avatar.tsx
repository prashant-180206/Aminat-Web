import { interpolate, useCurrentFrame } from "remotion";

interface AvatarProps {
  src?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "circle" | "rounded";
  delay?: number;
  duration?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  initials = "US",
  size = "md",
  variant = "circle",
  delay = 0,
  duration = 30,
  className = "",
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
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-20 h-20 text-lg",
  };

  const variantClass = {
    circle: "rounded-full",
    rounded: "rounded-lg",
  };

  return (
    <div
      className={`flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 text-white font-bold ${sizeClass[size]} ${variantClass[variant]} ${className}`}
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        backgroundImage: src ? `url(${src})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!src && initials}
    </div>
  );
};
