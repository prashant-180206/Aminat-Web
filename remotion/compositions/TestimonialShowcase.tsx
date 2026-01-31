import { AbsoluteFill } from "remotion";
import {
  Card,
  Container,
  Stack,
  Heading,
  Text,
  Avatar,
  Divider,
  GradientBackground,
  Fade,
} from "../components";

interface TestimonialShowcaseProps {
  title?: string;
}

export const TestimonialShowcase: React.FC<TestimonialShowcaseProps> = ({
  title = "What Creators Say",
}) => {
  const testimonials = [
    {
      quote:
        "Animat transformed how I create videos. It's incredibly powerful yet simple to use.",
      author: "Sarah Chen",
      role: "Content Creator",
      initials: "SC",
    },
    {
      quote:
        "The component system is a game-changer for rapid video production.",
      author: "Marcus Johnson",
      role: "Video Editor",
      initials: "MJ",
    },
    {
      quote:
        "Best investment for my production workflow. Saved me hundreds of hours.",
      author: "Emma Rodriguez",
      role: "Motion Designer",
      initials: "ER",
    },
  ];

  return (
    <GradientBackground from="#1e293b" to="#0f172a">
      <AbsoluteFill className="flex flex-col items-center justify-center p-12">
        <Container maxWidth="2xl" className="w-full">
          <Fade from={0} duration={60} direction="in">
            <div className="text-center mb-16">
              <Heading
                level={1}
                delay={0}
                duration={60}
                animation="slideIn"
                className="text-white"
              >
                {title}
              </Heading>
              <Text size="lg" color="muted" delay={30} duration={60}>
                Join thousands of satisfied creators
              </Text>
            </div>
          </Fade>

          <div className="grid grid-cols-1 gap-8">
            {testimonials.map((testimonial, index) => (
              <Fade
                key={index}
                from={60 + index * 30}
                duration={60}
                direction="in"
              >
                <Card
                  variant="outlined"
                  delay={60 + index * 30}
                  duration={60}
                  className="p-8"
                >
                  <Stack direction="vertical" spacing="md">
                    <Text size="lg" className="italic text-slate-200">
                      &quot;{testimonial.quote}&quot;
                    </Text>

                    <Divider orientation="horizontal" color="muted" />

                    <Stack direction="horizontal" spacing="md" align="center">
                      <Avatar
                        initials={testimonial.initials}
                        size="md"
                        delay={90 + index * 30}
                        duration={60}
                      />
                      <div>
                        <Heading level={4} className="text-white m-0">
                          {testimonial.author}
                        </Heading>
                        <Text size="sm" color="muted" className="m-0">
                          {testimonial.role}
                        </Text>
                      </div>
                    </Stack>
                  </Stack>
                </Card>
              </Fade>
            ))}
          </div>
        </Container>
      </AbsoluteFill>
    </GradientBackground>
  );
};
