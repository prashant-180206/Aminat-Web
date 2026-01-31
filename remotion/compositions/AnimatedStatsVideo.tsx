import { AbsoluteFill } from "remotion";
import { AnimatedCounter, TextAnimation, Fade } from "../components";

interface AnimatedStatsVideoProps {
  backgroundColor: string;
  accentColor: string;
}

export const AnimatedStatsVideo: React.FC<AnimatedStatsVideoProps> = ({
  backgroundColor,
  accentColor,
}) => {
  const stats = [
    { label: "Videos Created", value: 10000, prefix: "" },
    { label: "Active Users", value: 50000, prefix: "" },
    { label: "Export Hours", value: 25000, prefix: "" },
    { label: "Satisfaction", value: 98, suffix: "%" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Animated gradient background */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${accentColor}10 0%, transparent 50%, ${accentColor}10 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <Fade from={0} duration={60} direction="in">
        <TextAnimation
          delay={0}
          duration={60}
          animationType="slideIn"
          fontSize={72}
          fontWeight={900}
          color="#ffffff"
          fontFamily='"Inter", sans-serif'
          style={{
            position: "absolute",
            top: "60px",
            left: "60px",
            right: "60px",
            letterSpacing: "-1px",
          }}
        >
          Animat by the Numbers
        </TextAnimation>
      </Fade>

      {/* Stats Grid */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          padding: "200px 60px 60px 60px",
          gap: "40px",
        }}
      >
        {stats.map((stat, index) => (
          <Fade key={index} from={60 + index * 30} duration={60} direction="in">
            <div
              style={{
                width: "calc(50% - 20px)",
                padding: "40px",
                borderRadius: "12px",
                background: `${accentColor}15`,
                border: `2px solid ${accentColor}40`,
                textAlign: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <AnimatedCounter
                from={0}
                to={stat.value}
                delay={90 + index * 30}
                duration={120}
                fontSize={56}
                fontWeight={700}
                color={accentColor}
                prefix={stat.prefix}
                suffix={stat.suffix}
                decimalPlaces={0}
                style={{
                  fontFamily: '"Inter", sans-serif',
                  marginBottom: "15px",
                }}
              />
              <TextAnimation
                delay={90 + index * 30}
                duration={120}
                animationType="fadeIn"
                fontSize={24}
                color="#ffffff"
                fontFamily='"Inter", sans-serif'
              >
                {stat.label}
              </TextAnimation>
            </div>
          </Fade>
        ))}
      </AbsoluteFill>

      {/* Footer */}
      <Fade from={300} duration={60} direction="in">
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: 0,
            right: 0,
            textAlign: "center",
            color: "#ffffff",
            fontSize: "18px",
            opacity: 0.6,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Join thousands of creators building amazing content with Animat
        </div>
      </Fade>
    </AbsoluteFill>
  );
};
