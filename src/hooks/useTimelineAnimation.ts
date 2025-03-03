import { useState, useEffect } from 'react';

export interface TimelineItem {
  timestamp: number;
  [key: string]: number | string; // Replace any with specific types
}

interface UseTimelineAnimationProps {
  timelineData: TimelineItem[];
  initialTime?: number;
  initialPlaybackSpeed?: number;
}

export default function useTimelineAnimation({
  timelineData,
  initialTime = 0,
  initialPlaybackSpeed = 1
}: UseTimelineAnimationProps) {
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(initialPlaybackSpeed);

  // Play/pause timeline animation
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isPlaying && timelineData.length > 0) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          const currentIndex = timelineData.findIndex(item => item.timestamp >= prevTime);
          const nextIndex = (currentIndex + 1) % timelineData.length;
          return timelineData[nextIndex].timestamp;
        });
      }, 2000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timelineData, playbackSpeed]);

  return {
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed
  };
}
