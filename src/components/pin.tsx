"use client";

import * as React from "react";
import Image from "next/image";
type PinProps = {
  size?: number;
  isSelected?: boolean;
  isPinging?: boolean;
  providerName: string;
};

const getIconUrl = (name: string) => {
  if (name.includes("PluZ")) {
    return "/pluz.png";
  } else if (name.includes("Sharge")) {
    return "/sharge.png";
  } else if (name.includes("Shell")) {
    return "/shell.jpg";
  } else if (name.includes("ON-ION")) {
    return "/onion.png";
  } else if (name.includes("Altervim")) {
    return "/altervim.jpg";
  } else if (name.includes("EA Anywhere")) {
    return "/ea-anywhere.png";
  } else if (name.includes("MG")) {
    return "/mg.png";
  } else if (name.includes("Charge+")) {
    return "/chargeplus.png";
  } else if (name.includes("MEA EV")) {
    return "/mea-ev.png";
  } else if (name.includes("Q Charge")) {
    return "/qcharge.png";
  } else if (name.includes("Evolt")) {
    return "/evolt.jpeg";
  } else if (name.includes("HAUP")) {
    return "/haup.png";
  } else if (name.includes("EleXA")) {
    return "/elexa.png";
  } else if (name.includes("PEA VOLTA")) {
    return "/pea.png";
  } else if (name.includes("Noodoe EV")) {
    return "/noodoe.png";
  } else if (name.includes("GINKA")) {
    return "/ginka.png";
  } else if (name.includes("OneCharge")) {
    return "/onecharge.jpeg";
  } else if (name.includes("Galvanic")) {
    return "/galvanic.png";
  } else {
    return "https://cdn4.iconfinder.com/data/icons/ev-charger-station/64/EV_Charger-electric_car-ecology-commercial_charging-energy-512.png";
  }
};

function Pin({ size = 32, isSelected, isPinging, providerName }: PinProps) {
  const iconSize = isSelected ? size * 1.1 : size;
  return (
    <div className="relative">
      <div
        className={`relative transform transition-all duration-300 ${
          isSelected ? "scale-110" : ""
        }`}
        style={{
          width: iconSize,
          height: iconSize,
        }}
      >
        <div className="relative h-full w-full">
          <Image
            src={getIconUrl(providerName)}
            alt={`${providerName} charging station`}
            fill
            sizes="(max-width: 48px) 100vw"
            priority
            className={`object-contain drop-shadow-md transition-all duration-300 ${
              isSelected ? "brightness-110 filter" : ""
            }`}
          />
        </div>
      </div>

      {/* Ping animation rings */}
      {isPinging && (
        <>
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full"
            style={{
              width: size * 2,
              height: size * 2,
              backgroundColor: "rgba(59, 130, 246, 0.5)",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full"
            style={{
              width: size * 1.5,
              height: size * 1.5,
              backgroundColor: "rgba(59, 130, 246, 0.3)",
            }}
          />
        </>
      )}
    </div>
  );
}

export default React.memo(Pin);
