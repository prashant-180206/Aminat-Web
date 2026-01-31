import { interpolate, useCurrentFrame } from "remotion";

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  centered?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = "lg",
  padding = "md",
  className = "",
  centered = true,
}) => {
  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  const paddingClass = {
    xs: "px-2 py-2",
    sm: "px-4 py-4",
    md: "px-6 py-6",
    lg: "px-8 py-8",
    xl: "px-12 py-12",
  };

  return (
    <div
      className={`w-full ${paddingClass[padding]} ${maxWidthClass[maxWidth]} ${centered ? "mx-auto" : ""} ${className}`}
    >
      {children}
    </div>
  );
};
