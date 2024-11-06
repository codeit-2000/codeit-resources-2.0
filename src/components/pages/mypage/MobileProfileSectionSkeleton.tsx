import Skeleton from "@/components/commons/Skeleton";
import React from "react";

function MobileProfileSectionSkeleton() {
  return (
    <section>
      <h2 className="text-24-700 text-gray-100">설정</h2>
      <div className="mt-20 flex flex-col gap-10">
        <div className="flex items-center gap-10">
          <Skeleton className="size-72 rounded-full" />
          <Skeleton className="h-34 w-76 rounded" />
        </div>
        <div className="flex flex-col gap-5 rounded-8 border bg-gray-10 px-16 py-12">
          <div className="flex items-center">
            <span className="inline-block w-50 text-14-700 text-gray-100-opacity-60">
              이름
            </span>
            <span className="ml-30 mr-5 inline-block text-16-400 text-gray-100">
              <Skeleton className="h-27 w-45 rounded" />
            </span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-50 text-14-700 text-gray-100-opacity-60">
              이메일
            </span>
            <span className="ml-30 inline-block text-16-400 text-gray-100">
              <Skeleton className="h-27 w-150 rounded" />
            </span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-50 text-14-700 text-gray-100-opacity-60">
              팀
            </span>
            <span className="ml-30 inline-block text-16-400 text-gray-100">
              <Skeleton className="h-23 w-60 rounded" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MobileProfileSectionSkeleton;
