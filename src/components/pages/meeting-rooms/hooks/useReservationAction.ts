import useModal from "@/hooks/useModal";
import useToast from "@/hooks/useToast";
import { Reservation, User } from "@/lib/api/amplify/helper";
import {
  cancelReservation,
  createReservation,
  updateReservation,
} from "@/lib/api/amplify/reservation";
import { userAtom } from "@/store/authUserAtom";
import { isOpenDrawerAtom } from "@/store/isOpenDrawerAtom";
import { sendEmail } from "@/utils/sendMail";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";

import pickedDateAtom from "../context/pickedDate";

const useReservationAction = (reservation?: Reservation) => {
  const user = useAtomValue(userAtom);
  const pickedDate = useAtomValue(pickedDateAtom);
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { openModal, closeModal } = useModal();
  const setIsOpenDrawer = useSetAtom(isOpenDrawerAtom);

  const deleteRoomMutation = useMutation({
    mutationFn: async () => {
      if (reservation?.id)
        return cancelReservation(reservation || {}, {
          id: user?.id || "",
          role: user?.role,
        });
      return null;
    },
    onSuccess: () => {
      success("회의실 예약이 취소되었습니다");
      queryClient.invalidateQueries({
        queryKey: ["rooms", pickedDate],
      });
      queryClient.invalidateQueries({
        queryKey: ["roomReservations", pickedDate],
      });
    },
    onError: () => {
      error("회의실 예약 취소에 실패했습니다");
    },
  });

  // 회의실 예약 생성
  const createRoomMutation = useMutation({
    mutationFn: (re: Reservation) => createReservation(re),
    onSuccess: (re) => {
      success("회의실 예약이 생성되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["rooms", pickedDate],
      });
      queryClient.invalidateQueries({
        queryKey: ["roomReservations", pickedDate],
      });

      if (!user || !re.data) return;
      sendEmail(
        [user.email],
        "[Codeit Resources] 회의실 예약 일정입니다.",
        re.data.resourceName,
        re.data.date,
        `${re.data.startTime}-${re.data.endTime}`,
      );
    },
    onError: () => {
      error("회의실 예약 생성에 실패했습니다.");
    },
  });

  // 회의실 예약 업데이트
  const updateRoomMutation = useMutation({
    mutationFn: async (re: Reservation) => {
      if (re.id) {
        return updateReservation(re, user as User);
      }
      return null;
    },
    onSuccess: () => {
      success("회의실 예약이 업데이트되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["rooms", pickedDate],
      });
      queryClient.invalidateQueries({
        queryKey: ["roomReservations", pickedDate],
      });
    },
    onError: () => {
      error("회의실 예약 업데이트에 실패했습니다.");
    },
  });

  return {
    deleteRoomMutation: () => {
      openModal("deleteRoomReservationModal", {
        onConfirm: () => {
          deleteRoomMutation.mutate();
          closeModal();
        },
      });
    },
    createRoomMutation: (re: Reservation) => {
      openModal("createRoomReservationModal", {
        onConfirm: () => {
          createRoomMutation.mutate(re);
          closeModal();
          setIsOpenDrawer(false);
        },
      });
    },
    updateRoomMutation: (re: Reservation) => {
      openModal("updateRoomReservationModal", {
        onConfirm: () => {
          updateRoomMutation.mutate(re);
          closeModal();
          setIsOpenDrawer(false);
        },
      });
    },
  };
};

export default useReservationAction;
