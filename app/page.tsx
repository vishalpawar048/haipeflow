"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@/app/playground/components/Icon"; // Assuming Icon is available here
import { authClient } from "@/lib/auth-client";
import { SignInModal } from "@/app/components/SignInModal";
import { BuyCreditsModal } from "@/app/components/BuyCreditsModal";

// --- Icons & Visual Helpers ---

// ... (existing icons)

const PlayIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="ml-1"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

// --- Mockup Components (CSS Art) ---

const UrlToVideoMockup = () => (
  <div className="relative overflow-hidden rounded-xl border border-black/5 bg-white shadow-2xl">
    {/* Window Controls */}
    <div className="flex items-center gap-2 border-b border-black/5 bg-gray-50/50 px-4 py-3">
      <div className="flex gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-400/20" />
        <div className="h-2.5 w-2.5 rounded-full bg-amber-400/20" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-400/20" />
      </div>
      <div className="mx-auto flex h-6 w-1/2 items-center rounded-md bg-white border border-black/5 px-2 text-[10px] text-gray-400 shadow-sm">
        haipeflow.com/service-promotion
      </div>
    </div>

    <div className="grid grid-cols-[1fr_320px] h-[500px]">
      {/* Left: Configuration Panel (Service Playground Mockup) */}
      <div className="border-r border-black/5 bg-white p-6 overflow-y-auto scrollbar-hide">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">HF</span>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">Haipe Flow</div>
            <div className="text-[10px] text-gray-500">
              Service Promotion Generator
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Service Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-1 mb-2">
              <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px] font-bold">
                1
              </div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Service Identity
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-[10px] font-medium text-gray-600">
                  Brand Name
                </div>
                <div className="h-8 w-full bg-gray-50 border border-gray-200 rounded-md px-2 flex items-center text-xs text-gray-900">
                  Apex Consulting
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-medium text-gray-600">
                  Service Type
                </div>
                <div className="h-8 w-full bg-gray-50 border border-gray-200 rounded-md px-2 flex items-center text-xs text-gray-900">
                  Marketing
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-medium text-gray-600">
                Theme Color
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-md bg-blue-600 shadow-sm border border-black/5" />
                <div className="h-8 w-24 bg-gray-50 border border-gray-200 rounded-md px-2 flex items-center text-xs text-gray-500 font-mono">
                  #2563EB
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Visual Assets */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-1 mb-2">
              <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px] font-bold">
                2
              </div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Visual Assets
              </span>
            </div>
            <div className="h-16 w-full border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center gap-1">
              <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-gray-400"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              </div>
              <span className="text-[8px] text-gray-400">
                Upload Logo (PNG/JPG)
              </span>
            </div>
          </div>

          {/* Section 3: Marketing Context */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-1 mb-2">
              <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px] font-bold">
                3
              </div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Marketing Context
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-medium text-gray-600">
                Selling Point
              </div>
              <div className="h-16 w-full bg-gray-50 border border-gray-200 rounded-md p-2 text-[10px] text-gray-500 leading-relaxed">
                We help businesses scale 10x faster with data-driven strategies.
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-[10px] font-medium text-gray-600">
                  Tone
                </div>
                <div className="h-8 w-full bg-gray-50 border border-gray-200 rounded-md px-2 flex items-center justify-between text-xs text-gray-900">
                  <span>Professional</span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-400"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-medium text-gray-600">
                  Format
                </div>
                <div className="h-8 w-full bg-gray-50 border border-gray-200 rounded-md px-2 flex items-center justify-between text-xs text-gray-900">
                  <span>9:16 Vertical</span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-400"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <div className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 text-white cursor-pointer hover:scale-[1.02] transition-transform">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
              <span className="text-xs font-bold">Generate Concepts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Video Preview */}
      <div className="relative bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="relative w-[240px] aspect-[9/16] bg-white rounded-xl shadow-xl overflow-hidden border border-black/5 group cursor-pointer">
          {/* Video Content Mock */}
          <div className="absolute inset-0 bg-gray-900">
            <video
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              className="w-full h-full object-cover opacity-80"
              muted
              loop
              autoPlay
              playsInline
            />
            {/* Overlay UI */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 flex flex-col justify-end p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                  A
                </div>
                <span className="text-xs font-semibold">Apex Consulting</span>
              </div>
              <div className="text-sm font-bold leading-tight mb-2">
                Scale your business 10x faster.
              </div>
              <div className="w-full py-2 bg-white text-black text-xs font-bold text-center rounded-md">
                Learn More
              </div>
            </div>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <PlayIcon />
            </div>
          </div>
        </div>

        {/* Floating Action Overlay (Mocking tooltips/status) */}
        <div className="absolute bottom-8 right-8 bg-white rounded-lg shadow-lg border border-black/5 p-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-600">
              Ready to export
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) => (
  <div className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
    <div className="text-sm text-gray-500 font-medium">{label}</div>
    <div className="mt-2 flex items-end justify-between">
      <div className="text-3xl font-semibold tracking-tight text-gray-900">
        {value}
      </div>
      <div className="mb-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
        {trend}
      </div>
    </div>
  </div>
);

