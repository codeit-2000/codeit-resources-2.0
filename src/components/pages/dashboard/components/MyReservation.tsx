import { RESOURCE_LABELS } from "@/constants/common";
import { Reservation, ResourceType } from "@/lib/api/amplify/helper";

import EmptyReservation from "./EmptyReservation";
import ReservationCard from "./ReservationCard";

const RESOURCE_INFO: Record<ResourceType, Record<string, string>> = {
  ROOM: {
    subTitle: "오늘의 회의 일정을 확인해보세요 ;)",
  },
  SEAT: {
    subTitle: "오늘의 좌석을 확인하세요",
  },
  EQUIPMENT: {
    subTitle: "오늘의 장비 대여 일정을 확인해보세요",
  },
};

function MyReservation({
  resourceType,
  reservationList,
}: {
  resourceType: ResourceType;
  reservationList: Reservation[];
}) {
  return (
    <section className="mb-80 flex flex-col gap-16">
      <h1 className="text-28-700 text-gray-100">
        내 {RESOURCE_LABELS[resourceType]}
        <span className="ml-12 text-14-500 text-gray-70">
          {RESOURCE_INFO[resourceType].subTitle}
        </span>
      </h1>
      <span className="h-1 w-full border-b-[1px] border-gray-100-opacity-10" />
      <div className="flex scroll-m-2 gap-16 overflow-x-auto pb-16">
        {reservationList.length === 0 ? (
          <EmptyReservation resourceType={resourceType} />
        ) : (
          reservationList?.map((reservation: Reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              isDetailed={resourceType === "ROOM"}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default MyReservation;
