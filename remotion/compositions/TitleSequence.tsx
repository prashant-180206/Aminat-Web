import { AbsoluteFill } from "remotion";
import { TextAnimation, Fade, Shape } from "../components";

interface TitleSequenceProps {
  mainTitle: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
}

export const TitleSequence: React.FC<TitleSequenceProps> = ({
  mainTitle,
  subtitle,
  backgroundColor,
  textColor,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Decorative shapes */}
      <Shape
        type="circle"
        size={200}
        color={textColor}
        x={100}
        y={100}
        delay={0}
        duration={60}
        animate={true}
        style={{ opacity: 0.1 }}
      />

      <Shape
        type="circle"
        size={150}
        color={textColor}
        x={1650}
        y={850}
        delay={20}
        duration={60}
        animate={true}
        style={{ opacity: 0.1 }}
      />

      {/* Main content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px",
        }}
      >
        <Fade from={0} duration={40} direction="in">
          <TextAnimation
            delay={0}
            duration={60}
            animationType="bounce"
            fontSize={80}
            fontWeight={900}
            color={textColor}
            fontFamily='"Segoe UI", sans-serif'
            style={{
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            {mainTitle}
          </TextAnimation>
        </Fade>

        <Fade from={40} duration={40} direction="in">
          <TextAnimation
            delay={40}
            duration={60}
            animationType="slideIn"
            fontSize={44}
            fontWeight={500}
            color={textColor}
            fontFamily='"Segoe UI", sans-serif'
            style={{
              opacity: 0.7,
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            {subtitle}
          </TextAnimation>
        </Fade>

        {/* Animated underline */}
        <Fade from={100} duration={30} direction="in">
          <div
            style={{
              marginTop: "40px",
              width: "100px",
              height: "6px",
              backgroundColor: textColor,
              borderRadius: "3px",
            }}
          />
        </Fade>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
