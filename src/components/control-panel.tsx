"use client";

import { Result } from "@/types/EvStation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@heroui/drawer";
import { Button, useDisclosure } from "@heroui/react";
import { RadioGroup, Radio } from "@heroui/radio";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Menu } from "lucide-react";

type ControlPanelProps = {
  evStations: Result[];
  onSelectStation: (
    station: { longitude: number; latitude: number },
    index: number
  ) => void;
  selectedIndex: number | null;
  isPinging: boolean;
};

export default function ControlPanel({
  evStations,
  onSelectStation,
  selectedIndex,
  isPinging,
}: ControlPanelProps) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const handleStationSelect = (value: string) => {
    const index = parseInt(value);
    const station = evStations[index];

    onSelectStation(
      {
        longitude: station.position.lon,
        latitude: station.position.lat,
      },
      index
    );

    onClose();
  };

  return (
    <>
      <Button color="primary" onPress={onOpen} className="absolute right-4 top-4 z-20">
        <Menu className="w-4 h-4"/>
      </Button>

      <Drawer
        backdrop="transparent"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xs"
      >
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                สถานีชาร์จ
              </DrawerHeader>
              <DrawerBody>
                <ScrollShadow className="w-full max-w-md">
                  <RadioGroup
                    label="เลือกสถานีชาร์จ"
                    value={selectedIndex?.toString()}
                    onValueChange={handleStationSelect}
                  >
                    {evStations.map((station, index) => (
                      <div
                        key={`station-${index}`}
                        className={`flex items-center space-x-2 rounded-lg p-4 transition-all duration-300 ${
                          selectedIndex === index
                            ? isPinging
                              ? "bg-blue-100/50 shadow-md"
                              : "bg-blue-50/50"
                            : "hover:bg-gray-50"
                        } ${index !== evStations.length - 1 ? "mb-2" : ""}`}
                      >
                        <Radio
                          value={index.toString()}
                          id={`station-${index}`}
                          className="data-[state=checked]:border-blue-500"
                          description={`ระยะทาง: ${station.dist.toFixed(
                            2
                          )} กม.`}
                        >
                          <label
                            htmlFor={`station-${index}`}
                            className="flex-1 cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {station.poi.name}
                          </label>
                        </Radio>
                      </div>
                    ))}
                  </RadioGroup>
                </ScrollShadow>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
