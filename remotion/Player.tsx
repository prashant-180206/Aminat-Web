import { Player } from "@remotion/player";
import { MyComposition } from "./compositions/MyComposition";

interface RemotionPlayerProps {
  titleText?: string;
  titleColor?: string;
}

export const RemotionPlayer: React.FC<RemotionPlayerProps> = ({
  titleText = "Welcome to Animat",
  titleColor = "#000000",
}) => {
  return (
    <Player
      component={MyComposition}
      durationInFrames={150}
      compositionWidth={1920}
      compositionHeight={1080}
      fps={30}
      controls
      inputProps={{
        titleText,
        titleColor,
      }}
      style={{
        width: "100%",
        maxWidth: "100%",
      }}
    />
  );
};
