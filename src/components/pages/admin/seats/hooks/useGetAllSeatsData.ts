import { getSeatValidReservationList } from "@/lib/api/amplify/reservation";
import { getSeatResourceListByResourceStatus } from "@/lib/api/amplify/resource";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { SeatData } from "../types";

const ALL_SEATS = {
  A: ["A0", "A1", "A2", "A3"],
  B: ["B0", "B1", "B2", "B3", "B4"],
  C: ["C0", "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9"],
  D: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9"],
  E: ["E0", "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"],
  F: ["F0", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9"],
  G: ["G0", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9"],
  H: ["H0", "H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9"],
  I: ["I0", "I1", "I2", "I3", "I4"],
  J: ["J0", "J1", "J2", "J3", "J4"],
};

const initializeAllSeatsData = () =>
  Object.fromEntries(
    Object.entries(ALL_SEATS).map(([row, seats]) => [
      row,
      seats.map(
        (seat) =>
          ({
            name: seat,
            status: "enable",
          }) as SeatData,
      ),
    ]),
  );

export default function useGetAllSeatsData() {
  const [allSeatsData, setAllSeatsData] = useState(() =>
    initializeAllSeatsData(),
  );

  const { data } = useQuery({
    queryKey: ["seats-admin"],
    queryFn: async () => {
      const [
        { data: reservationArray },
        { data: disabledResourceArray },
        { data: fixedResourceArray },
      ] = await Promise.all([
        getSeatValidReservationList(),
        getSeatResourceListByResourceStatus("DISABLED"),
        getSeatResourceListByResourceStatus("FIXED"),
      ]);

      return { reservationArray, disabledResourceArray, fixedResourceArray };
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (!data) return;

    const { reservationArray, disabledResourceArray, fixedResourceArray } =
      data;
    const updatedAllSeatsData = initializeAllSeatsData();

    // 고정 좌석에 대한 데이터를 정렬합니다.
    fixedResourceArray.forEach((resource) => {
      const { resourceSubtype, name, owner } = resource;

      if (updatedAllSeatsData[resourceSubtype as string]) {
        const seatIndex = updatedAllSeatsData[
          resourceSubtype as string
        ].findIndex((seat) => seat.name === name);

        if (seatIndex !== -1) {
          updatedAllSeatsData[resourceSubtype as string][seatIndex].status =
            "fixed";
          updatedAllSeatsData[resourceSubtype as string][
            seatIndex
          ].participant = owner as string;
        }
      }
    });

    // 사용 불가 좌석에 대한 데이터를 정렬합니다.
    disabledResourceArray.forEach((resource) => {
      const { resourceSubtype, name } = resource;

      if (updatedAllSeatsData[resourceSubtype as string]) {
        const seatIndex = updatedAllSeatsData[
          resourceSubtype as string
        ].findIndex((seat) => seat.name === name);

        if (seatIndex !== -1) {
          updatedAllSeatsData[resourceSubtype as string][seatIndex].status =
            "disabled";
        }
      }
    });

    // 예약이 된 좌석 대한 데이터를 정렬합니다.
    reservationArray.forEach((reservation) => {
      const { resourceSubtype, resourceName } = reservation;

      if (updatedAllSeatsData[resourceSubtype as string]) {
        const seatIndex = updatedAllSeatsData[
          resourceSubtype as string
        ].findIndex((seat) => seat.name === resourceName);

        if (seatIndex !== -1) {
          updatedAllSeatsData[resourceSubtype as string][seatIndex].status =
            "confirmed";
        }
      }
    });

    setAllSeatsData(updatedAllSeatsData);
  }, [data]);

  return allSeatsData;
}
