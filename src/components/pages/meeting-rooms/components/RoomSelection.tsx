import TimeLine from "@/components/pages/meeting-rooms/components/TimeLine/TimeLine";
import useIsMobile from "@/hooks/useIsMobile";
import { Reservation, Resource } from "@/lib/api/amplify/helper";
import { isOpenDrawerAtom } from "@/store/isOpenDrawerAtom";
import clsx from "clsx";
import { useAtom, useAtomValue } from "jotai";
import { useRef } from "react";

import pickedReservationAtom from "../context/pickedReservation";

interface RoomSelectionProps {
  subType: string;
  roomList: Resource[];
  isFirstGroup?: boolean;
  reservations?: Reservation[];
}

function RoomSelection({
  subType,
  roomList,
  isFirstGroup = false,
  reservations = [],
}: RoomSelectionProps) {
  const [pickedReservation, setPickedReservation] = useAtom(
    pickedReservationAtom,
  );

  const isOpenDrawer = useAtomValue(isOpenDrawerAtom);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLUListElement>(null);

  const handleRoomClick = (room: string) => {
    setPickedReservation({
      ...pickedReservation,
      resourceName: room,
    });
  };

  return (
    <>
      <h3
        className={clsx(
          "mb-16 text-14-500 text-gray-100-opacity-50",
          !isMobile && "mt-32",
        )}
      >
        <span className="md:absolute md:-translate-x-[128px] md:-translate-y-full">
          {subType}
        </span>
      </h3>
      <ul
        ref={containerRef}
        className="flex flex-col overflow-x-auto overflow-y-hidden pb-24 md:overflow-visible"
      >
        {roomList.map((room, index) => (
          <li
            key={room.name}
            className="group flex flex-col md:h-75 md:flex-row md:items-center"
          >
            <button
              type="button"
              onClick={() => handleRoomClick(room.name)}
              className={clsx(
                "flex h-48 w-max min-w-80 cursor-pointer items-center justify-center rounded-8 border-[1px] px-16 text-16-500 md:absolute md:h-59 md:min-w-128 md:-translate-x-full",
                {
                  "bg-purple-80 text-gray-0":
                    pickedReservation?.resourceName === room.name &&
                    isOpenDrawer,
                  "border-gray-100-opacity-10 text-gray-100-opacity-80": !(
                    pickedReservation?.resourceName === room.name &&
                    isOpenDrawer
                  ),
                  "group-hover:bg-gray-80 group-hover:text-gray-0": !(
                    pickedReservation?.resourceName === room.name &&
                    isOpenDrawer
                  ),
                },
              )}
            >
              {room.name}
            </button>
            <TimeLine
              isHeaderShow={
                isMobile || (!isMobile && isFirstGroup && index === 0)
              }
              room={room}
              reservations={reservations}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

export default RoomSelection;
