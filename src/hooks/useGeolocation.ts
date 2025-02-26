import { useEffect, useState } from "react";

export function useGeolocation() {
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      console.log("Geolocation is supported!");
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation(position);
        setIsLoading(false);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return { userLocation, isLoading }
}