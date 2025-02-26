"use client";

import { Button } from "@heroui/button";
import { MapIcon, Navigation } from "lucide-react";
import React, { useEffect, useState } from "react";

type NavigateButtonProps = {
  lat: number | undefined;
  lon: number | undefined;
};

export default function NavigateButton({ lat, lon }: NavigateButtonProps) {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if user is on iOS device
    const checkIsIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    setIsIOS(checkIsIOS());
  }, []);

  const handleGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    window.open(url, "_blank");
  };

  const handleAppleMaps = () => {
    const url = `https://maps.apple.com/?daddr=${lat},${lon}&dirflg=d`;
    window.open(url, "_blank");
  };

  // On non-iOS devices, show Google Maps button
  return (
    <div className="flex w-full flex-col gap-2">
      {isIOS && (
        <Button
          onPress={handleAppleMaps}
          className="flex w-full items-center justify-center gap-2 bg-gray-800 text-white hover:bg-gray-900"
        >
          <Navigation className="h-4 w-4" />
          Navigate with Apple Maps
        </Button>
      )}

      <Button
        onPress={handleGoogleMaps}
        className="flex w-full items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
      >
        <MapIcon className="h-4 w-4" />
        Navigate with Google Maps
      </Button>
    </div>
  );
}
