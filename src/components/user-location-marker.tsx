"use client";

import { Navigation2 } from "lucide-react";
import { Marker } from "react-map-gl";

type UserLocationMarker = {
  latitude: number | undefined;
  longitude: number | undefined;
  heading: number | null; // Heading in degrees (0-360)
};

export default function UserLocationMarker({
  latitude,
  longitude,
  heading = 0, // Default to north (0 degrees)
}: UserLocationMarker) {
  if (!latitude || !longitude) return null;

  return (
    <Marker latitude={latitude} longitude={longitude}>
      {/* Directional marker with navigation icon */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute h-8 w-8 rounded-full bg-blue-500/20" />

        {/* Inner circle with directional icon */}
        <div className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-lg">
          <Navigation2
            className="h-4 w-4 text-white"
            style={{
              transform: `rotate(${heading}deg)`,
              transformOrigin: "center",
              transition: "transform 0.3s ease-in-out",
            }}
            strokeWidth={2.5}
          />
        </div>
      </div>
    </Marker>
  );
}
