import pickedDateAtom from "@/components/pages/meeting-rooms/context/pickedDate";
import useModal from "@/hooks/useModal";
import useToast from "@/hooks/useToast";
import { Reservation, ResourceType, User } from "@/lib/api/amplify/helper";
import {
  cancelReservation,
  deleteSeatReservation,
} from "@/lib/api/amplify/reservation";
import { userAtom } from "@/store/authUserAtom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

const useDashboardAction = (
  reservation: Reservation,
): Record<ResourceType, () => void> => {
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { openModal, closeModal } = useModal();
  const pickedDate = useAtomValue(pickedDateAtom);

  const deleteSeatMutation = useMutation({
    mutationFn: async () => {
      if (reservation.id) return deleteSeatReservation(reservation.id);
      return null;
    },
    onSuccess: () => {
      success("좌석이 반납되었습니다");
      queryClient.invalidateQueries({
        queryKey: ["seats"],
      });
    },
    onError: () => {
      error("좌석 반납이 실패했습니다");
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: async () => {
      if (reservation.id) return cancelReservation(reservation, user as User);
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["roomReservations", pickedDate],
      });
      success("회의가 종료 되었습니다");
    },
    onError: () => {
      error("회의 종료에 실패했습니다");
    },
  });

  return {
    SEAT: () => {
      openModal("deleteSeatReservationModal", {
        onConfirm: () => {
          deleteSeatMutation.mutate();
          closeModal();
        },
      });
    },

    ROOM: () => {
      openModal("deleteRoomReservationModal", {
        onConfirm: () => {
          deleteRoomMutation.mutate();
          closeModal();
        },
      });
    },

    EQUIPMENT: () => {},
  };
};

export default useDashboardAction;
