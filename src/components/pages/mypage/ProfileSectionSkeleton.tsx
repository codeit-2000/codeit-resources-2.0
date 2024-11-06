import Skeleton from "@/components/commons/Skeleton";

export default function ProfileSectionSkeleton() {
  return (
    <section>
      <h2 className="text-24-700 text-gray-100">내 프로필</h2>
      <hr className="mt-10" />
      <div className="mt-20 flex flex-col gap-10">
        {/* 이름 스켈레톤 */}
        <div className="flex items-center">
          <span className="inline-block w-50 text-17-700 text-gray-100">
            이름
          </span>
          <Skeleton className="ml-30 h-27 w-100 rounded" />
        </div>

        {/* 이메일 스켈레톤 */}
        <div className="flex items-center">
          <span className="inline-block w-50 text-17-700 text-gray-100">
            이메일
          </span>
          <Skeleton className="ml-30 h-27 w-150 rounded" />
        </div>

        {/* 팀 스켈레톤 */}
        <div className="flex items-center">
          <span className="inline-block w-50 text-17-700 text-gray-100">
            팀
          </span>
          <Skeleton className="ml-30 h-23 w-150 rounded" />
        </div>

        {/* 사진 스켈레톤 */}
        <div className="flex items-center">
          <span className="inline-block w-50 text-17-700 text-gray-100">
            사진
          </span>
          <div className="ml-30 flex items-center gap-10">
            <Skeleton className="size-72 rounded-full" />
            <Skeleton className="h-34 w-76 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}
