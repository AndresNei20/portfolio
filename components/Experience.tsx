"use client";

import React from "react";
import Image from "next/image";

import { workExperience } from "@/data";
import { Button } from "./ui/MovingBorders";

// Tipo inferido desde tu data
type WorkCard = (typeof workExperience)[number];

const Experience: React.FC = () => {
  return (
    <div className="py-20 w-full">
      <h1 className="heading">
        My <span className="text-purple">work experience</span>
      </h1>

      <div className="w-full mt-12 grid lg:grid-cols-4 grid-cols-1 gap-10">
        {workExperience.map((card: WorkCard) => (
          <Button
            key={card.id}
            // random duration
            duration={Math.floor(Math.random() * 10000) + 10000}
            borderRadius="1.75rem"
            style={{
              // Fallback + gradiente correcto (evitamos usar gradient en backgroundColor)
              background:
                "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
              borderRadius: "calc(1.75rem * 0.96)",
            }}
            // sin bg-white / dark:bg-slate-900
            className="flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800"
          >
            <div className="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
              {/* Mantengo los mismos anchos con Tailwind */}
              <Image
                src={card.thumbnail}
                alt={card.title}
                width={128}               // base para lg:w-32 (8rem ≈ 128px)
                height={128}
                className="lg:w-32 md:w-20 w-16 h-auto"
                sizes="(min-width:1024px) 8rem, (min-width:768px) 5rem, 4rem"
                unoptimized
              />
              <div className="lg:ms-5">
                <h1 className="text-start text-xl md:text-2xl font-bold">
                  {card.title}
                </h1>
                <p className="text-start text-white-100 mt-3 font-semibold">
                  {card.desc}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Experience;
