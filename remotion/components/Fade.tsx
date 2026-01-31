import { interpolate, useCurrentFrame } from "remotion";

interface FadeProps {
  from?: number;
  duration: number;
  direction?: "in" | "out";
  children: React.ReactNode;
}

export const Fade: React.FC<FadeProps> = ({
  from = 0,
  duration,
  direction = "in",
  children,
}) => {
  const frame = useCurrentFrame();
  const endFrame = from + duration;

  let opacity = direction === "in" ? 0 : 1;

  if (frame >= from && frame < endFrame) {
    const progress = interpolate(frame, [from, endFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    opacity = direction === "in" ? progress : 1 - progress;
  } else if (frame >= endFrame && direction === "in") {
    opacity = 1;
  } else if (frame >= endFrame && direction === "out") {
    opacity = 0;
  }

  return (
    <div
      style={{
        opacity,
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
};
