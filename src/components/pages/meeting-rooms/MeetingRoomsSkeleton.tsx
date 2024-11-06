import Skeleton from "@/components/commons/Skeleton";
import ChevronLeft from "@public/icons/icon-chevron-left.svg";
import ChevronRight from "@public/icons/icon-chevron-right.svg";

export default function MeetingRoomsSkeleton() {
  return (
    <div className="min-h-screen">
      <header>
        <section className="no-scrollbar overflow-x-auto bg-gray-5 px-16 pt-64 md:px-64 md:pt-24">
          <div className="flex items-center">
            {/* 타이틀 */}
            <h1 className="mr-13 text-24-700 text-gray-100 md:mr-24 md:text-28-700">
              회의실 예약
            </h1>

            {/* 날짜 선택 스켈레톤 */}
            <div className="flex items-center justify-center">
              <button
                className="text-14-500 opacity-30 disabled:cursor-not-allowed"
                type="button"
                disabled
              >
                <ChevronLeft />
              </button>
              <div className="flex items-center justify-center">
                <Skeleton className="mx-16 h-23 w-120 rounded-4 md:h-30 md:w-150" />
              </div>
              <button
                className="text-14-500 opacity-30 disabled:cursor-not-allowed"
                type="button"
                disabled
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="mt-10 flex h-63 items-center gap-10 border-b">
            <Skeleton className="mt-20 h-12 w-82 rounded-4" />
            <Skeleton className="mt-20 h-12 w-82 rounded-4" />
            <Skeleton className="mt-20 h-12 w-82 rounded-4" />
          </div>
        </section>
      </header>

      <section className="no-scrollbar min-h-screen overflow-x-auto bg-gray-5 px-16 pt-24 md:px-64 md:pt-60">
        <div className="mb-16 mt-36 h-14 w-40 rounded-4 bg-gray-20" />

        <span className="mb-16 flex h-48 w-max min-w-80 cursor-pointer items-center justify-center rounded-8 border-[1px] text-16-500 md:h-59 md:min-w-128" />
        <div className="h-56 w-full md:hidden" />
        <span className="mb-16 flex h-48 w-max min-w-80 cursor-pointer items-center justify-center rounded-8 border-[1px] text-16-500 md:h-59 md:min-w-128" />
        <div className="h-56 w-full md:hidden" />
        <span className="mb-16 flex h-48 w-max min-w-80 cursor-pointer items-center justify-center rounded-8 border-[1px] text-16-500 md:h-59 md:min-w-128" />
        <div className="h-56 w-full md:hidden" />

        <div className="mb-16 h-14 w-40 rounded-4 bg-gray-20 md:mt-32" />

        <span className="mb-16 flex h-48 w-max min-w-80 cursor-pointer items-center justify-center rounded-8 border-[1px] text-16-500 md:h-59 md:min-w-128" />
        <div className="h-56 w-full md:hidden" />
        <span className="mb-16 flex h-48 w-max min-w-80 cursor-pointer items-center justify-center rounded-8 border-[1px] text-16-500 md:h-59 md:min-w-128" />
        <div className="h-56 w-full md:hidden" />
        <span className="mb-16 flex h-48 w-max min-w-80 cursor-pointer items-center justify-center rounded-8 border-[1px] text-16-500 md:h-59 md:min-w-128" />
        <div className="h-56 w-full md:hidden" />

        <div className="mb-16 h-14 w-40 rounded-4 bg-gray-20 md:mt-32" />

        <span className="mb-16 flex h-48 w-max min-w-80 cursor-pointer items-center justify-center rounded-8 border-[1px] text-16-500 md:h-59 md:min-w-128" />
        <div className="h-56 w-full md:hidden" />
        <span className="mb-16 flex h-48 w-max min-w-80 cursor-pointer items-center justify-center rounded-8 border-[1px] text-16-500 md:h-59 md:min-w-128" />
        <div className="h-56 w-full md:hidden" />
        <span className="mb-16 flex h-48 w-max min-w-80 cursor-pointer items-center justify-center rounded-8 border-[1px] text-16-500 md:h-59 md:min-w-128" />
        <div className="h-56 w-full md:hidden" />
      </section>
    </div>
  );
}
