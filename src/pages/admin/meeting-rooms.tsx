import Button from "@/components/commons/Button";
import Error from "@/components/commons/Error";
import ErrorBoundary from "@/components/commons/ErrorBoundary";
import AdminMeetingRoomsSkeleton from "@/components/pages/admin/meeting-rooms/AdminMeetingRoomSkeleton";
import EmptyMeetingRooms from "@/components/pages/admin/meeting-rooms/EmptyMeetingRooms";
import MeetingRoomList from "@/components/pages/admin/meeting-rooms/MeetingRoomList";
import { useGetReservations } from "@/components/pages/meeting-rooms/hooks/useGetReservations";
import useModal from "@/hooks/useModal";
import { Resource } from "@/lib/api/amplify/helper";
import { getGroupedResourceListBySubtype } from "@/lib/api/amplify/resource/utils";
import { Suspense, useMemo } from "react";

function AdminMeetingRoomPage() {
  const { openModal } = useModal();
  const { rooms } = useGetReservations();

  const groupedResources = useMemo(
    () => getGroupedResourceListBySubtype(rooms?.data as Resource[]),
    [rooms],
  );

  let content;
  if (Object.keys(groupedResources).length === 0) {
    content = <EmptyMeetingRooms />;
  } else {
    content = Object.entries(groupedResources).map(([subtype, resources]) => (
      <MeetingRoomList key={subtype} title={subtype} items={resources} />
    ));
  }

  return (
    <div className="max-h-full min-h-[100vh] bg-gray-5 px-25 pt-64 md:px-88 md:pt-80 lg:px-118">
      <div className="flex items-center justify-between">
        <h1 className="text-24-700 text-gray-100 md:text-28-700">
          회의실 설정
        </h1>
      </div>
      <div className="mt-40 flex flex-col gap-16">{content}</div>
      <div>
        <hr className="my-20" />
        <div className="pb-110 md:pb-20">
          <Button
            variant="secondary"
            width="w-115"
            height="h-45"
            onClick={() => {
              openModal("addMeetingRoomTypeModal");
            }}
          >
            분류 추가
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMeetingRooms() {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<AdminMeetingRoomsSkeleton />}>
        <AdminMeetingRoomPage />
      </Suspense>
    </ErrorBoundary>
  );
}
