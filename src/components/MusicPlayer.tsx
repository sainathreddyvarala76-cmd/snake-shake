import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const TRACKS = [
  {
    id: 1,
    title: "Neon Horizon (AI Generate_v1)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12",
  },
  {
    id: 2,
    title: "Cybernetic Pulse (AI Generate_v2)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05",
  },
  {
    id: 3,
    title: "Digital Dreamscape (AI Generate_v3)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44",
  },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-fuchsia-500/30 rounded-xl p-6 shadow-[0_0_15px_rgba(217,70,239,0.15)] flex flex-col w-full max-w-sm" id="music-player">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-fuchsia-500/20 p-2 rounded-lg border border-fuchsia-500/50">
            <Music className="w-5 h-5 text-fuchsia-400" />
          </div>
          <div>
            <h3 className="text-slate-200 font-medium text-sm tracking-wide">
              {currentTrack.title}
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">Automated Playlist</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden relative">
        <div 
          className="h-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={toggleMute}
          className="text-slate-400 hover:text-fuchsia-400 transition-colors"
          title="Toggle Mute"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={skipBackward}
            className="text-slate-300 hover:text-fuchsia-400 transition-colors bg-slate-800 p-2 rounded-full hover:bg-slate-800/80"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-900 p-3 rounded-full transition-all shadow-[0_0_15px_rgba(217,70,239,0.5)] hover:shadow-[0_0_25px_rgba(217,70,239,0.8)]"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current" />
            )}
          </button>
          
          <button 
            onClick={skipForward}
            className="text-slate-300 hover:text-fuchsia-400 transition-colors bg-slate-800 p-2 rounded-full hover:bg-slate-800/80"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Placeholder for layout balance */}
        <div className="w-5" /> 
      </div>
    </div>
  );
}
