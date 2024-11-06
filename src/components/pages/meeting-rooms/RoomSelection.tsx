import TimeLine from "@/components/pages/meeting-rooms/TimeLine";
import useIsMobile from "@/hooks/useIsMobile";
import { Reservation, Resource } from "@/lib/api/amplify/helper";
import { isOpenDrawerAtom } from "@/store/isOpenDrawerAtom";
import { activeRoomAtom } from "@/store/reservationAtom";
import { getCurrentTime } from "@/utils/createTime";
import clsx from "clsx";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef } from "react";

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
  const [activeRoom, setActiveRoom] = useAtom(activeRoomAtom);
  const isOpenDrawer = useAtomValue(isOpenDrawerAtom);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLUListElement>(null);
  const prevIsMobile = useRef(isMobile);

  const handleRoomClick = (room: string) => {
    setActiveRoom(room);
  };

  const scrollToCurrentTime = () => {
    if (isMobile || !containerRef.current) return;

    const currentTime = getCurrentTime();
    const [currentHour, currentMinute] = currentTime.split(":").map(Number);
    const currentSlotIndex = currentHour * 2 + (currentMinute >= 30 ? 1 : 0);

    const slotWidth = 72;
    const scrollPosition = currentSlotIndex * slotWidth;

    const containerWidth = containerRef.current.clientWidth;
    const centerOffset = containerWidth / 2;

    const adjustedOffset = centerOffset - slotWidth * 4;

    containerRef.current.scrollLeft = Math.max(
      0,
      scrollPosition - adjustedOffset,
    );
  };

  useEffect(() => {
    if (!isMobile) {
      if (prevIsMobile.current || prevIsMobile.current === isMobile) {
        scrollToCurrentTime();
      }
    }
    prevIsMobile.current = isMobile;
  }, [isMobile]);

  return (
    <>
      <h3
        className={clsx(
          "mb-16 text-14-500 text-gray-100-opacity-50",
          !isMobile && "mt-32",
        )}
      >
        {subType}
      </h3>
      <ul
        ref={containerRef}
        className="flex flex-col overflow-x-auto overflow-y-hidden md:overflow-visible"
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
                "flex h-48 w-max min-w-80 cursor-pointer items-center justify-center rounded-8 border-[1px] text-16-500 md:h-59 md:min-w-128",
                {
                  "bg-purple-80 text-gray-0":
                    activeRoom === room.name && isOpenDrawer,
                  "border-gray-100-opacity-10 text-gray-100-opacity-80": !(
                    activeRoom === room.name && isOpenDrawer
                  ),
                  "group-hover:bg-gray-80 group-hover:text-gray-0": !(
                    activeRoom === room.name && isOpenDrawer
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