// --- Instagram Style Video Component ---
const InstagramStyleVideo = ({
  videoSrc,
  headline,
  ctaText = "Learn More",
  brandName = "Brand",
  className,
  isMuted = true,
  onToggleAudio,
}: {
  videoSrc: string;
  headline: string;
  ctaText?: string;
  brandName?: string;
  className?: string;
  isMuted?: boolean;
  onToggleAudio?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount] = useState(() => Math.floor(Math.random() * 5000) + 1000);
  const [commentCount] = useState(() => Math.floor(Math.random() * 200) + 50);

  // Autoplay video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Auto-play prevented:", err);
          const handleInteraction = () => {
            if (videoRef.current) {
              videoRef.current.play().then(() => setIsPlaying(true));
            }
          };
          document.addEventListener("click", handleInteraction, { once: true });
          document.addEventListener("touchstart", handleInteraction, {
            once: true,
          });
        });
    }
  }, []);

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden shadow-lg ${
        className || ""
      }`}
      style={{
        aspectRatio: "9/16",
      }}
    >
      {/* Audio Toggle Button */}
      {onToggleAudio && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleAudio();
          }}
          className="absolute top-3 right-3 z-30 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          {isMuted ? (
            <Icon name="VolumeX" className="w-4 h-4" />
          ) : (
            <Icon name="Volume2" className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Instagram Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent px-3 pt-2 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {brandName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-white text-xs font-semibold">
                {brandName}
              </span>
              <span className="text-white/70 text-[10px]">•</span>
              <span className="text-white/70 text-[10px]">Sponsored</span>
            </div>
          </div>
          <div className="text-white/90">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        src={videoSrc}
        muted={isMuted}
        loop
        playsInline
        autoPlay
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Right Side Action Buttons (Instagram Style) */}
      <div className="absolute right-2 bottom-24 z-30 flex flex-col items-center gap-4">
        {/* Like Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="flex flex-col items-center gap-1 group"
        >
          {isLiked ? (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="#ff3040"
              className="drop-shadow-lg transition-transform group-active:scale-110"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              className="drop-shadow-lg transition-transform group-active:scale-110"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          <span className="text-white text-xs font-semibold drop-shadow-lg">
            {formatCount(likeCount + (isLiked ? 1 : 0))}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={(e) => e.preventDefault()}
          className="flex flex-col items-center gap-1 group"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            className="drop-shadow-lg transition-transform group-active:scale-110"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-white text-xs font-semibold drop-shadow-lg">
            {formatCount(commentCount)}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => e.preventDefault()}
          className="flex flex-col items-center gap-1 group"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            className="drop-shadow-lg transition-transform group-active:scale-110"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          <span className="text-white text-xs font-semibold drop-shadow-lg">
            Share
          </span>
        </button>

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsSaved(!isSaved);
          }}
          className="flex flex-col items-center gap-1 group"
        >
          {isSaved ? (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="white"
              className="drop-shadow-lg transition-transform group-active:scale-110"
            >
              <polygon points="19 21 12 16 5 21 5 3 19 3 19 21"></polygon>
            </svg>
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              className="drop-shadow-lg transition-transform group-active:scale-110"
            >
              <polygon points="19 21 12 16 5 21 5 3 19 3 19 21"></polygon>
            </svg>
          )}
        </button>
      </div>

      {/* Bottom Overlay with Text and CTA */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-8 pr-16">
        <h3 className="text-white font-bold text-base mb-3 leading-tight drop-shadow-lg">
          {headline}
        </h3>
        <button className="w-full bg-white text-black font-semibold text-sm py-2.5 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
          {ctaText}
        </button>
      </div>

      {/* Loading/Placeholder */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Icon name="Play" className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};

// --- TikTok Style Video Component ---
const TikTokStyleVideo = ({
  videoSrc,
  headline,
  brandName = "Brand",
  className,
  isMuted = true,
  onToggleAudio,
}: {
  videoSrc: string;
  headline: string;
  brandName?: string;
  className?: string;
  isMuted?: boolean;
  onToggleAudio?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // const [isPlaying, setIsPlaying] = useState(false); // Unused
  const [likeCount] = useState(() => Math.floor(Math.random() * 5000) + 1000);
  const [commentCount] = useState(() => Math.floor(Math.random() * 200) + 50);
  const [shareCount] = useState(() => Math.floor(Math.random() * 100) + 10);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        // .then(() => setIsPlaying(true))
        .catch((err) => console.log("Auto-play prevented:", err));
    }
  }, []);

  const formatCount = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + "k";
    return count.toString();
  };

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden shadow-lg ${
        className || ""
      }`}
      style={{ aspectRatio: "9/16" }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        muted={isMuted}
        loop
        playsInline
        autoPlay
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Audio Toggle Button */}
      {onToggleAudio && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleAudio();
          }}
          className="absolute top-4 right-4 z-30 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
        >
          {isMuted ? (
            <Icon name="VolumeX" className="w-4 h-4" />
          ) : (
            <Icon name="Volume2" className="w-4 h-4" />
          )}
        </button>
      )}

      {/* TikTok UI Elements */}
      <div className="absolute right-2 bottom-16 flex flex-col items-center gap-4 z-20">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border border-white overflow-hidden">
            <div className="w-full h-full bg-gray-300 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-[10px] font-bold">
            +
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Icon name="Heart" className="w-8 h-8 text-white fill-white/20" />
          <span className="text-white text-xs font-semibold drop-shadow-md">
            {formatCount(likeCount)}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white text-xl leading-none">...</span>
          </div>
          <span className="text-white text-xs font-semibold drop-shadow-md">
            {formatCount(commentCount)}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Icon name="Share" className="w-8 h-8 text-white" />
          <span className="text-white text-xs font-semibold drop-shadow-md">
            {formatCount(shareCount)}
          </span>
        </div>
      </div>

      <div className="absolute bottom-4 left-3 right-16 z-20 text-white">
        <div className="font-semibold mb-1 shadow-black drop-shadow-md">
          @{brandName}
        </div>
        <div className="text-xs leading-tight opacity-90 shadow-black drop-shadow-md mb-2">
          {headline} #fyp #viral #ad
        </div>
        <div className="flex items-center gap-2 opacity-80">
          <Icon name="Music" className="w-3 h-3 animate-spin" />
          <div className="text-[10px] overflow-hidden whitespace-nowrap w-24">
            Original Sound - {brandName}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Facebook Style Video Component ---
