import ErrorBoundary from "@/components/commons/ErrorBoundary";
import Skeleton from "@/components/commons/Skeleton";
import MyReservation from "@/components/pages/dashboard/components/MyReservation";
import { useGetUserReservation } from "@/components/pages/dashboard/hooks/useGetUserReservation";
import Error from "@/components/pages/seats/Error";
import { Suspense } from "react";

function DashboardPage() {
  const { userReservations } = useGetUserReservation();

  return (
    <div className="min-h-[calc(100vh-240px)] bg-gray-5 px-16 py-62 md:p-80 md:py-40">
      <MyReservation
        resourceType="ROOM"
        reservationList={userReservations?.ROOM || []}
      />
      <MyReservation
        resourceType="SEAT"
        reservationList={userReservations?.SEAT || []}
      />
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen bg-gray-5 px-16 py-62 md:p-80 md:py-40">
      <section className="mb-80 flex flex-col gap-16">
        <Skeleton className="my-8 h-24 w-120 rounded-16 md:my-0 md:h-40" />
        <span className="h-1 w-full border-b-[1px] border-gray-100-opacity-10" />
        <div className="flex scroll-m-2 gap-16 overflow-x-auto pb-16">
          <Skeleton className="flex h-172 w-full gap-16 rounded-16 bg-gray-15" />
        </div>
      </section>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        <DashboardPage />
      </Suspense>
    </ErrorBoundary>
  );
}
