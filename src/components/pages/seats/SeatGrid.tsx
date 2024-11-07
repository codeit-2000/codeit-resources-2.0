import ScrollProvider from "@/components/Layout/ScrollProvider";
import useTabDrag from "@/components/commons/Tab/useTabDrag";
import { containerRefAtom } from "@/store/scrollAtom";
import { useAtomValue } from "jotai";

import SeatButton from "./SeatButton";
import useGetAllSeatsData from "./hooks/useGetAllSeatsData";
import type { SeatData } from "./types";

export default function SeatGrid() {
  const allSeatsData = useGetAllSeatsData();

  const containerRef = useAtomValue(containerRefAtom);
  const { handleMouseDown, handleMouseMove, handleMouseUpOrLeave } =
    useTabDrag(containerRef);

  return (
    <ScrollProvider>
      {/* eslint-disable-next-line */}
      <div
        className="mb-200 overflow-x-hidden md:mx-60 md:mb-0"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseUp={handleMouseUpOrLeave}
      >
        <div className="mx-16 my-28 grid w-[668px] auto-rows-auto grid-cols-2 gap-40 md:my-70 md:w-[1004px] xl:flex-shrink-0">
          <SeatBlock seatsData={allSeatsData.A} />
          <SeatBlock seatsData={allSeatsData.B} />
          <SeatBlock seatsData={allSeatsData.C} />
          <SeatBlock seatsData={allSeatsData.D} />
          <SeatBlock seatsData={allSeatsData.E} />
          <SeatBlock seatsData={allSeatsData.F} />
          <SeatBlock seatsData={allSeatsData.G} />
          <SeatBlock seatsData={allSeatsData.H} />
          <SeatBlock seatsData={allSeatsData.I} />
          <SeatBlock seatsData={allSeatsData.J} />
        </div>
      </div>
    </ScrollProvider>
  );
}

function SeatBlock({ seatsData }: { seatsData: SeatData[] }) {
  return (
    <div className="flex w-324 flex-wrap gap-6 md:w-482 md:gap-8">
      {seatsData.map(({ name, status, participant }) =>
        status === "enable" ? (
          <SeatButton key={name} name={name} status={status} />
        ) : (
          <SeatButton
            key={name}
            name={name}
            status={status}
            participant={participant}
          />
        ),
      )}
    </div>
  );
}
