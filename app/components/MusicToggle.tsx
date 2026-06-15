"use client";
import { useState, useRef, useEffect } from "react";

// Free meditation music - using a public domain source
const MUSIC_URL = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3";

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = "none";
    audioRef.current = audio;
    setLoaded(true);
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <button onClick={toggle} title={playing ? "关闭音乐" : "开启禅修音乐"}
      className={`relative inline-flex size-9 items-center justify-center rounded-full border transition-all duration-fast ${
        playing 
          ? "border-gold/50 text-gold bg-gold/10" 
          : "border-gold/25 text-paper-dark hover:border-gold/40 hover:text-gold"
      }`}>
      {playing ? (
        <span className="flex gap-0.5">
          <span className="w-0.5 h-3 bg-gold rounded-full animate-pulse" />
          <span className="w-0.5 h-4 bg-gold rounded-full animate-pulse" style={{animationDelay:'0.15s'}} />
          <span className="w-0.5 h-2 bg-gold rounded-full animate-pulse" style={{animationDelay:'0.3s'}} />
        </span>
      ) : (
        <span className="text-sm">🎵</span>
      )}
    </button>
  );
}
