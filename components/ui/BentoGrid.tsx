"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoCopyOutline } from "react-icons/io5";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { BackgroundGradientAnimation } from "./GradientBg";
import MagicButton from "../MagicButton";

// Fix: Import Lottie and GridGlobe dynamically to avoid SSR issues
const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false,
  loading: () => <div className="w-[400px] h-[200px] animate-pulse bg-white/10 rounded-lg" />
});

const GridGlobe = dynamic(() => import("./GridGlobe"), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] animate-pulse bg-white/5 rounded-lg flex items-center justify-center text-white/50">Loading Globe...</div>
});

const GridMusicPlayer = dynamic(() => import("./GridMusicPlayer"), {
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse bg-white/5 rounded-lg flex items-center justify-center text-white/50">Loading Music Player...</div>
});

type BentoGridProps = {
  className?: string;
  children?: React.ReactNode;
};

type BentoGridItemProps = {
  className?: string;
  id: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
};

// Song themes data (must match your music player)
const songThemes = [
  {
    id: 1,
    colors: {
      primary: "#3B82F6",
      secondary: "#EAB308",
      gradient: "from-blue-500/10 via-blue-400/5 to-yellow-400/10",
    },
  },
  {
    id: 2,
    colors: {
      primary: "#1E40AF",
      secondary: "#3B82F6",
      gradient: "from-blue-900/10 via-blue-700/5 to-blue-500/10",
    },
  },
  {
    id: 3,
    colors: {
      primary: "#DC2626",
      secondary: "#7C3AED",
      gradient: "from-red-500/10 via-pink-500/5 to-purple-500/10",
    },
  },
  {
    id: 4,
    colors: {
      primary: "#EA580C",
      secondary: "#EAB308",
      gradient: "from-orange-500/10 via-amber-400/5 to-yellow-400/10",
    },
  },
] as const;

// Tipo para el CustomEvent que emite el reproductor
type MusicPlayerStateDetail = {
  songIndex: number;
  isPlaying: boolean;
};

