import useToast from "@/hooks/useToast";
import { getSeatValidReservationList } from "@/lib/api/amplify/reservation";
import {
  checkUserFixedSeat,
  deleteSeatResourceStatus,
  editResource,
  getResourceListByName,
} from "@/lib/api/amplify/resource";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useDrawerContext } from "../context/drawer";
import { FormValue } from "../types";

export default function useSeatsAction({
  seatName: name,
}: {
  seatName?: string;
} = {}) {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { setIsOpen, seatInfo, setSeatInfo } = useDrawerContext();

  const editMutation = useMutation({
    mutationFn: async ({ seatStatus, participant }: FormValue) => {
      if (!seatInfo) throw new Error("Seat information is missing");

      const { data: reservationArray } = await getSeatValidReservationList();
      reservationArray.forEach((reservation) => {
        if (reservation.resourceName === seatInfo.name) {
          throw new Error("이미 좌석이 예약되어 있습니다");
        }
      });

      if (seatStatus === "fixed") {
        const prevSeatId = await checkUserFixedSeat(participant as string);
        if (prevSeatId) await deleteSeatResourceStatus(prevSeatId);

        await editResource({
          id: seatInfo.resourceId,
          resourceStatus: seatStatus,
          owner: seatStatus === "fixed" ? (participant as string) : undefined,
        });
      } else {
        await editResource({
          id: seatInfo.resourceId,
          resourceStatus: seatStatus,
        });
      }
    },
    onSuccess: () => {
      success("좌석이 수정되었습니다");
    },
    onError: (err) => {
      if (err.message === "이미 좌석이 예약되어 있습니다") error(err.message);
      else error("좌석 수정이 실패하였습니다");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["seats-admin"] });
      setSeatInfo(null);
      setIsOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!name) throw new Error("Name prop is required for deletion");

      const { data: resources } = await getResourceListByName(name);
      return deleteSeatResourceStatus(resources[0].id);
    },
    onSuccess: () => {
      success("좌석이 수정되었습니다");
      queryClient.invalidateQueries({
        queryKey: ["seats-admin"],
      });
    },
    onError: () => {
      error("좌석 수정이 실패했습니다");
    },
  });

  return { editMutation, deleteMutation };
}
