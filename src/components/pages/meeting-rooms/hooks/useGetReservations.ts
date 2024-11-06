import { getReservationListByResourceType } from "@/lib/api/amplify/reservation";
import { getResourceList } from "@/lib/api/amplify/resource";
import { getTeamListData } from "@/lib/api/amplify/team";
import { getUserListData } from "@/lib/api/amplify/user";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import pickedDateAtom from "../context/pickedDate";

export const useGetReservations = () => {
  const pickedDate = useAtomValue(pickedDateAtom);

  const [
    { data: rooms },
    { data: roomReservations },
    { data: users },
    { data: teams },
  ] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["roomList", pickedDate],
        staleTime: 5 * 60 * 1000,
        queryFn: () => getResourceList({ resourceType: "ROOM" }),
      },
      {
        queryKey: ["roomReservations", pickedDate],
        staleTime: 5 * 60 * 1000,
        queryFn: () =>
          getReservationListByResourceType("ROOM", {
            date: { eq: pickedDate },
            status: { eq: "CONFIRMED" },
          }),
      },
      {
        queryKey: ["users", "0", "alphabetical"],
        staleTime: 5 * 60 * 1000,
        queryFn: () => getUserListData("0", "alphabetical"),
      },
      {
        queryKey: ["teams"],
        staleTime: 5 * 60 * 1000,
        queryFn: getTeamListData,
      },
    ],
  });

  return { rooms, roomReservations, users, teams };
};
