"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Liff } from "@line/liff";

import { Map } from "react-map-gl";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function Home() {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [profile, setProfile] = useState<string | null>(null);
  // const [userLocation, setUserLocation] = useState<GeolocationPosition | null>();

  const { isLoading, userLocation } = useGeolocation();

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

  return (
    <div>
      <main>
        <h1>create-liff-app</h1>
        {liffObject && <p>LIFF init succeeded.</p>}
        {liffError && (
          <>
            <p>LIFF init failed.</p>
            <p>
              <code>{liffError}</code>
            </p>
          </>
        )}
        <a
          href="https://developers.line.biz/ja/docs/liff/"
          target="_blank"
          rel="noreferrer"
        >
          LIFF Documentation
        </a>
        {liffObject?.isLoggedIn() ? <p>yes</p> : <p>no</p>}
        {liffObject?.isLoggedIn()}
        <Button color="primary" onPress={() => liffObject?.login()}>
          login
        </Button>
        {profile}
      </main>
      <Map
        initialViewState={{
          latitude: userLocation?.coords.latitude,
          longitude: userLocation?.coords.longitude,
          zoom: 14,
        }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        style={{
          width: "100%",
          height: "95vh",
          position: "relative",
          zIndex: 0,
        }}
        mapStyle={"mapbox://styles/mapbox/streets-v12"}
      ></Map>
    </div>
  );
}
