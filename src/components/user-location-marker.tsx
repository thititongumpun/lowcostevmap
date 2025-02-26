"use client";

import { MapPin, Navigation2 } from "lucide-react";
import { Marker, Popup } from "react-map-gl";

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

      {/* Popup with location info */}
      <Popup
        latitude={latitude}
        longitude={longitude}
        closeButton={true}
        closeOnClick={false}
        anchor="top"
        offset={[0, 10]}
      >
        <div className="rounded-md bg-white px-2 py-1 shadow-sm">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span>Current Location</span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
