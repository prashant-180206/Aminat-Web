import { AbsoluteFill } from "remotion";
import {
  Card,
  Container,
  Grid,
  Heading,
  Text,
  Badge,
  StatBox,
  GradientBackground,
  Fade,
} from "../components";

interface StatsShowcaseProps {
  title?: string;
}

export const StatsShowcase: React.FC<StatsShowcaseProps> = ({
  title = "Platform Statistics",
}) => {
  const stats = [
    {
      label: "Total Users",
      value: "25.5K",
      icon: "👥",
      trend: { value: 12, direction: "up" as const },
    },
    {
      label: "Revenue",
      value: "$125K",
      icon: "💰",
      trend: { value: 8, direction: "up" as const },
    },
    {
      label: "Projects",
      value: "3.2K",
      icon: "📊",
      trend: { value: 5, direction: "up" as const },
    },
    {
      label: "Uptime",
      value: "99.9%",
      icon: "⚡",
      trend: { value: 0.1, direction: "down" as const },
    },
  ];

  return (
    <GradientBackground from="#0f172a" to="#1e293b">
      <AbsoluteFill className="flex flex-col items-center justify-center p-12">
        <Container maxWidth="2xl" className="w-full">
          <Fade from={0} duration={60} direction="in">
            <div className="text-center mb-16">
              <Heading level={1} delay={0} duration={60} animation="slideIn">
                {title}
              </Heading>
              <Text size="lg" color="muted" delay={30} duration={60}>
                Real-time metrics and performance indicators
              </Text>
            </div>
          </Fade>

          <Grid columns={2} gap="lg" className="w-full">
            {stats.map((stat, index) => (
              <Fade
                key={index}
                from={60 + index * 20}
                duration={60}
                direction="in"
              >
                <StatBox
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  trend={stat.trend}
                  variant="primary"
                  delay={60 + index * 20}
                  duration={60}
                />
              </Fade>
            ))}
          </Grid>
        </Container>
      </AbsoluteFill>
    </GradientBackground>
  );
};
