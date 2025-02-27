"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Liff } from "@line/liff";

import {
  FullscreenControl,
  GeolocateControl,
  Map,
  MapRef,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from "react-map-gl";
import { useGeolocation } from "@/hooks/useGeolocation";
import UserLocationMarker from "@/components/user-location-marker";
import { useFetchStations } from "@/hooks/useFetchStations";
import Pin from "@/components/pin";
import { Result } from "@/types/EvStation";
import NavigateButton from "@/components/navigate-button";
import ControlPanel from "@/components/control-panel";
import {
  MapboxStyleDefinition,
  MapboxStyleSwitcherControl,
} from "mapbox-gl-style-switcher";
import MapLoader from "@/components/map-loader";

export default function Home() {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [profile, setProfile] = useState<string | null>(null);
  const [popupInfo, setPopupInfo] = useState<Result>();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const { isLoading, userLocation, heading } = useGeolocation();
  const { evStations } = useFetchStations({
    latitude: userLocation?.coords.latitude,
    longitude: userLocation?.coords.longitude,
  });

  const mapRef = useRef<MapRef>(null);
  const onSelectStation = useCallback(
    (
      { longitude, latitude }: { longitude: number; latitude: number },
      index: number
    ) => {
      setSelectedIndex(index);
      setIsPinging(true);
      mapRef.current?.flyTo({ center: [longitude, latitude], duration: 2000 });
      setTimeout(() => {
        setIsPinging(false);
      }, 3000);
    },
    []
  );

  console.log(liffError, profile);

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

    const styles: MapboxStyleDefinition[] = [
      {
        title: "Streets",
        uri: "mapbox://styles/mapbox/streets-v12",
      },
      {
        title: "Night",
        uri: "mapbox://styles/mapbox/navigation-night-v1",
      },
      {
        title: "Day",
        uri: "mapbox://styles/mapbox/navigation-day-v1",
      },
      {
        title: "Outdoor",
        uri: "mapbox://styles/mapbox/outdoors-v12",
      },
      {
        title: "Satellite",
        uri: "mapbox://styles/mapbox/satellite-v9",
      },
    ];

    mapRef.current?.addControl(new MapboxStyleSwitcherControl(styles));
  }, [liffObject]);

  const pins = useMemo(
    () =>
      evStations.map((station, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={station.position.lon}
          latitude={station.position.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(station);
            onSelectStation(
              {
                longitude: station.position.lon,
                latitude: station.position.lat,
              },
              index
            );
          }}
        >
          <Pin
            isSelected={selectedIndex === index}
            isPinging={isPinging && selectedIndex === index}
            providerName={station.poi.name}
          />
        </Marker>
      )),
    [evStations, isPinging, onSelectStation, selectedIndex]
  );

  if (isLoading) {
    return <MapLoader />
  }

  // if (!liffObject?.isLoggedIn()) {
  //   return liffObject?.login();
  // }

  return (
    <Map
      ref={mapRef}
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

      <ControlPanel
        evStations={evStations}
        onSelectStation={onSelectStation}
        selectedIndex={selectedIndex}
        isPinging={isPinging}
      />
      {/* Render pins */}
      {pins}

      <UserLocationMarker
        latitude={userLocation?.coords.latitude}
        longitude={userLocation?.coords.longitude}
        heading={heading}
      />

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={Number(popupInfo.position.lon)}
          latitude={Number(popupInfo.position.lat)}
          onClose={() => setPopupInfo(undefined)}
          className="text-blue-500"
        >
          <div className="max-w-sm p-2">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {popupInfo.poi.name}
              </h3>
              <p className="text-sm text-gray-600">
                {popupInfo.poi.categories.join(", ")}
              </p>
            </div>

            <div className="mb-3">
              <h4 className="mb-1 font-medium text-gray-700">
                Available Connectors:
              </h4>
              <div className="grid gap-1">
                {popupInfo.chargingPark.connectors.map((connector, index) => (
                  <div
                    key={index}
                    className="rounded bg-blue-50 px-2 py-1 text-sm text-blue-700"
                  >
                    {connector.currentType} ({connector.ratedPowerKW}kW)
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="mb-1 text-sm text-gray-600">
                <span className="font-medium">Distance:</span>{" "}
                {(popupInfo.dist / 1000).toFixed(2)} km
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Address:</span>{" "}
                {popupInfo.address.freeformAddress}
              </p>
            </div>

            <NavigateButton
              lat={popupInfo.position.lat}
              lon={popupInfo.position.lon}
            />
          </div>
        </Popup>
      )}
    </Map>
  );
}
