import { AbsoluteFill } from "remotion";
import { TextAnimation, Background, Sequence, Fade } from "../components";

interface ProfessionalIntroProps {
  title: string;
  subtitle: string;
  accentColor: string;
}

export const ProfessionalIntro: React.FC<ProfessionalIntroProps> = ({
  title,
  subtitle,
  accentColor,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* Animated background accent */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}40, transparent)`,
          top: "-100px",
          right: "-100px",
          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}30, transparent)`,
          bottom: "-50px",
          left: "-50px",
          filter: "blur(80px)",
        }}
      />

      {/* Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <Fade from={0} duration={30} direction="in">
          <TextAnimation
            delay={0}
            duration={60}
            animationType="scale"
            fontSize={96}
            fontWeight={900}
            color="#ffffff"
            fontFamily='"Inter", sans-serif'
            style={{
              letterSpacing: "-2px",
              marginBottom: "20px",
              textShadow: `0 10px 40px ${accentColor}40`,
            }}
          >
            {title}
          </TextAnimation>
        </Fade>

        <Fade from={30} duration={30} direction="in">
          <TextAnimation
            delay={30}
            duration={60}
            animationType="slideIn"
            fontSize={48}
            color={accentColor}
            fontFamily='"Inter", sans-serif'
            style={{
              fontWeight: 500,
              letterSpacing: "1px",
            }}
          >
            {subtitle}
          </TextAnimation>
        </Fade>

        {/* Accent line */}
        <Fade from={60} duration={20} direction="in">
          <div
            style={{
              marginTop: "40px",
              width: "200px",
              height: "4px",
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            }}
          />
        </Fade>
      </AbsoluteFill>

      {/* Bottom accent bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
