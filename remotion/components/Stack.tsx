import { interpolate, useCurrentFrame } from "remotion";

interface StackProps {
  children: React.ReactNode;
  direction?: "horizontal" | "vertical";
  spacing?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end";
  justify?: "start" | "center" | "between" | "end";
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = "vertical",
  spacing = "md",
  align = "center",
  justify = "start",
  className = "",
}) => {
  const directionClass = direction === "horizontal" ? "flex-row" : "flex-col";

  const spacingClass = {
    xs: direction === "horizontal" ? "space-x-1" : "space-y-1",
    sm: direction === "horizontal" ? "space-x-2" : "space-y-2",
    md: direction === "horizontal" ? "space-x-4" : "space-y-4",
    lg: direction === "horizontal" ? "space-x-6" : "space-y-6",
    xl: direction === "horizontal" ? "space-x-8" : "space-y-8",
  };

  const alignClass = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
  };

  const justifyClass = {
    start: "justify-start",
    center: "justify-center",
    between: "justify-between",
    end: "justify-end",
  };

  return (
    <div
      className={`flex ${directionClass} ${spacingClass[spacing]} ${alignClass[align]} ${justifyClass[justify]} ${className}`}
    >
      {children}
    </div>
  );
};
