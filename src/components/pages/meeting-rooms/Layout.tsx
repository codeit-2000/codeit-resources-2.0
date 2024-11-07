import ChevronLeft from "@/../public/icons/icon-chevron-left.svg";
import ChevronRight from "@/../public/icons/icon-chevron-right.svg";
import Badge from "@/components/commons/Badge";
import Tab from "@/components/commons/Tab";
import getDaysUntilEndOfMonth, {
  getDaysUntilEndOfMonthType,
} from "@/lib/utils/getDaysUntilEndOfMonth";
import { todayDateAtom } from "@/store/todayDateAtom";
import clsx from "clsx";
import dayjs from "dayjs";
import { PrimitiveAtom, useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

import ScrollProvider from "./ScrollProvider";
import pickedDateAtom from "./context/pickedDate";

interface DateState {
  year: number;
  month: number;
  daysData: getDaysUntilEndOfMonthType[];
}

function Header({ className }: { className?: string }) {
  const today = useAtomValue(todayDateAtom);
  const currentDaysData = getDaysUntilEndOfMonth(
    today.format("YYYY-MM-DD"),
  ).days;

  const [currentHeaderDate, setCurrentHeaderDate] = useState<DateState>({
    year: today.year(),
    month: today.month() + 1,
    daysData: currentDaysData,
  });
  const setPickedDate = useSetAtom(pickedDateAtom as PrimitiveAtom<string>);

  const isSameMonthAsToday = (
    year: number = currentHeaderDate.year,
    month: number = currentHeaderDate.month,
  ) => year === today.year() && month === today.month() + 1;

  const handlePrevButton = () => {
    setCurrentHeaderDate((prev) => {
      const prevDate = dayjs(
        `${prev.year}-${String(prev.month).padStart(2, "0")}-01`,
      ).subtract(1, "month");
      setPickedDate(
        currentDaysData
          ? today.format("YYYY-MM-DD")
          : prevDate.format("YYYY-MM-DD"),
      );
      return {
        year: prevDate.year(),
        month: prevDate.month() + 1,
        daysData: isSameMonthAsToday(prevDate.year(), prevDate.month() + 1)
          ? currentDaysData
          : getDaysUntilEndOfMonth(prevDate.format("YYYY-MM-DD")).days,
      };
    });
  };

  const handleNextButton = () => {
    setCurrentHeaderDate((prev) => {
      const nextDate = dayjs(
        `${prev.year}-${String(prev.month).padStart(2, "0")}-01`,
      ).add(1, "month");
      setPickedDate(nextDate.format("YYYY-MM-DD"));
      return {
        year: nextDate.year(),
        month: nextDate.month() + 1,
        daysData: getDaysUntilEndOfMonth(nextDate.format("YYYY-MM-DD")).days,
      };
    });
  };

  return (
    <header className={className}>
      <div className="flex">
        {/* 타이틀 */}
        <h1 className="mr-13 text-24-700 text-gray-100 md:mb-24 md:mr-24 md:text-28-700">
          회의실 예약
        </h1>
        <div>
          <button
            className={clsx(
              "text-14-500 disabled:cursor-not-allowed disabled:opacity-30",
            )}
            type="button"
            onClick={handlePrevButton}
            disabled={isSameMonthAsToday()}
          >
            <ChevronLeft />
          </button>
          <span className="mx-16 text-24-700 text-gray-100 md:text-28-700">{`${currentHeaderDate.year}년 ${currentHeaderDate.month}월`}</span>
          <button
            className="text-14-500"
            type="button"
            onClick={handleNextButton}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      {/* 탭 */}
      <Tab
        key={`${currentHeaderDate.year}-${currentHeaderDate.month}`}
        defaultIndex={0}
        className="gap-24 border-b border-gray-40"
      >
        {({ activeIndex, handleClick }) =>
          currentHeaderDate.daysData.map(({ id, day, weekday }, index) => (
            <div key={id}>
              {index === 0 && isSameMonthAsToday() ? (
                <Badge variant="primary">오늘</Badge>
              ) : (
                <div className="h-24 w-1" />
              )}
              <button
                type="button"
                className={clsx("block", {
                  "border-b-2 border-violet-800 pb-6 font-semibold text-violet-800":
                    index === activeIndex,
                  "pb-8": index !== activeIndex,
                })}
                onClick={() => {
                  handleClick(index);
                  // 선택된 탭의 날짜로 pickedDate 업데이트
                  setPickedDate(
                    `${currentHeaderDate.year}-${String(currentHeaderDate.month).padStart(2, "0")}-${day.padStart(2, "0")}`,
                  );
                }}
              >
                {day}일({weekday})
              </button>
            </div>
          ))
        }
      </Tab>
    </header>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollProvider>
      <div className="">
        <Header className="px-16 pt-64 md:px-64 md:pt-24" />
        <section className="min-h-screen overflow-y-visible bg-gray-5 px-16 pb-100 pt-32 md:py-24 md:pl-192 md:pr-64">
          {children}
        </section>
      </div>
    </ScrollProvider>
  );
}

export default Layout;
