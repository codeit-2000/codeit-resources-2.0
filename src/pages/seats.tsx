import ErrorBoundary from "@/components/commons/ErrorBoundary";
import Error from "@/components/pages/seats/Error";
import Header from "@/components/pages/seats/Header";
import Loading from "@/components/pages/seats/Loading";
import SeatGrid from "@/components/pages/seats/SeatGrid";
import { Suspense } from "react";

export default function Seats() {
  return (
    <div className="no-scrollbar min-h-screen overflow-x-scroll bg-gray-5">
      <Header />

      <section className="xl:flex xl:justify-center">
        <ErrorBoundary fallback={<Error />}>
          <Suspense fallback={<Loading />}>
            <SeatGrid />
          </Suspense>
        </ErrorBoundary>
      </section>
    </div>
  );
}
