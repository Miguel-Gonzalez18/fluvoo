"use client";

import PixelBlast from "@/modules/shared/components/ui/PixelBlast";

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <PixelBlast
        className="bg-black"
        liquid={true}
        variant="square"
        pixelSize={4}
        color="#048059"
        patternScale={2}
        patternDensity={1}
        pixelSizeJitter={0}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquidStrength={0.12}
        liquidRadius={1.2}
        liquidWobbleSpeed={5}
        speed={0.5}
        edgeFade={0.25}
        transparent
      />
    </div>
  );
}
