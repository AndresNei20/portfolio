import React, { useState, useEffect } from 'react';
import { Spotlight } from "./Spotlight";

const greetings = [
    { text: "Hello", lang: "English" },
    { text: "Hola", lang: "Spanish" },
    { text: "Bonjour", lang: "French" },
    { text: "Guten Tag", lang: "German" },
    { text: "こんにちは", lang: "Japanese" },
    { text: "안녕하세요", lang: "Korean" },
    { text: "你好", lang: "Chinese" },
    { text: "Привет", lang: "Russian" },
    { text: "Ciao", lang: "Italian" },
    { text: "Olá", lang: "Portuguese" }
];

const MacOSLoginOverlay = ({ onDismiss }: { onDismiss: () => void }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        const currentGreeting = greetings[currentIndex].text;

        if (isTyping) {
            if (displayedText.length < currentGreeting.length) {
                const timeout = setTimeout(() => {
                    setDisplayedText(currentGreeting.slice(0, displayedText.length + 1));
                }, 150);
                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => {
                    setIsTyping(false);
                }, 2500);
                return () => clearTimeout(timeout);
            }
        } else {
            if (displayedText.length > 0) {
                const timeout = setTimeout(() => {
                    setDisplayedText(displayedText.slice(0, -1));
                }, 80);
                return () => clearTimeout(timeout);
            } else {
                setCurrentIndex((prev) => (prev + 1) % greetings.length);
                setIsTyping(true);
            }
        }
    }, [displayedText, isTyping, currentIndex]); // Removed 'greetings' from dependencies

    const handleScreenTap = () => {
        onDismiss();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer" onClick={handleScreenTap}>
            {/* Spotlights - matching your Hero component */}
            <div>
                <Spotlight
                    className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
                    fill="white"
                />
                <Spotlight
                    className="h-[80vh] w-[50vw] top-10 left-full"
                    fill="purple"
                />
                <Spotlight
                    className="hidden md:block h-[120vh] w-[50vw] top-72 left-full"
                    fill="orange"
                />
                <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
                <Spotlight className="left-96 top-28 h-[80vh] w-[50vw]" fill="orange" />
            </div>

            {/* Grid background - matching your Hero component */}
            <div className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2] absolute top-0 left-0 flex items-center justify-center">
                {/* Radial gradient for the container to give a faded look */}
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center px-8">
                {/* Greeting text with typing effect */}
                <div className="mb-16">
                    <h1 className="text-7xl md:text-8xl lg:text-9xl font-light text-white mb-4">
                        {displayedText}
                        <span className="animate-pulse text-white/80">|</span>
                    </h1>
                </div>

                {/* Tap to continue hint */}
                <div className="animate-pulse">
                    <p className="text-white/60 text-lg font-light">
                        Tap anywhere to continue
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MacOSLoginOverlay;