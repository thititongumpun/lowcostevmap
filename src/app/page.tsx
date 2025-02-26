"use client";

import { useEffect, useState } from "react";
import { Liff } from "@line/liff";

import {
  FullscreenControl,
  GeolocateControl,
  Map,
  NavigationControl,
  ScaleControl,
} from "react-map-gl";
import { useGeolocation } from "@/hooks/useGeolocation";
import UserLocationMarker from "@/components/user-location-marker";

export default function Home() {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [profile, setProfile] = useState<string | null>(null);

  const { isLoading, userLocation, heading } = useGeolocation();

  console.log(liffError);
  console.log(profile);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    // to avoid `window is not defined` error
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        console.log("LIFF init...");
        liff
          .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
          .then(() => {
            console.log("LIFF init succeeded.");
            setLiffObject(liff);
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.");
            setLiffError(error.toString());
          });
      });
  }, []);

  useEffect(() => {
    async function getProfile() {
      if (!liffObject) {
        return;
      }
      const profile = await liffObject?.getProfile();
      setProfile(profile?.displayName as string);
      const idToken = liffObject?.getDecodedIDToken();
      console.log(idToken); // print decoded idToken object
    }
    getProfile();
  }, [liffObject]);

  if (isLoading) {
    return <p>loading...</p>;
  }

  // if (!liffObject?.isLoggedIn()) {
  //   return liffObject?.login();
  // }

  return (
    <Map
      initialViewState={{
        latitude: userLocation?.coords.latitude,
        longitude: userLocation?.coords.longitude,
        zoom: 14,
      }}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        zIndex: 0,
      }}
      mapStyle={"mapbox://styles/mapbox/streets-v12"}
    >
      {/* <GeocoderControl
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}
        position="top-left"
      /> */}
      <GeolocateControl
        position="top-left"
        trackUserLocation
        showUserHeading
        showUserLocation
        showAccuracyCircle={false}
      />
      <FullscreenControl position="top-left" />
      <NavigationControl position="top-left" />
      <ScaleControl position="top-left" />

      <UserLocationMarker
        latitude={userLocation?.coords.latitude}
        longitude={userLocation?.coords.longitude}
        heading={heading}
      />
    </Map>
  );
}
