import useAutoUpdateDate from "@/hooks/useAutoUpdateDate";
import { Reservation, ResourceType } from "@/lib/api/amplify/helper";
import { getReservationListByResourceType } from "@/lib/api/amplify/reservation";
import { getSeatResourceListByResourceStatus } from "@/lib/api/amplify/resource";
import { convertTimeToMinutes } from "@/lib/utils/timeUtils";
import { userAtom } from "@/store/authUserAtom";
import { getCurrentTime } from "@/utils/createTime";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";

type ReservationData = Record<ResourceType, Reservation[]>;

export const useGetUserReservation = () => {
  const currentDate = useAutoUpdateDate();

  const [userReservations, setUserReservations] =
    useState<ReservationData | null>(null);
  const user = useAtomValue(userAtom);

  const getTodayUserReservation = useCallback(
    async (resourceType: ResourceType) => {
      const currentTime = getCurrentTime();

      const filter = {
        status: { eq: "CONFIRMED" },
        date: { eq: currentDate },
        endTime: { gt: currentTime },
        participants: { contains: user?.id },
      };

      const response = await getReservationListByResourceType(
        resourceType,
        filter,
      );

      if (response.errors) {
        throw new Error("Failed to fetch user reservations");
      }
      return response.data;
    },
    [user?.id, currentDate],
  );

  /* useSuspenseQueries에서 useQueries로 바꾸니까 타입오류나서 임의로 빈 배열 넣어놨어요 */
  const [
    // { data: roomReservation },
    // { data: seatReservation },
    // { data: fixedSeats },
    // { data: equipmentReservation },
    { data: roomReservation = [] },
    { data: seatReservation = [] },
    { data: fixedSeats = { data: [] } },
    { data: equipmentReservation = [] },
  ] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["rooms", currentDate, "userRoomReservations", user?.id],
        staleTime: 5 * 60 * 1000,
        queryFn: () => getTodayUserReservation("ROOM"),
      },
      {
        queryKey: ["seats", currentDate, "userSeatReservations", user?.id],
        staleTime: 5 * 60 * 1000,
        queryFn: () => getTodayUserReservation("SEAT"),
      },
      {
        queryKey: ["fixedSeats", currentDate, "userSeatReservations", user?.id],
        staleTime: 5 * 60 * 1000,
        queryFn: () => getSeatResourceListByResourceStatus("FIXED"),
      },
      {
        queryKey: [currentDate, "userEquipmentReservations", user?.id],
        staleTime: 5 * 60 * 1000,
        queryFn: () => getTodayUserReservation("EQUIPMENT"),
      },
    ],
  });

  const userFixedSeat = fixedSeats.data.filter(
    ({ owner }) => owner === user?.id,
  );

  const userFixedSeatReservation = [
    {
      id: "None",
      resourceId: "None",
      resourceType: "SEAT" as ResourceType,
      resourceSubtype: userFixedSeat[0]?.resourceSubtype,
      resourceName: userFixedSeat[0]?.name,
      resource: userFixedSeat[0] || {},
      startTime: "00:00",
      endTime: "24:00",
      status: "CONFIRMED",
      participants: [userFixedSeat[0]?.owner],
      date: "고정 좌석",
      createdAt: "",
      updatedAt: "",
    },
  ];

  const sortedRoomReservations = roomReservation?.sort(
    (a, b) =>
      (convertTimeToMinutes(a?.startTime) as number) -
      (convertTimeToMinutes(b?.startTime) as number),
  );

  useEffect(() => {
    setUserReservations({
      ROOM: sortedRoomReservations || [],
      // eslint-disable-next-line
      // @ts-ignore
      SEAT: userFixedSeat.length ? userFixedSeatReservation : seatReservation,
      EQUIPMENT: equipmentReservation || [],
    });
  }, [roomReservation, seatReservation, fixedSeats, equipmentReservation]);

  return { userReservations };
};
