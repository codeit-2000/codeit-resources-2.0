import ChevronLeft from "@/../public/icons/icon-chevron-left.svg";
import ChevronRight from "@/../public/icons/icon-chevron-right.svg";
import Badge from "@/components/commons/Badge";
import Tab from "@/components/commons/Tab";
import useTabDrag from "@/components/commons/Tab/useTabDrag";
import getDaysUntilEndOfMonth, {
  getDaysUntilEndOfMonthType,
} from "@/lib/utils/getDaysUntilEndOfMonth";
import { todayDateAtom } from "@/store/todayDateAtom";
import clsx from "clsx";
import dayjs from "dayjs";
import { PrimitiveAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import ScrollProvider from "./ScrollProvider";
import pickedDateAtom from "./context/pickedDate";
import { containerRefAtom, targetRefAtom } from "./context/scroll";

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
        <h1 className="mb-16 mr-13 text-24-700 text-gray-100 md:mr-24 md:text-28-700">
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
                    `${currentHeaderDate.year}-${String(currentHeaderDate.month).padStart(2, "0")}-${day}`,
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
  const containerRef = useAtomValue(containerRefAtom);
  const targetRef = useAtomValue(targetRefAtom);

  const [isInitialScrollDone, setIsInitialScrollDone] = useState(false);

  useEffect(() => {
    if (targetRef?.current && containerRef?.current) {
      const targetPosition = targetRef.current.offsetLeft;
      containerRef.current.scrollTo({
        left: targetPosition,
        behavior: "smooth",
      });
      // 초기 스크롤 완료 후 드래그 활성화
      setTimeout(() => setIsInitialScrollDone(true), 300);
    }
  }, [targetRef, containerRef]);

  const { handleMouseDown, handleMouseMove, handleMouseUpOrLeave } =
    useTabDrag(containerRef);

  return (
    <ScrollProvider>
      <div className="">
        <Header className="px-16 pt-64 md:px-64 md:pt-24" />
        {/* eslint-disable-next-line */}
        <section
          ref={containerRef}
          className="no-scrollbar min-h-screen overflow-x-auto bg-gray-5 px-16 pb-100 pt-64 md:px-64 md:pb-0 md:pt-48"
          onMouseDown={isInitialScrollDone ? handleMouseDown : undefined}
          onMouseMove={isInitialScrollDone ? handleMouseMove : undefined}
          onMouseLeave={isInitialScrollDone ? handleMouseUpOrLeave : undefined}
          onMouseUp={isInitialScrollDone ? handleMouseUpOrLeave : undefined}
        >
          {children}
        </section>
      </div>
    </ScrollProvider>
  );
}

export default Layout;