export const BentoGrid: React.FC<BentoGridProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem: React.FC<BentoGridItemProps> = ({
  className,
  id,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}) => {
  const [copied, setCopied] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Fix: Only initialize Lottie options on client side
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Fix: Load animation data only on client side
    if (typeof window !== 'undefined') {
      import("@/data/confetti.json").then((data) => {
        setAnimationData(data.default || data);
      });
    }
  }, []);

  const defaultOptions = animationData ? {
    loop: copied,
    autoplay: copied,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  } : null;

  const handleCopy = () => {
    const text = "andresnei0820@@gmail.com"; // Replace with your email

    // Fix: Add SSR check for navigator.clipboard
    if (typeof window !== 'undefined' && navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
    } else {
      // Fallback for older browsers or SSR
      console.log('Clipboard API not available');
      setCopied(true);
    }
  };

  // Listen for music player state changes (solo cuando id === 3)
  useEffect(() => {
    if (id !== 3) return;

    // Fix: Add SSR check for window event listeners
    if (typeof window === 'undefined') return;

    const handleMusicChange = (event: Event) => {
      const e = event as CustomEvent<MusicPlayerStateDetail>;
      if (!e.detail) return;
      setCurrentSongIndex(e.detail.songIndex);
      setIsPlaying(e.detail.isPlaying);
    };

    window.addEventListener(
      "musicPlayerStateChange",
      handleMusicChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "musicPlayerStateChange",
        handleMusicChange as EventListener
      );
    };
  }, [id]);

  // Get current song theme for music player item
  const currentTheme =
    id === 3 ? songThemes[currentSongIndex % songThemes.length] : null;

  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4",
        className,
        id === 3 && "shadow-2xl",
        id === 3 && "hover:scale-[1.02] transition-transform duration-300"
      )}
      style={{
        background:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
        ...(id === 3 &&
          currentTheme && {
          borderColor: `${currentTheme.colors.primary}40`,
          boxShadow: `0 0 40px ${currentTheme.colors.primary}25, 0 0 60px ${currentTheme.colors.secondary}15, inset 0 1px 0 ${currentTheme.colors.secondary}20`,
        }),
      }}
      data-music-container={id === 3 ? "true" : undefined}
    >
      {/* Enhanced Container Effects for Music Player */}
      {id === 3 && currentTheme && (
        <>
          {/* Stronger gradient overlay */}
          <div
            className="absolute inset-0 opacity-50 transition-all duration-1000 ease-in-out rounded-3xl"
            style={{
              background: `radial-gradient(circle at 30% 20%, ${currentTheme.colors.primary}25 0%, transparent 60%), 
                          radial-gradient(circle at 80% 80%, ${currentTheme.colors.secondary}20 0%, transparent 60%),
                          linear-gradient(135deg, ${currentTheme.colors.primary}10 0%, transparent 50%, ${currentTheme.colors.secondary}15 100%)`,
            }}
          />

          {/* Blurred shapes */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className={`absolute top-6 left-6 w-28 h-16 rounded-full blur-xl transition-all duration-1000 ${isPlaying ? "animate-pulse" : ""
                }`}
              style={{
                background: `radial-gradient(ellipse, ${currentTheme.colors.primary}35 0%, ${currentTheme.colors.primary}15 50%, transparent 80%)`,
                animationDelay: "0s",
              }}
            />
            <div
              className={`absolute bottom-8 right-8 w-24 h-24 rounded-full blur-lg transition-all duration-1000 ${isPlaying ? "animate-pulse" : ""
                }`}
              style={{
                background: `radial-gradient(circle, ${currentTheme.colors.secondary}40 0%, ${currentTheme.colors.secondary}20 40%, transparent 80%)`,
                animationDelay: "0.5s",
              }}
            />
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-12 rounded-full blur-2xl transition-all duration-1000 ${isPlaying ? "animate-pulse" : ""
                }`}
              style={{
                background: `linear-gradient(45deg, ${currentTheme.colors.primary}25 0%, ${currentTheme.colors.secondary}25 100%)`,
                animationDelay: "1s",
              }}
            />
            <div
              className={`absolute top-1/4 right-1/4 w-16 h-20 rounded-full blur-xl transition-all duration-1000 ${isPlaying ? "animate-pulse" : ""
                }`}
              style={{
                background: `radial-gradient(ellipse, ${currentTheme.colors.secondary}30 0%, transparent 70%)`,
                animationDelay: "1.5s",
              }}
            />
            <div
              className={`absolute bottom-1/3 left-1/4 w-20 h-14 rounded-full blur-lg transition-all duration-1000 ${isPlaying ? "animate-pulse" : ""
                }`}
              style={{
                background: `radial-gradient(ellipse, ${currentTheme.colors.primary}25 0%, transparent 70%)`,
                animationDelay: "2s",
              }}
            />
            <div
              className="absolute inset-0 rounded-3xl transition-all duration-1000"
              style={{
                background: `linear-gradient(90deg, 
                  ${currentTheme.colors.primary}15 0%, 
                  transparent 25%, 
                  transparent 75%, 
                  ${currentTheme.colors.secondary}15 100%)`,
                filter: "blur(2px)",
              }}
            />
            <div
              className="absolute top-0 left-0 w-20 h-20 rounded-br-full transition-all duration-1000"
              style={{
                background: `radial-gradient(circle at bottom right, ${currentTheme.colors.primary}20 0%, transparent 60%)`,
                filter: "blur(1px)",
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-full transition-all duration-1000"
              style={{
                background: `radial-gradient(circle at top left, ${currentTheme.colors.secondary}20 0%, transparent 60%)`,
                filter: "blur(1px)",
              }}
            />
          </div>
        </>
      )}

      <div className={`${id === 6 && "flex justify-center"} h-full relative z-10`}>
        {/* Imagen de fondo */}
        <div className="w-full h-full absolute">
          {img && (
            <Image
              src={img}
              alt={typeof img === "string" ? img : "bg"}
              fill
              className={cn(imgClassName, "object-cover object-center")}
              sizes="100vw"
              unoptimized
              priority={id === 6}
            />
          )}
        </div>

        {/* Imagen secundaria (spare) */}
        <div className={`absolute right-0 -bottom-5 ${id === 5 && "w-full opacity-80"}`}>
          {spareImg && (
            <Image
              src={spareImg}
              alt={typeof spareImg === "string" ? spareImg : "spare"}
              width={1200}
              height={600}
              className="object-cover object-center w-full h-full"
              sizes="(min-width:1024px) 800px, 100vw"
              unoptimized
            />
          )}
        </div>

        {id === 6 && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl" />
          </BackgroundGradientAnimation>
        )}

        <div
          className={cn(
            titleClassName,
            "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
          )}
        >
          {/* Music Player for item 3 */}
          {id === 3 ? (
            <div className="h-full flex flex-col">
              <div className="mb-4">
                <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
                  {description}
                </div>
                <div className="font-sans text-lg lg:text-3xl max-w-96 font-bold z-10">
                  {title}
                </div>
              </div>
              <div className="flex-1">
                <GridMusicPlayer />
              </div>
            </div>
          ) : (
            <>
              {/* Original content for other items */}
              <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
                {description}
              </div>
              <div className="font-sans text-lg lg:text-3xl max-w-96 font-bold z-10">
                {title}
              </div>

              {/* for the github 3d globe */}
              {id === 2 && <GridGlobe />}

              {id === 6 && (
                <div className="mt-5 relative">
                  {/* Fix: Only render Lottie on client side with proper checks */}
                  <div className={`absolute -bottom-5 right-0 ${copied ? "block" : "block"}`}>
                    {isClient && defaultOptions && (
                      <Lottie options={defaultOptions} height={200} width={400} />
                    )}
                  </div>

                  <MagicButton
                    title={copied ? "Email is Copied!" : "Copy my email address"}
                    icon={<IoCopyOutline />}
                    position="left"
                    handleClick={handleCopy}
                    otherClasses="!bg-[#161A31]"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};