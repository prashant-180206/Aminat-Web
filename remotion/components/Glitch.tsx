import React from "react";

interface GlitchProps {
  children: React.ReactNode;
  intensity?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const Glitch: React.FC<GlitchProps> = ({
  children,
  intensity = 2,
  color = "cyan",
  style = {},
}) => {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        ...style,
      }}
    >
      {/* Original */}
      <div>{children}</div>

      {/* Glitch effect overlays */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          color,
          opacity: 0.8,
          textShadow: `${intensity}px 0 ${color}, -${intensity}px 0 red`,
          animation: "glitch 0.3s infinite",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes glitch {
          0% {
            transform: translateX(0);
            opacity: 0.8;
          }
          50% {
            transform: translateX(${intensity}px);
            opacity: 0.6;
          }
          100% {
            transform: translateX(-${intensity}px);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};
