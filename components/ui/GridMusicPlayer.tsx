import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp } from 'react-icons/fa';

const GridMusicPlayer = () => {
    // Your favorite songs with color themes
    const songs = [
        {
            id: 1,
            title: "Feel It",
            artist: "d4vd",
            duration: "2:38",
            audioUrl: "/music/song1.mp3",
            colors: {
                primary: "#3B82F6", // Blue
                secondary: "#EAB308", // Yellow
                gradient: "from-blue-500/10 via-blue-400/5 to-yellow-400/10"
            }
        },
        {
            id: 2,
            title: "Birds of a Feather",
            artist: "Billie Eilish",
            duration: "3:31",
            audioUrl: "/music/song2.mp3",
            colors: {
                primary: "#1E40AF", // Dark Blue
                secondary: "#3B82F6", // Blue
                gradient: "from-blue-900/10 via-blue-700/5 to-blue-500/10"
            }
        },
        {
            id: 3,
            title: "Your Idol",
            artist: "Saja Boys",
            duration: "1:59",
            audioUrl: "/music/song3.mp3",
            colors: {
                primary: "#DC2626", // Red
                secondary: "#7C3AED", // Purple
                gradient: "from-red-500/10 via-pink-500/5 to-purple-500/10"
            }
        },
        {
            id: 4,
            title: "Summer Uptown",
            artist: "Jasontheween & d4dv",
            duration: "2:29",
            audioUrl: "/music/song4.mp3",
            colors: {
                primary: "#EA580C", // Orange
                secondary: "#EAB308", // Yellow
                gradient: "from-orange-500/10 via-amber-400/5 to-yellow-400/10"
            }
        }
    ];

    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);

    const audioRef = useRef<HTMLAudioElement>(null);
    const currentSong = songs[currentSongIndex];

    // Emit events to notify container about state changes
    const emitStateChange = useCallback((songIndex: number, playing: boolean) => {
        // Fix: Add SSR check for window
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('musicPlayerStateChange', {
                detail: { songIndex, isPlaying: playing }
            });
            window.dispatchEvent(event);
        }
    }, []);

    // Fix: Use useCallback to memoize handleNext to avoid useEffect warning
    const handleNext = useCallback(() => {
        const newIndex = (currentSongIndex + 1) % songs.length;
        setCurrentSongIndex(newIndex);
        setIsPlaying(false);
        emitStateChange(newIndex, false);
    }, [currentSongIndex, songs.length, emitStateChange]);

    // Update the container background when song changes
    useEffect(() => {
        // Fix: Add SSR check for document
        if (typeof window !== 'undefined' && document) {
            const container = document.querySelector('[data-music-container="true"]');
            if (container) {
                // Remove all existing background classes
                container.classList.remove(
                    'bg-gradient-to-br',
                    'from-blue-500/10', 'via-blue-400/5', 'to-yellow-400/10',
                    'from-blue-900/10', 'via-blue-700/5', 'to-blue-500/10',
                    'from-red-500/10', 'via-pink-500/5', 'to-purple-500/10',
                    'from-orange-500/10', 'via-amber-400/5', 'to-yellow-400/10'
                );

                // Add new background classes
                const gradientClasses = currentSong.colors.gradient.split(' ');
                container.classList.add('bg-gradient-to-br', ...gradientClasses);
            }
        }

        // Emit state change
        emitStateChange(currentSongIndex, isPlaying);
    }, [currentSongIndex, currentSong.colors.gradient, isPlaying, emitStateChange]);

    // Fix: Set volume using useEffect to avoid the volume prop issue
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleNext);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleNext);
        };
    }, [currentSongIndex, handleNext]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
            emitStateChange(currentSongIndex, false);
        } else {
            audio.play();
            setIsPlaying(true);
            emitStateChange(currentSongIndex, true);
        }
    };

    const handlePrevious = () => {
        const newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        setCurrentSongIndex(newIndex);
        setIsPlaying(false);
        emitStateChange(newIndex, false);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;

        const newTime = (parseFloat(e.target.value) / 100) * duration;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value) / 100;
        setVolume(newVolume);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <>
            {/* Music Player Content - Removed background elements from here */}
            <div className="w-full h-full flex flex-col justify-center p-4 space-y-4 relative z-10">
                {/* Audio element */}
                <audio
                    ref={audioRef}
                    src={currentSong.audioUrl}
                />

                {/* Song info */}
                <div className="flex flex-col space-y-2">
                    <h3 className="text-white font-semibold text-base lg:text-lg truncate">
                        {currentSong.title}
                    </h3>
                    <p className="text-white/70 text-sm lg:text-base truncate">
                        {currentSong.artist}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-white/60">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: `linear-gradient(to right, ${currentSong.colors.primary} 0%, ${currentSong.colors.primary} ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`
                        }}
                    />
                </div>

                {/* Controls and Volume */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handlePrevious}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <FaStepBackward size={18} />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
                            style={{
                                boxShadow: `0 0 20px ${currentSong.colors.primary}20`
                            }}
                        >
                            {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} className="ml-1" />}
                        </button>

                        <button
                            onClick={handleNext}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <FaStepForward size={18} />
                        </button>
                    </div>

                    <div className="flex items-center space-x-2 flex-1 max-w-24 ml-6">
                        <FaVolumeUp className="text-white/60" size={14} />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume * 100}
                            onChange={handleVolumeChange}
                            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                            style={{
                                background: `linear-gradient(to right, ${currentSong.colors.secondary} 0%, ${currentSong.colors.secondary} ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
                            }}
                        />
                    </div>
                </div>

                {/* Now playing indicator */}
                <div className="absolute top-3 right-3 z-20">
                    <div className="flex space-x-1">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`}
                                style={{
                                    height: isPlaying ? `${8 + (i * 3)}px` : '4px',
                                    animationDelay: `${i * 0.1}s`,
                                    backgroundColor: currentSong.colors.primary
                                }}
                            />
                        ))}
                    </div>
                </div>

                <style jsx>{`
                    .slider::-webkit-slider-thumb {
                        appearance: none;
                        width: 14px;
                        height: 14px;
                        background: ${currentSong.colors.primary};
                        border-radius: 50%;
                        cursor: pointer;
                        border: 2px solid white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        transition: all 0.3s ease;
                    }
                    
                    .slider::-moz-range-thumb {
                        width: 14px;
                        height: 14px;
                        background: ${currentSong.colors.primary};
                        border-radius: 50%;
                        cursor: pointer;
                        border: 2px solid white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        transition: all 0.3s ease;
                    }
                    
                    .slider:hover::-webkit-slider-thumb {
                        box-shadow: 0 0 10px ${currentSong.colors.primary}50;
                    }
                `}</style>
            </div>
        </>
    );
};

export default GridMusicPlayer;