import { Sequence as RemotionSequence } from "remotion";

interface SequenceProps {
  from: number;
  duration: number;
  layout?: "absolute-fill" | "none";
  children: React.ReactNode;
}

export const Sequence: React.FC<SequenceProps> = ({
  from,
  duration,
  layout = "none",
  children,
}) => {
  return (
    <RemotionSequence from={from} durationInFrames={duration} layout={layout}>
      {children}
    </RemotionSequence>
  );
};
