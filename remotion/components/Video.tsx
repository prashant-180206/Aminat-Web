import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface VideoProps {
  src: string;
  from?: number;
  duration?: number;
  volume?: number;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  muted?: boolean;
}

export const Video: React.FC<VideoProps> = ({
  src,
  from = 0,
  duration,
  volume = 1,
  width = "100%",
  height = "auto",
  style = {},
  muted = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = (frame - from) / fps;
      videoRef.current.volume = volume;
    }
  }, [frame, fps, from, volume]);

  return (
    <video
      ref={videoRef}
      src={src}
      style={{
        width,
        height,
        display: "block",
        ...style,
      }}
      muted={muted}
    />
  );
};

export default Video;
