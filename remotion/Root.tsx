import { Composition } from "remotion";
import { MyComposition } from "./compositions/MyComposition";
import { ProfessionalIntro } from "./compositions/ProfessionalIntro";
import { TitleSequence } from "./compositions/TitleSequence";
import { AnimatedStatsVideo } from "./compositions/AnimatedStatsVideo";
import { StatsShowcase } from "./compositions/StatsShowcase";
import { FeatureShowcase } from "./compositions/FeatureShowcase";
import { TestimonialShowcase } from "./compositions/TestimonialShowcase";
import { ProcessShowcase } from "./compositions/ProcessShowcase";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComposition"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={MyComposition as any}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: "Welcome to Animat",
          titleColor: "#000000",
        }}
      />

      <Composition
        id="ProfessionalIntro"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={ProfessionalIntro as any}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Animat",
          subtitle: "Professional Video Creation",
          accentColor: "#3b82f6",
        }}
      />

      <Composition
        id="TitleSequence"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={TitleSequence as any}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          mainTitle: "Create Amazing Videos",
          subtitle: "With Remotion Components",
          backgroundColor: "#ffffff",
          textColor: "#000000",
        }}
      />

      <Composition
        id="AnimatedStats"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={AnimatedStatsVideo as any}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          backgroundColor: "#0f172a",
          accentColor: "#3b82f6",
        }}
      />

      <Composition
        id="StatsShowcase"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={StatsShowcase as any}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Platform Statistics",
        }}
      />

      <Composition
        id="FeatureShowcase"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={FeatureShowcase as any}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Key Features",
        }}
      />

      <Composition
        id="TestimonialShowcase"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={TestimonialShowcase as any}
        durationInFrames={420}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "What Creators Say",
        }}
      />

      <Composition
        id="ProcessShowcase"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={ProcessShowcase as any}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "How It Works",
        }}
      />
    </>
  );
};
