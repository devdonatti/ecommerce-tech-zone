import React from "react";

const HeroSection = () => {
  return (
    <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 2xl:h-72 overflow-hidden bg-black">
      <img
        src="/banner9.png"
        alt="Hero Image"
        className="absolute inset-0 w-full h-full object-contain object-center"
      />
    </div>
  );
};

export default HeroSection;
