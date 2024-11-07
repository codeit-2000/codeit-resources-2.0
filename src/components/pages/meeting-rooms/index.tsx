import Drawer from "@/components/commons/Drawer";
import ErrorBoundary from "@/components/commons/ErrorBoundary";
import { Resource } from "@/lib/api/amplify/helper";
import { getGroupedResourceListBySubtype } from "@/lib/api/amplify/resource/utils";
import { isOpenDrawerAtom } from "@/store/isOpenDrawerAtom";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Suspense, useMemo } from "react";

import Error from "../seats/Error";
import Layout from "./Layout";
import MeetingRoomsSkeleton from "./MeetingRoomsSkeleton";
import ReservationForm from "./ReservationForm";
import RoomSelection from "./RoomSelection";
import pickedDateAtom from "./context/pickedDate";
import pickedReservationAtom from "./context/pickedReservation";
import { useGetReservations } from "./hooks/useGetReservations";

function MeetingRoomsPage() {
  const queryClient = useQueryClient();
  const { rooms, roomReservations, users, teams } = useGetReservations();

  const pickedDate = useAtomValue(pickedDateAtom);
  const setPickedReservation = useSetAtom(pickedReservationAtom);

  const [isOpenDrawer, setIsOpenDrawer] = useAtom(isOpenDrawerAtom);

  // 리소스를 subtype별로 그룹화
  const groupedResources = useMemo(
    () => getGroupedResourceListBySubtype(rooms?.data as Resource[]),
    [rooms],
  );

  // 팀 매핑 데이터 생성
  const teamMap = useMemo(
    () =>
      teams.reduce(
        (acc, team) => {
          acc[team.id] = team.name;
          return acc;
        },
        {} as Record<string, string>,
      ),
    [teams],
  );

  // 멤버 데이터 가공
  const members = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        name: user.username,
        departments: (user.teams || [])
          .filter((teamId): teamId is string => teamId !== null)
          .map((teamId) => teamMap[teamId] || ""),
        profileImage: user.profileImage || "",
        email: user.email,
      })),
    [users, teamMap],
  );

  const handleReservationSuccess = () => {
    setIsOpenDrawer(false);
    queryClient.invalidateQueries({
      queryKey: ["roomReservations", pickedDate],
    });
  };

  const handleDrawerClose = () => {
    setIsOpenDrawer(false);
    setPickedReservation(null);
  };

  return (
    <>
      <div>
        <Layout>
          {Object.entries(groupedResources).map(
            ([subtype, roomList], index) => (
              <RoomSelection
                key={subtype}
                subType={subtype}
                roomList={roomList}
                isFirstGroup={index === 0}
                reservations={roomReservations?.data}
              />
            ),
          )}
        </Layout>
      </div>
      <AnimatePresence>
        {isOpenDrawer && (
          <Drawer onClose={handleDrawerClose}>
            <ReservationForm
              actionType="create"
              members={members}
              onSuccess={handleReservationSuccess}
            />
          </Drawer>
        )}
      </AnimatePresence>
    </>
  );
}

export default function MeetingRooms() {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<MeetingRoomsSkeleton />}>
        <MeetingRoomsPage />
      </Suspense>
    </ErrorBoundary>
  );
}
