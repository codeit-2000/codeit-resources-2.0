import useToast from "@/hooks/useToast";
import {
  createSeatReservation,
  deleteSeatReservation,
  moveSeatReservation,
} from "@/lib/api/amplify/reservation";
import { getResourceListByName } from "@/lib/api/amplify/resource";
import { userAtom } from "@/store/authUserAtom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import mySeatInfoAtom from "../context/mySeatInfo";
import pickedDateAtom from "../context/pickedDate";

export default function useSeatsAction({
  seatName: name,
}: {
  seatName: string;
}) {
  const queryClient = useQueryClient();
  const pickedDate = useAtomValue(pickedDateAtom);
  const userData = useAtomValue(userAtom);
  const mySeatInfo = useAtomValue(mySeatInfoAtom);
  const { success, error } = useToast();

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data: resources } = await getResourceListByName(name);
      const [resource] = resources;

      if (!userData) return null;
      if (mySeatInfo?.status === "fixed") {
        throw new Error("이미 고정된 좌석이 있습니다");
      }

      if (mySeatInfo?.status === "confirmed") {
        return moveSeatReservation({
          id: mySeatInfo.reservationId,
          resourceId: resource.id,
          resourceName: name,
          resourceSubtype: resource.resourceSubtype as string,
        });
      }

      if (resource.resourceStatus === "FIXED") {
        throw new Error("이미 고정된 좌석이 있습니다");
      }
      if (resource.resourceStatus === "DISABLED") {
        throw new Error("사용 불가 좌석입니다");
      }

      return createSeatReservation({
        resourceId: resource.id,
        resourceName: name,
        resourceSubtype: resource.resourceSubtype as string,
        date: pickedDate,
        participant: userData.id,
      });
    },
    onSuccess: () => {
      success("좌석 예약이 성공되었습니다");
    },
    onError: (err) => {
      if (err.message === "이미 고정된 좌석이 있습니다") error(err.message);
      else if (err.message === "이미 좌석이 예약되어있습니다") {
        error(err.message);
      } else error("좌석 예약이 실패했습니다");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["seats", pickedDate],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (mySeatInfo?.reservationId)
        return deleteSeatReservation(mySeatInfo.reservationId);
      return null;
    },
    onSuccess: () => {
      success("좌석이 반납되었습니다");
      queryClient.invalidateQueries({
        queryKey: ["seats", pickedDate],
      });
    },
    onError: () => {
      error("좌석 반납이 실패했습니다");
    },
  });

  return { createMutation, deleteMutation };
}
