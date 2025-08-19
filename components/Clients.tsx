"use client";

import React from "react";
import Image from "next/image";

import { companies, testimonials } from "@/data";
import { InfiniteMovingCards } from "./ui/InfiniteCards";

// Derivamos tipos directamente de los arrays exportados en "@/data"
type Company = (typeof companies)[number];
type Testimonial = (typeof testimonials)[number];

const Clients: React.FC = () => {
  return (
    <section id="testimonials" className="py-20">
      <h1 className="heading">
        Kind words from
        <span className="text-purple"> satisfied clients</span>
      </h1>

      <div className="flex flex-col items-center max-lg:mt-10">
        <div
          // h-[50vh] en mobile y md:h-[30rem] en desktop
          className="h-[50vh] md:h-[30rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden"
        >
          {/* Si InfiniteMovingCards está tipado, puedes poner <InfiniteMovingCards<Testimonial> ... /> */}
          <InfiniteMovingCards
            items={testimonials as Testimonial[]}
            direction="right"
            speed="slow"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-16 max-lg:mt-10">
          {companies.map((company: Company) => {
            const wordmarkWidth = company.id === 4 || company.id === 5 ? 100 : 150;

            return (
              <div className="flex md:max-w-60 max-w-32 gap-2" key={company.id}>
                {/* Icono / Isotipo */}
                <Image
                  src={company.img}
                  alt={company.name}
                  width={40}
                  height={40}
                  className="md:w-10 w-5 h-auto"
                  // Quita unoptimized si ya configuraste remotePatterns/domains en next.config.js
                  unoptimized
                />
                {/* Wordmark / Nombre */}
                <Image
                  src={company.nameImg}
                  alt={company.name}
                  width={wordmarkWidth}
                  height={24}
                  className="md:w-24 w-20 h-auto"
                  unoptimized
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Clients;