const FacebookStyleVideo = ({
  videoSrc,
  headline,
  brandName = "Brand",
  className,
  isMuted = true,
  onToggleAudio,
}: {
  videoSrc: string;
  headline: string;
  brandName?: string;
  className?: string;
  isMuted?: boolean;
  onToggleAudio?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((err) => console.log("Auto-play prevented:", err));
    }
  }, []);

  return (
    <div
      className={`relative bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 ${
        className || ""
      }`}
      style={{ aspectRatio: "9/16" }}
    >
      {/* Audio Toggle Button */}
      {onToggleAudio && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleAudio();
          }}
          className="absolute top-3 right-3 z-30 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          {isMuted ? (
            <Icon name="VolumeX" className="w-4 h-4" />
          ) : (
            <Icon name="Volume2" className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Facebook Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/40 to-transparent p-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white font-bold text-xs">
          F
        </div>
        <div className="flex-1 text-white shadow-black drop-shadow-sm">
          <div className="text-xs font-bold">{brandName}</div>
          <div className="text-[10px] opacity-90">Sponsored · 🌍</div>
        </div>
        <div className="text-white">...</div>
      </div>

      <video
        ref={videoRef}
        src={videoSrc}
        muted={isMuted}
        loop
        playsInline
        autoPlay
        className="absolute inset-0 w-full h-full object-cover bg-black"
      />

      {/* Facebook Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-3 pt-12">
        <div className="text-white text-sm font-bold mb-2 drop-shadow-md">
          {headline}
        </div>
        <div className="flex items-center justify-between bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-md">
          <span className="text-xs font-bold">Learn More</span>
          <Icon name="ChevronRight" className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

// --- Video Marquee Component ---
const VideoMarquee = () => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const videos = [
    {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      type: "tiktok",
      brand: "TrendyApp",
      text: "Wait for the end! 😲",
    },
    {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      type: "instagram",
      brand: "LuxeLife",
      text: "Experience luxury today.",
    },
    {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      type: "facebook",
      brand: "TechDaily",
      text: "The future of tech is here.",
    },
    {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      type: "tiktok",
      brand: "TravelGo",
      text: "POV: You need a vacation ✈️",
    },
    {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      type: "instagram",
      brand: "FitFam",
      text: "Join the challenge!",
    },
    {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      type: "facebook",
      brand: "AutoMoto",
      text: "Ride in style.",
    },
  ];

  return (
    <div className="w-full overflow-hidden bg-black/5 py-12">
      <div className="relative w-full">
        <div className="flex gap-6 animate-marquee whitespace-nowrap items-center">
          {[...videos, ...videos].map((video, i) => (
            <div
              key={i}
              className="inline-block h-96 w-56 flex-shrink-0 rounded-xl overflow-hidden shadow-md bg-white relative"
            >
              {video.type === "tiktok" && (
                <TikTokStyleVideo
                  videoSrc={video.src}
                  brandName={video.brand}
                  headline={video.text}
                  className="h-full w-full"
                  isMuted={playingIndex !== i}
                  onToggleAudio={() =>
                    setPlayingIndex(playingIndex === i ? null : i)
                  }
                />
              )}
              {video.type === "instagram" && (
                <InstagramStyleVideo
                  videoSrc={video.src}
                  brandName={video.brand}
                  headline={video.text}
                  className="h-full w-full"
                  isMuted={playingIndex !== i}
                  onToggleAudio={() =>
                    setPlayingIndex(playingIndex === i ? null : i)
                  }
                />
              )}
              {video.type === "facebook" && (
                <FacebookStyleVideo
                  videoSrc={video.src}
                  brandName={video.brand}
                  headline={video.text}
                  className="h-full w-full"
                  isMuted={playingIndex !== i}
                  onToggleAudio={() =>
                    setPlayingIndex(playingIndex === i ? null : i)
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Home() {
  const [activeTab, setActiveTab] = useState("analyze");
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isBuyCreditsOpen, setIsBuyCreditsOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const [credits, setCredits] = useState<number | undefined>(undefined);

  const fetchCredits = async () => {
    try {
      const res = await fetch("/api/user/credits");
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits);
      }
    } catch (e) {
      console.error("Failed to fetch credits", e);
    }
  };

  useEffect(() => {
    if (session) {
      fetchCredits();
    }
  }, [session]);

  console.log("----session", session);

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        // redirectUrl="/app-promotion/playground"
      />
      <BuyCreditsModal
        isOpen={isBuyCreditsOpen}
        onClose={() => setIsBuyCreditsOpen(false)}
      />
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-semibold text-xl tracking-tight">
            <Image
              src="/logo.png"
              alt="Haipe Flow Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            Haipe Flow
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-black transition-colors">
              Product
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Showcase
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Enterprise
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            {isPending ? (
              <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-full"></div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600 border border-slate-200">
                  {credits !== undefined
                    ? `${Math.round(credits)} Credits`
                    : "Loading..."}
                  <button
                    onClick={() => setIsBuyCreditsOpen(true)}
                    className="text-blue-600 font-bold hover:text-blue-700 transition-colors ml-1"
                  >
                    + Buy
                  </button>
                </div>
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full border border-gray-200"
                  />
                )}
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-black"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsSignInOpen(true)}
                  className="hidden sm:block text-gray-600 hover:text-black"
                >
                  Log in
                </button>
                <button
                  onClick={() => setIsSignInOpen(true)}
                  className="rounded-full bg-black px-5 py-2.5 text-white transition hover:bg-gray-800"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl space-y-8">
              <h1 className="text-5xl font-medium tracking-tight sm:text-7xl text-black">
                Turn your Ideas into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                  viral social ads.
                </span>
              </h1>
              <p className="max-w-xl text-lg text-gray-600 leading-relaxed">
                Create stunning video ads for your Mobile Apps, Products, and
                Services. Haipe Flow&apos;s AI generates high-converting content
                for Instagram, TikTok, and LinkedIn in seconds.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 w-full">
              {/* Service Promotion Card */}
              <Link
                href="/service-promotion/playground"
                className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col h-full">
                  {/* Video Preview */}
                  <div className="mb-6 w-full relative rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all">
                    <InstagramStyleVideo
                      videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                      headline="Grow Your Service Business with Video Ads"
                      ctaText="Learn More"
                      brandName="ServicePro"
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                      <Icon name="Briefcase" className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Service Promotion
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 flex-grow leading-relaxed">
                    Promote your agency, consultancy, or local service with
                    engaging video content that builds trust.
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                    Start Creating{" "}
                    <Icon name="ArrowRight" className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>

              {/* Product Promotion Card */}
              <Link
                href="/product-promotion/playground"
                className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-purple-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col h-full">
                  {/* Video Preview */}
                  <div className="mb-6 w-full relative rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all">
                    <InstagramStyleVideo
                      videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                      headline="Showcase Your Products Like Never Before"
                      ctaText="Shop Now"
                      brandName="ProductHub"
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                      <Icon name="ShoppingBag" className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Product Promotion
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 flex-grow leading-relaxed">
                    Showcase your physical or digital products with stunning
                    video ads tailored for social commerce.
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-purple-600 group-hover:gap-2 transition-all">
                    Start Creating{" "}
                    <Icon name="ArrowRight" className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>

              {/* Mobile App Promotion Card */}
              <Link
                href="/app-promotion/playground"
                className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col h-full">
                  {/* Video Preview */}
                  <div className="mb-6 w-full relative rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all">
                    <InstagramStyleVideo
                      videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                      headline="Transform Your App into a Viral Sensation"
                      ctaText="Get Started"
                      brandName="AppFlow"
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Icon name="Smartphone" className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Mobile App Promotion
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 flex-grow leading-relaxed">
                    Create high-converting ads for your iOS or Android app.
                    Perfect for App Store & Play Store campaigns.
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                    Start Creating{" "}
                    <Icon name="ArrowRight" className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-2 pt-4">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                No credit card required
              </span>
              <span>·</span>
              <span>100+ brands trust us</span>
            </p>

            {/* Hero Visual / Dashboard Mockup */}
            <div className="mt-20">
              <UrlToVideoMockup />
            </div>

            {/* Social Proof */}
            <div className="mt-20 border-y border-black/5 py-10">
              <p className="text-center text-sm font-medium text-gray-400 mb-8">
                POWERING ADS FOR HIGH-GROWTH COMPANIES
              </p>
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 grayscale opacity-50">
                {[
                  "Acme Corp",
                  "Global Bank",
                  "Nebula",
                  "Fox",
                  "Linear",
                  "Raycast",
                ].map((name) => (
                  <span key={name} className="text-lg font-bold font-serif">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6 bg-gray-50/50">
          <div className="mx-auto max-w-6xl space-y-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-medium sm:text-4xl tracking-tight">
                From landing page to <br /> launching campaign.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Card 1: Large span */}
              <div className="md:col-span-2 rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition hover:shadow-md group cursor-default">
                <div className="h-64 w-full rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 mb-8 flex items-center justify-center relative overflow-hidden">
                  {/* Grid pattern background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                  {/* Platform Pills */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-pink-600 shadow-sm border border-pink-100">
                      Instagram Reels
                    </div>
                    <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-black shadow-sm border border-gray-100">
                      TikTok
                    </div>
                    <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-blue-600 shadow-sm border border-blue-100">
                      Meta Ads
                    </div>
                    <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-red-600 shadow-sm border border-red-100">
                      YouTube Shorts
                    </div>
                  </div>

                  <div className="bg-white shadow-xl rounded-lg p-4 w-64 transform transition-transform group-hover:translate-y-[-4px]">
                    <div className="flex gap-2 mb-3">
                      <div className="h-8 w-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                        Ad
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="h-2 w-20 bg-gray-100 rounded" />
                        <div className="h-2 w-12 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="h-24 bg-gray-900 rounded mb-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50"></div>
                      <div className="absolute bottom-2 right-2 text-[8px] bg-black/50 text-white px-1 rounded">
                        0:15
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-16 bg-gray-100 rounded"></div>
                      <div className="h-6 px-3 bg-blue-600 rounded text-[10px] text-white flex items-center justify-center font-medium">
                        Publish
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold">
                  Multi-Platform Formatting
                </h3>
                <p className="mt-2 text-gray-500 max-w-md">
                  One app link generates assets optimized for every platform.
                  9:16 for Reels/TikTok/Shorts, 1:1 for Instagram Feed, and 16:9
                  for YouTube Ads.
                </p>
              </div>

              {/* Card 2: Tall */}
              <div className="md:row-span-2 rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition hover:shadow-md flex flex-col">
                <div className="flex-1 rounded-xl bg-gradient-to-b from-emerald-50 to-white mb-8 border border-emerald-100/50 p-6">
                  <div className="space-y-3">
                    <StatCard label="Ad CTR" value="4.2%" trend="+1.5%" />
                    <StatCard
                      label="Generation Time"
                      value="12s"
                      trend="Fast"
                    />
                    <StatCard
                      label="Cost per Asset"
                      value="$0.50"
                      trend="-90%"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">Performance First</h3>
                <p className="mt-2 text-gray-500">
                  Our AI is trained on high-converting ad creatives. We
                  don&apos;t just make videos; we make ads that sell.
                </p>
              </div>

              {/* Card 3 */}
              <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition hover:shadow-md">
                <div className="h-40 w-full rounded-xl bg-orange-50 mb-6 flex items-center justify-center">
                  <div className="w-3/4 space-y-2 bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                    <div className="h-2 w-2/3 bg-gray-100 rounded"></div>
                    <div className="mt-3 h-8 w-full bg-orange-100 rounded text-xs flex items-center justify-center text-orange-600 font-medium">
                      &quot;Best productivity tool 2025&quot;
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold">Smart Scripting</h3>
                <p className="mt-2 text-gray-500">
                  We extract your unique value propositions and customer
                  testimonials to write compelling ad scripts automatically.
                </p>
              </div>

              {/* Card 4 */}
              <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition hover:shadow-md">
                <div className="h-40 w-full rounded-xl bg-violet-50 mb-6 flex items-center justify-center">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-violet-200 blur-xl absolute top-0 left-0 opacity-50"></div>
                    <div className="h-24 w-24 rounded-2xl bg-white shadow-lg border border-violet-100 flex items-center justify-center text-4xl">
                      🎨
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-black text-white text-[10px] px-2 py-1 rounded-full">
                      Brand Safe
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold">On-Brand Styling</h3>
                <p className="mt-2 text-gray-500">
                  Upload your logo and fonts once. Every generated video will
                  look like it was made by your in-house design team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data & Case Studies Section */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16">
              <h2 className="text-3xl font-medium sm:text-4xl tracking-tight mb-6">
                Why Video? The Data Speaks for Itself.
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Social media algorithms prioritize video content. Here&apos;s
                how leveraging the right video strategy impacts your bottom
                line.
              </p>
            </div>

            {/* Data Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {/* Card 1: Conversion Rates */}
              <div className="p-6 rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">
                  <Icon name="Activity" className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold mb-2 text-slate-900">
                  400%
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Higher CTR with UGC
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  User-Generated Content style ads significantly outperform
                  polished studio ads in click-through rates.
                </p>
                {/* Simple Bar Chart Visual */}
                <div className="flex items-end gap-4 h-24 border-b border-black/5 pb-2">
                  <div className="w-12 bg-gray-200 rounded-t-md h-1/4 relative group">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Studio
                    </div>
                  </div>
                  <div className="w-12 bg-blue-500 rounded-t-md h-full relative group">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      UGC
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Retention */}
              <div className="p-6 rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="text-emerald-600 mb-4">
                  <Icon name="Clock" className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold mb-2 text-slate-900">
                  60%
                </div>
                <h3 className="text-lg font-semibold mb-2">Better Retention</h3>
                <p className="text-gray-500 text-sm mb-6">
                  AI-optimized hooks keep viewers watching past the critical
                  3-second mark, boosting algorithmic reach.
                </p>
                {/* Line Graph Visual */}
                <div className="h-24 relative border-l border-b border-black/5">
                  <svg
                    viewBox="0 0 100 50"
                    className="w-full h-full overflow-visible"
                  >
                    <path
                      d="M0,50 L20,10 L40,15 L60,5 L80,20 L100,0"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                    />
                    <path
                      d="M0,50 L20,30 L40,40 L60,35 L80,45 L100,40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                      strokeDasharray="4 4"
                    />
                  </svg>
                  <div className="absolute bottom-2 right-2 text-[10px] text-emerald-600 font-bold">
                    Optimized
                  </div>
                </div>
              </div>

              {/* Card 3: Platform ROI */}
              <div className="p-6 rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="text-purple-600 mb-4">
                  <Icon name="TrendingUp" className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold mb-2 text-slate-900">
                  3.5x
                </div>
                <h3 className="text-lg font-semibold mb-2">ROAS on Meta</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Targeting specific niches with tailored video creatives yields
                  3.5x Return on Ad Spend.
                </p>
                {/* Platform List */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-600">TikTok</span>
                    <span className="bg-black/5 px-2 py-1 rounded text-gray-900">
                      3.2% Eng.
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-600">Reels</span>
                    <span className="bg-blue-50 px-2 py-1 rounded text-blue-700">
                      2.8% Eng.
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-600">Shorts</span>
                    <span className="bg-red-50 px-2 py-1 rounded text-red-700">
                      2.5% Eng.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real World Case Study */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                    CASE STUDY
                  </div>
                  <h3 className="text-3xl font-bold">
                    How FitLife Scaled to 10k Users in 3 Months
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    FitLife struggled with high CAC on static image ads. By
                    switching to Haipe Flow&apos;s high-volume video generation,
                    they tested 50+ variations weekly, finding winning creatives
                    that dropped CPA by 40%.
                  </p>
                  <div className="flex gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">
                        -40%
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                        CPA
                      </div>
                    </div>
                    <div className="w-px bg-white/10"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        10k+
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                        New Users
                      </div>
                    </div>
                    <div className="w-px bg-white/10"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        3.5x
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                        ROAS
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Comparison */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-semibold text-gray-300">
                      Campaign Performance
                    </h4>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>{" "}
                        Before
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>{" "}
                        After
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">
                          Click-Through Rate
                        </span>
                        <span className="text-white font-mono">
                          2.4% vs 0.8%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-gray-500 relative">
                          <div className="absolute top-0 left-0 h-full bg-blue-500 w-[75%]"></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Conversion Rate</span>
                        <span className="text-white font-mono">
                          4.1% vs 1.2%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-gray-500 relative">
                          <div className="absolute top-0 left-0 h-full bg-blue-500 w-[70%]"></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Cost Per Install</span>
                        <span className="text-white font-mono">
                          $3.50 vs $8.20
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-gray-500 relative">
                          {/* Inverted visual for cost reduction */}
                          <div className="absolute top-0 left-0 h-full bg-blue-500 w-[40%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detail Section with Tabs */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl font-medium tracking-tight">
                  How it works.
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      id: "analyze",
                      title: "1. Select Type",
                      desc: "Choose between App, Product, or Service promotion to start your campaign.",
                    },
                    {
                      id: "generate",
                      title: "2. AI Generation",
                      desc: "Our engine creates scripts, selects stock footage, and animates text overlays.",
                    },
                    {
                      id: "publish",
                      title: "3. Publish Ads",
                      desc: "Export optimized video files ready for your ad manager campaigns.",
                    },
                  ].map((step) => (
                    <button
                      key={step.id}
                      onClick={() => setActiveTab(step.id)}
                      className={`block text-left w-full p-6 rounded-xl border transition-all ${
                        activeTab === step.id
                          ? "bg-white border-black/10 shadow-md"
                          : "border-transparent hover:bg-gray-50"
                      }`}
                    >
                      <h4 className="text-lg font-semibold">{step.title}</h4>
                      {activeTab === step.id && (
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-300">
                          {step.desc}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[500px] bg-gray-100 rounded-2xl border border-black/5 relative overflow-hidden group">
                {/* Contextual graphic based on active tab */}
                <div className="absolute inset-0 flex items-center justify-center p-10">
                  {activeTab === "analyze" && (
                    <div className="w-full max-w-xs bg-white rounded-xl shadow-xl border border-black/5 overflow-hidden animate-in zoom-in duration-500">
                      <div className="bg-gray-50 border-b border-black/5 p-3 text-xs text-gray-400">
                        Analyzing app...
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="h-2 w-full bg-blue-100 rounded-full animate-pulse"></div>
                        <div className="h-2 w-2/3 bg-blue-100 rounded-full animate-pulse"></div>
                        <div className="h-2 w-5/6 bg-blue-100 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                  {activeTab === "generate" && (
                    <div className="grid grid-cols-2 gap-4 animate-in zoom-in duration-500">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-32 w-32 bg-white rounded-lg shadow-lg border border-black/5 flex items-center justify-center text-2xl"
                        >
                          🎬
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === "publish" && (
                    <div className="text-center space-y-4 animate-in zoom-in duration-500">
                      <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 text-green-600 text-4xl mb-4">
                        ✓
                      </div>
                      <h3 className="text-xl font-semibold">
                        Ready for launch
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Samples Marquee */}
        <section className="py-10">
          <VideoMarquee />
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-4xl rounded-3xl bg-black px-6 py-16 text-center text-white sm:px-16">
            <h2 className="text-3xl font-medium sm:text-4xl mb-6">
              Stop editing. Start growing.
            </h2>
            <p className="mx-auto max-w-xl text-lg text-gray-400 mb-10">
              Create a month&apos;s worth of video ads in minutes. Scale your
              campaigns without scaling your team.
            </p>
            <button className="rounded-full bg-white px-8 py-4 text-base font-bold text-black transition hover:bg-gray-200">
              Generate Your First Ad Free
            </button>
            <p className="mt-6 text-xs text-gray-500">
              No credit card required · Cancel anytime
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-black/5 bg-gray-50 py-12 px-6">
          <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4">
              <Image
                src="/logo.png"
                alt="Haipe Flow Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <p className="text-sm text-gray-500">© 2025 Haipe Flow.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
              {["Product", "Company", "Resources", "Legal"].map((col) => (
                <div key={col} className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900">{col}</h4>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>
                      <a href="#" className="hover:text-black">
                        Link One
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-black">
                        Link Two
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-black">
                        Link Three
                      </a>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
