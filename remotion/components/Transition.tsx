import { interpolate, useCurrentFrame } from "remotion";

interface TransitionProps {
  type: "fade" | "slideLeft" | "slideRight" | "slideUp" | "slideDown" | "zoom";
  duration: number;
  delay?: number;
  children: React.ReactNode;
}

export const Transition: React.FC<TransitionProps> = ({
  type,
  duration,
  delay = 0,
  children,
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

    switch (type) {
      case "fade":
        opacity = progress;
        break;
      case "slideLeft":
        opacity = progress;
        transform = `translateX(${interpolate(progress, [0, 1], [100, 0])}px)`;
        break;
      case "slideRight":
        opacity = progress;
        transform = `translateX(${interpolate(progress, [0, 1], [-100, 0])}px)`;
        break;
      case "slideUp":
        opacity = progress;
        transform = `translateY(${interpolate(progress, [0, 1], [100, 0])}px)`;
        break;
      case "slideDown":
        opacity = progress;
        transform = `translateY(${interpolate(progress, [0, 1], [-100, 0])}px)`;
        break;
      case "zoom":
        opacity = progress;
        transform = `scale(${interpolate(progress, [0, 1], [0.5, 1])})`;
        break;
    }
  } else if (frame >= endFrame) {
    opacity = 1;
  }

  return (
    <div
      style={{
        opacity,
        transform,
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
};
