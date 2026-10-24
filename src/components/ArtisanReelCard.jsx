"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, ExternalLink, Sparkles } from "lucide-react";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

export default function ArtisanReelCard({ reel, index }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Ensure the video first frame is decoded and painted while remaining paused
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleInitialFrame = () => {
      if (video.paused && video.currentTime === 0) {
        try {
          video.currentTime = 0.05;
        } catch (_) {}
      }
    };

    if (video.readyState >= 2) {
      handleInitialFrame();
    } else {
      video.addEventListener("loadeddata", handleInitialFrame);
    }

    // Pause video if it scrolls out of viewport (do NOT autoplay on enter)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(video);

    return () => {
      video.removeEventListener("loadeddata", handleInitialFrame);
      observer.disconnect();
    };
  }, []);

  // Update progress bar
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    setHasInteracted(true);
    if (video.paused) {
      video.play().then(() => setIsPlaying(true));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    setHasInteracted(true);
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div
      className="group relative flex-shrink-0 w-[82vw] sm:w-[320px] lg:w-auto aspect-[9/16] bg-[#141E17] border border-[#EAE3D6] hover:border-[#C29B5D] rounded-[2px] overflow-hidden shadow-[0_4px_24px_rgba(20,30,23,0.06)] hover:shadow-[0_20px_50px_rgba(20,30,23,0.22)] transition-all duration-500 snap-center select-none cursor-pointer"
      onClick={togglePlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ─── Native HTML5 Video Element (Paused by default) ─── */}
      <video
        ref={videoRef}
        src={reel.videoSrc}
        poster={reel.poster}
        preload="metadata"
        playsInline
        loop
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* ─── Ambient Cinematic Gradients ─── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />

      {/* ─── Top Editorial Metadata Bar ─── */}
      <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-[0.2em] font-mono text-[#E4C590] rounded-[2px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C29B5D] animate-pulse" />
          <span>{reel.category}</span>
        </span>

        {/* Audio Mute/Unmute Toggle */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          className="pointer-events-auto w-8 h-8 rounded-[2px] bg-black/60 hover:bg-[#C29B5D] text-white hover:text-[#0D140F] backdrop-blur-md border border-white/15 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* ─── Center Play / Pause Indicator (shows prominent Play button when paused) ─── */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 z-10 ${
          !isPlaying ? "opacity-100 scale-100" : isHovered ? "opacity-90 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <div className={`w-14 h-14 rounded-full backdrop-blur-md border flex items-center justify-center shadow-2xl transition-all duration-300 ${
          !isPlaying
            ? "bg-black/60 border-white/30 text-white group-hover:bg-[#C29B5D] group-hover:text-[#0D140F] group-hover:border-[#C29B5D] group-hover:scale-110"
            : "bg-black/50 border-white/20 text-white"
        }`}>
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-1" />
          )}
        </div>
      </div>

      {/* ─── Bottom Editorial Caption & Location Overlay ─── */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 flex flex-col justify-end text-white pointer-events-none">
        {/* Geographic Origin Lineage */}
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-[#E4C590] mb-1.5">
          <Sparkles className="w-3 h-3 text-[#C29B5D]" />
          <span>{reel.location}</span>
        </div>

        {/* Reel Title in Editorial Serif */}
        <h3
          className="text-base sm:text-lg font-normal leading-snug text-white mb-2 line-clamp-2 drop-shadow-sm"
          style={{ fontFamily: serif }}
        >
          {reel.title}
        </h3>

        {/* Description / Story Snippet */}
        <p className="text-[11px] text-white/80 font-light leading-relaxed line-clamp-2 mb-3">
          {reel.description}
        </p>

        {/* Footer Row: Progress bar & Direct IG link */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/15 pointer-events-auto">
          {/* Subtle Video Progress Bar */}
          <div className="flex-1 h-[2px] bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C29B5D] transition-all duration-150 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* External Reel Link */}
          <a
            href={reel.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[9px] uppercase font-mono tracking-widest text-white/80 hover:text-[#C29B5D] transition-colors py-1 px-1.5 rounded-[2px]"
            title="Watch full documentary on Instagram"
          >
            <span>Instagram</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
