import Badge from "@/components/commons/Badge";
import Tab from "@/components/commons/Tab";
import {
  formatDate,
  formatDayToISO,
  getTodayAndTomorrow,
} from "@/lib/utils/timeUtils";
import clsx from "clsx";
import { useSetAtom } from "jotai";
import { useRouter } from "next/router";

import pickedDateAtom from "./context/pickedDate";
import useDefaultDate from "./hooks/useDefaultDate";

export default function Header() {
  const setPickedDate = useSetAtom(pickedDateAtom);
  const router = useRouter();
  const { query } = router;
  const defaultDate = useDefaultDate();
  const dateArray = getTodayAndTomorrow();

  const handleTabItemClick = (day: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...query, date: day },
    });

    setPickedDate(formatDayToISO(day));
  };

  return (
    <header className="border-b border-gray-100-opacity-20 bg-white pl-16 pt-62 md:pl-64 md:pt-24">
      <h1 className="text-24-700 md:text-28-700">좌석 예약</h1>

      <Tab defaultIndex={defaultDate} className="gap-24 md:mt-24">
        {({ activeIndex, handleClick }) =>
          dateArray.map((day) => (
            <TabItem
              key={day}
              day={day}
              activeIndex={activeIndex}
              onClick={() => {
                handleClick(day);
                handleTabItemClick(day);
              }}
            />
          ))
        }
      </Tab>
    </header>
  );
}

interface TabItemProps {
  day: string;
  activeIndex: string | number;
  onClick: () => void;
}

function TabItem({ day, activeIndex, onClick }: TabItemProps) {
  return (
    <div key={day}>
      {day === formatDate(new Date()) && <Badge variant="primary">오늘</Badge>}
      <button
        type="button"
        className={clsx("block", {
          "border-b-2 border-purple-90 pb-16 font-semibold text-purple-90 transition-colors duration-300 ease-in-out":
            day === activeIndex,
          "pb-18": day !== activeIndex,
        })}
        onClick={onClick}
      >
        {day}
      </button>
    </div>
  );
}
