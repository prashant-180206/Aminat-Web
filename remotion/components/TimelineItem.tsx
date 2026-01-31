import { interpolate, useCurrentFrame } from "remotion";

interface TimelineItemProps {
  title: string;
  description?: string;
  variant?: "completed" | "active" | "pending";
  index?: number;
  delay?: number;
  duration?: number;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  description,
  variant = "pending",
  index = 0,
  delay = 0,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const startFrame = delay;
  const endFrame = delay + duration;

  let opacity = 0;
  let translateX = -20;

  if (frame >= startFrame && frame < endFrame) {
    const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    opacity = progress;
    translateX = interpolate(progress, [0, 1], [-20, 0]);
  } else if (frame >= endFrame) {
    opacity = 1;
    translateX = 0;
  }

  const variantClass = {
    completed: "bg-green-500 text-white",
    active: "bg-blue-500 text-white ring-4 ring-blue-200",
    pending: "bg-slate-300 text-slate-900 dark:bg-slate-600",
  };

  const dotClass = {
    completed: "border-green-500",
    active: "border-blue-500",
    pending: "border-slate-300 dark:border-slate-600",
  };

  return (
    <div
      className="flex gap-4 relative"
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 ${variantClass[variant]}`}
        >
          {index + 1}
        </div>
        {index < 2 && (
          <div className={`w-1 h-16 border-l-2 ${dotClass[variant]}`} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 py-2">
        <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
          {title}
        </h3>
        {description && (
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
