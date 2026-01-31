import { AbsoluteFill } from "remotion";
import {
  Card,
  Container,
  Stack,
  Heading,
  Text,
  Badge,
  Button,
  GradientBackground,
  Fade,
  Divider,
} from "../components";

interface FeatureShowcaseProps {
  title?: string;
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  title = "Key Features",
}) => {
  const features = [
    {
      title: "Lightning Fast",
      description: "Optimized rendering engine for smooth performance",
      badge: "Performance",
    },
    {
      title: "Easy to Use",
      description: "Intuitive interface designed for creators",
      badge: "UX",
    },
    {
      title: "Fully Customizable",
      description: "Tailwind-powered components for complete control",
      badge: "Flexibility",
    },
    {
      title: "Production Ready",
      description: "Enterprise-grade video composition and export",
      badge: "Quality",
    },
  ];

  return (
    <GradientBackground from="#ffffff" to="#f1f5f9">
      <AbsoluteFill className="flex flex-col items-center justify-center p-12">
        <Container maxWidth="2xl" className="w-full">
          <Fade from={0} duration={60} direction="in">
            <div className="text-center mb-16">
              <Heading level={1} delay={0} duration={60} animation="slideIn">
                {title}
              </Heading>
              <Text size="lg" color="muted" delay={30} duration={60}>
                Everything you need for professional video creation
              </Text>
            </div>
          </Fade>

          <Stack direction="vertical" spacing="lg" className="w-full">
            {features.map((feature, index) => (
              <Fade
                key={index}
                from={60 + index * 30}
                duration={60}
                direction="in"
              >
                <Card
                  variant="elevated"
                  delay={60 + index * 30}
                  duration={60}
                  className="p-6"
                >
                  <Stack direction="horizontal" spacing="md" align="start">
                    <div>
                      <Badge
                        variant="info"
                        size="sm"
                        delay={60 + index * 30}
                        duration={60}
                      >
                        {feature.badge}
                      </Badge>
                      <Heading level={3} delay={90 + index * 30} duration={60}>
                        {feature.title}
                      </Heading>
                      <Text
                        size="base"
                        color="muted"
                        delay={120 + index * 30}
                        duration={60}
                      >
                        {feature.description}
                      </Text>
                    </div>
                  </Stack>
                </Card>
              </Fade>
            ))}
          </Stack>

          <Divider className="my-12" delay={300} duration={30} />

          <Fade from={330} duration={60} direction="in">
            <div className="text-center">
              <Button
                variant="primary"
                size="lg"
                className="mb-4"
                delay={330}
                duration={60}
              >
                Get Started Today
              </Button>
            </div>
          </Fade>
        </Container>
      </AbsoluteFill>
    </GradientBackground>
  );
};
