import { interpolate, useCurrentFrame } from "remotion";

interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = 3,
  gap = "md",
  className = "",
}) => {
  const columnClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    6: "grid-cols-6",
  };

  const gapClass = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <div
      className={`grid ${columnClass[columns]} ${gapClass[gap]} ${className}`}
    >
      {children}
    </div>
  );
};
