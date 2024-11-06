import ErrorBoundary from "@/components/commons/ErrorBoundary";
import EditDrawer from "@/components/pages/admin/seats/EditDrawer";
import Header from "@/components/pages/admin/seats/Header";
import Loading from "@/components/pages/admin/seats/Loading";
import SeatGrid from "@/components/pages/admin/seats/SeatGrid";
import DrawerProvider from "@/components/pages/admin/seats/context/drawer";
import Error from "@/components/pages/seats/Error";
import { Suspense } from "react";

export default function AdminSeatsPage() {
  return (
    <DrawerProvider>
      <Header />

      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loading />}>
          <SeatGrid />
        </Suspense>
      </ErrorBoundary>

      <EditDrawer />
    </DrawerProvider>
  );
}
