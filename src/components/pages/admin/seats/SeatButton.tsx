import useModal from "@/hooks/useModal";
import useToast from "@/hooks/useToast";
import {
  deleteSeatResourceStatus,
  getResourceListByName,
} from "@/lib/api/amplify/resource";
import { getUserData } from "@/lib/api/amplify/user";
import DeleteButton from "@public/icons/icon-delete-button.svg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

import { useDrawerContext } from "./context/drawer";

interface Props {
  name: string;
  status: "fixed" | "enable" | "disabled" | "confirmed";
  participant?: string;
}

export default function SeatButton({ name, status, participant }: Props) {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { openModal, closeModal } = useModal();
  const {
    setIsOpen: setDrawerOpen,
    setSeatInfo,
    seatInfo,
  } = useDrawerContext();

  const { data: seatOwnerResponse } = useQuery({
    queryKey: ["seat-button", name],
    queryFn: () => {
      if (participant) return getUserData(participant);
      return null;
    },
    enabled: !!participant,
    staleTime: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
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

  const handleClick = async () => {
    const { data: resources } = await getResourceListByName(name);

    if (status === "enable" || status === "disabled") {
      setSeatInfo({
        resourceId: resources[0].id,
        status,
        name,
      });
    }

    if (status === "fixed" && participant) {
      setSeatInfo({
        resourceId: resources[0].id,
        status,
        participant,
        name,
      });
    }

    setDrawerOpen(true);
  };

  const handleDeleteButtonClick = () => {
    openModal("deleteResourceStatusModal", {
      onConfirm: () => {
        deleteMutation.mutate();
        closeModal();
      },
    });
  };

  const classnames = clsx(
    "rounded-3 border-gray-100-opacity-20 text-12 md:text-16 md:w-90 relative h-36 w-60 border px-10 transition-colors duration-300 disabled:cursor-not-allowed md:h-48",
    {
      "bg-white hover:outline-gray-100-opacity-100 hover:outline hover:outline-1 text-gray-30 hover:text-gray-70":
        status === "enable",
      "bg-[#3332360D] overflow-hidden hover:outline-gray-100-opacity-100 hover:outline hover:outline-1":
        status === "disabled",
      "bg-[#413B541A] text-gray-100-opacity-30 truncate hover:outline-gray-100-opacity-100 hover:outline hover:outline-1":
        status === "fixed",
      "outline-gray-100-opacity-100 outline outline-1": seatInfo?.name === name,
      "bg-[#D6173A4D] border border-[#D6173A] text-[#D6173A80] hover:outline-none":
        status === "confirmed",
    },
  );

  return (
    <div className="group relative">
      <button
        type="button"
        className={classnames}
        onClick={handleClick}
        disabled={status === "confirmed"}
      >
        {status === "fixed" && seatOwnerResponse?.data?.username}
        {status === "disabled" && (
          <div className="absolute inset-0 h-1 w-[200%] origin-top-left rotate-[29.5deg] transform bg-gray-300 md:rotate-[27deg]" />
        )}
        {status === "confirmed" && "예약"}
        {status === "enable" && name}
      </button>
      {status !== "enable" && status !== "confirmed" && (
        <DeleteButton
          className="absolute -right-8 -top-8 z-10 hidden cursor-pointer group-hover:block"
          onClick={handleDeleteButtonClick}
        />
      )}
    </div>
  );
}
