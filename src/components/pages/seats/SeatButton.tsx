import useModal from "@/hooks/useModal";
import { getUserData } from "@/lib/api/amplify/user";
import IconXButton from "@public/icons/icon-x-button.svg";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { memo } from "react";

import mySeatInfoAtom from "./context/mySeatInfo";
import useSeatsAction from "./hooks/useSeatsAction";

interface Props {
  name: string;
  status: "fixed" | "confirmed" | "enable" | "disabled";
  participant?: string;
}

function SeatButton({ name, status, participant }: Props) {
  const { openModal, closeModal } = useModal();
  const mySeatInfo = useAtomValue(mySeatInfoAtom);

  const { data: seatOwnerResponse } = useQuery({
    queryKey: ["seat-button", name],
    queryFn: () => {
      if (participant) return getUserData(participant);
      return null;
    },
    enabled: !!participant,
    staleTime: 0,
  });

  const { createMutation, deleteMutation } = useSeatsAction({ seatName: name });

  const handleClick = () => {
    openModal("moveSeatConfirm", {
      onConfirm: () => {
        createMutation.mutate();
        closeModal();
      },
    });
  };

  const handleIconXClick = () => {
    openModal("deleteSeatReservationModal", {
      onConfirm: () => {
        deleteMutation.mutate();
        closeModal();
      },
    });
  };

  const classnames = clsx(
    "rounded-3 relative border-gray-100-opacity-20 text-12 md:text-16 md:w-90 px-10 h-36 w-60 border focus:bg-[#E9CCFF] hover:enabled:bg-[#E9CCFF] disabled:cursor-not-allowed md:h-48 transition-colors duration-300",
    {
      "bg-white text-gray-30 hover:text-white": status === "enable",
      "bg-[#3332360D] overflow-hidden": status === "disabled",
      "bg-[#413B541A] text-gray-100-opacity-30 truncate":
        status === "fixed" || status === "confirmed",
      "bg-purple-60 text-white": mySeatInfo?.seatName === name,
    },
  );

  return (
    <div className="group relative">
      <button
        type="button"
        disabled={
          status === "confirmed" || status === "fixed" || status === "disabled"
        }
        className={classnames}
        onClick={handleClick}
      >
        {(status === "fixed" || status === "confirmed") &&
          seatOwnerResponse?.data?.username}
        {status === "disabled" && (
          <div className="absolute inset-0 h-1 w-[200%] origin-top-left rotate-[29.5deg] transform bg-gray-300 md:rotate-[27deg]" />
        )}
        {status === "enable" && name}
      </button>
      {mySeatInfo?.seatName === name && status !== "fixed" && (
        <IconXButton
          className="absolute -right-8 -top-8 z-10 hidden cursor-pointer group-hover:block"
          onClick={handleIconXClick}
        />
      )}
    </div>
  );
}

export default memo(SeatButton);
