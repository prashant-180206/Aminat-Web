import { interpolate, useCurrentFrame } from "remotion";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  theme?: "dark" | "light";
  delay?: number;
  duration?: number;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "javascript",
  showLineNumbers = true,
  theme = "dark",
  delay = 0,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const startFrame = delay;
  const endFrame = delay + duration;

  let opacity = 0;
  let scale = 0.95;

  if (frame >= startFrame && frame < endFrame) {
    const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    opacity = progress;
    scale = interpolate(progress, [0, 1], [0.95, 1]);
  } else if (frame >= endFrame) {
    opacity = 1;
    scale = 1;
  }

  const bgClass = theme === "dark" ? "bg-slate-900" : "bg-slate-100";
  const textClass = theme === "dark" ? "text-slate-200" : "text-slate-900";

  return (
    <div
      className={`${bgClass} rounded-lg p-4 overflow-x-auto font-mono text-sm`}
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      <pre className={`${textClass}`}>
        {code.split("\n").map((line, index) => (
          <div key={index} className="flex gap-4">
            {showLineNumbers && (
              <span className="text-slate-500 dark:text-slate-600 w-8 text-right">
                {index + 1}
              </span>
            )}
            <span>{line}</span>
          </div>
        ))}
      </pre>
    </div>
  );
};
