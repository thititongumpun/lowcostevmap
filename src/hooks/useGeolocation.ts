"use client";

import { useState, useEffect } from "react";

export function useGeolocation() {
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>();
  const [heading, setHeading] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
      return;
    }

    // Get initial position
    const positionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    // Watch position for updates (especially heading)
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation(position);

        // Check if heading information is available
        if (position.coords.heading !== null && position.coords.heading !== undefined) {
          setHeading(position.coords.heading);
        }

        setIsLoading(false);
      },
      (err) => {
        setError(`ERROR(${err.code}): ${err.message}`);
        setIsLoading(false);
      },
      positionOptions
    );

    // Cleanup function
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { userLocation, heading, isLoading, error };
}