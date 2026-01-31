import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface MyCompositionProps {
  titleText: string;
  titleColor: string;
}

export const MyComposition: React.FC<MyCompositionProps> = ({
  titleText,
  titleColor,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = interpolate(frame, [0, 30], [0.5, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          fontSize: 80,
          fontWeight: "bold",
          color: titleColor,
          textAlign: "center",
        }}
      >
        {titleText}
      </div>
    </AbsoluteFill>
  );
};
