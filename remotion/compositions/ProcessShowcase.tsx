import { AbsoluteFill } from "remotion";
import {
  Card,
  Container,
  Stack,
  Heading,
  Text,
  TimelineItem,
  GradientBackground,
  Fade,
} from "../components";

interface ProcessShowcaseProps {
  title?: string;
}

export const ProcessShowcase: React.FC<ProcessShowcaseProps> = ({
  title = "How It Works",
}) => {
  const steps = [
    {
      title: "Create Project",
      description: "Start with a blank canvas or choose from templates",
    },
    {
      title: "Add Components",
      description: "Drag and drop Tailwind-powered components",
    },
    {
      title: "Customize Design",
      description: "Use Tailwind classes for perfect styling",
    },
    {
      title: "Export Video",
      description: "Render to MP4 or any supported format",
    },
  ];

  return (
    <GradientBackground from="#f8fafc" to="#f1f5f9">
      <AbsoluteFill className="flex flex-col items-center justify-center p-12">
        <Container maxWidth="xl" className="w-full">
          <Fade from={0} duration={60} direction="in">
            <div className="text-center mb-16">
              <Heading level={1} delay={0} duration={60} animation="slideIn">
                {title}
              </Heading>
              <Text size="lg" color="muted" delay={30} duration={60}>
                Simple steps to create amazing videos
              </Text>
            </div>
          </Fade>

          <Stack
            direction="vertical"
            spacing="lg"
            className="w-full max-w-2xl mx-auto"
          >
            {steps.map((step, index) => (
              <Fade
                key={index}
                from={60 + index * 30}
                duration={60}
                direction="in"
              >
                <Card
                  variant="default"
                  delay={60 + index * 30}
                  duration={60}
                  className="p-6"
                >
                  <TimelineItem
                    title={step.title}
                    description={step.description}
                    variant={
                      index === 0
                        ? "active"
                        : index < 1
                          ? "completed"
                          : "pending"
                    }
                    index={index}
                    delay={60 + index * 30}
                    duration={60}
                  />
                </Card>
              </Fade>
            ))}
          </Stack>
        </Container>
      </AbsoluteFill>
    </GradientBackground>
  );
};
