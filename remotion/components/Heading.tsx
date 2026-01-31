import { interpolate, useCurrentFrame } from "remotion";

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: "fadeIn" | "slideIn" | "bounce";
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  className = "",
  delay = 0,
  duration = 30,
  animation = "fadeIn",
}) => {
  const frame = useCurrentFrame();
  const startFrame = delay;
  const endFrame = delay + duration;

  let opacity = 0;
  let transform = "translate(0, 0) scale(1)";

  if (frame >= startFrame && frame < endFrame) {
    const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    opacity = progress;

    switch (animation) {
      case "slideIn":
        transform = `translateX(${interpolate(progress, [0, 1], [-30, 0])}px)`;
        break;
      case "bounce":
        transform = `scale(${interpolate(progress, [0, 1], [0.9, 1])})`;
        break;
      case "fadeIn":
      default:
        break;
    }
  } else if (frame >= endFrame) {
    opacity = 1;
  }

  const sizeClass = {
    1: "text-5xl font-black tracking-tight",
    2: "text-4xl font-bold tracking-tight",
    3: "text-3xl font-bold",
    4: "text-2xl font-semibold",
    5: "text-xl font-semibold",
    6: "text-lg font-semibold",
  };

  const Tag = `h${level}` as const;

  return (
    <Tag
      className={`text-slate-900 dark:text-white transition-all ${sizeClass[level]} ${className}`}
      style={{
        opacity,
        transform,
      }}
    >
      {children}
    </Tag>
  );
};
