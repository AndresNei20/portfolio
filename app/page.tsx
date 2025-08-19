"use client";

import { useState, useEffect } from "react";
import { navItems } from "@/data";

import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import Footer from "@/components/Footer";
import Approach from "@/components/Approach";
import Experience from "@/components/Experience";
import RecentProjects from "@/components/RecentProjects";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import TechStack from "@/components/TechStack";
import MacOSLoginOverlay from "@/components/ui/MacosLoginOverlay";

const Home = () => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Prevent scrolling while overlay is active
  useEffect(() => {
    if (showOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showOverlay]);

  const handleOverlayDismiss = () => {
    setIsTransitioning(true);

    // Start fade out transition
    setTimeout(() => {
      setShowOverlay(false);
    }, 500); // Match the transition duration
  };

  return (
    <>
      {/* macOS Login Overlay with fade transition */}
      {showOverlay && (
        <div
          className={`transition-opacity duration-500 ease-out ${isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
        >
          <MacOSLoginOverlay onDismiss={handleOverlayDismiss} />
        </div>
      )}

      {/* Main Portfolio Content */}
      <main
        className={`relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5 transition-opacity duration-500 ${showOverlay ? 'opacity-0' : 'opacity-100'
          }`}
      >
        <div className="max-w-7xl w-full">
          <FloatingNav navItems={navItems} />
          <Hero />
           <Grid />
          <TechStack /> 
          <RecentProjects />
         {/*  <Clients /> */}
          <Experience />
          <Approach />
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Home;