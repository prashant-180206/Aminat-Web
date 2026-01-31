import { interpolate, useCurrentFrame } from "remotion";

interface TabsProps {
  tabs: {
    label: string;
    content: React.ReactNode;
  }[];
  defaultTab?: number;
  variant?: "underline" | "pills" | "cards";
  delay?: number;
  duration?: number;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab = 0,
  variant = "underline",
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

  const tabButtonClass = {
    underline:
      "px-4 py-2 font-semibold border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:border-blue-500",
    pills:
      "px-6 py-2 rounded-full font-semibold bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white",
    cards:
      "px-6 py-3 rounded-lg font-semibold bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600",
  };

  const activeTabClass = {
    underline: "border-blue-500 text-blue-600 dark:text-blue-400",
    pills: "bg-blue-600 text-white",
    cards: "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
  };

  return (
    <div style={{ opacity }}>
      {/* Tab buttons */}
      <div className="flex gap-2 mb-6 border-b border-slate-300 dark:border-slate-600">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`transition-all ${tabButtonClass[variant]} ${
              index === defaultTab ? activeTabClass[variant] : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>{tabs[defaultTab]?.content}</div>
    </div>
  );
};
