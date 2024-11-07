import Drawer from "@/components/commons/Drawer";
import ErrorBoundary from "@/components/commons/ErrorBoundary";
import useTabDrag from "@/components/commons/Tab/useTabDrag";
import { Resource } from "@/lib/api/amplify/helper";
import { getGroupedResourceListBySubtype } from "@/lib/api/amplify/resource/utils";
import { isOpenDrawerAtom } from "@/store/isOpenDrawerAtom";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Suspense, useEffect, useMemo, useState } from "react";

import { containerRefAtom, targetRefAtom } from "../../../store/scrollAtom";
import Error from "../seats/Error";
import Layout from "./Layout";
import MeetingRoomsSkeleton from "./components/MeetingRoomsSkeleton";
import ReservationForm from "./components/ReservationForm";
import RoomSelection from "./components/RoomSelection";
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
      // if (!teamMap) return [];

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

  const containerRef = useAtomValue(containerRefAtom);
  const targetRef = useAtomValue(targetRefAtom);
  const [isInitialScrollDone, setIsInitialScrollDone] = useState(false);
  useEffect(() => {
    if (targetRef?.current && containerRef?.current) {
      const targetPosition = targetRef.current.offsetLeft;
      containerRef.current.scrollTo({
        left: targetPosition - 100,
        behavior: "smooth",
      });
      // 초기 스크롤 완료 후 드래그 활성화
      setTimeout(() => setIsInitialScrollDone(true), 300);
    }
  }, [targetRef, containerRef, pickedDate]);
  const { handleMouseDown, handleMouseMove, handleMouseUpOrLeave } =
    useTabDrag(containerRef);

  return (
    <>
      <div>
        <Layout>
          <div className="z-[24] hidden h-full w-44 overflow-x-auto overflow-y-visible bg-gradient-to-r from-gray-5 from-50% to-gray-00-opacity-0 to-90% md:absolute md:block md:py-60" />
          {/* eslint-disable-next-line */}
          <div
            className="no-scrollbar overflow-x-auto overflow-y-visible md:py-60 md:pl-24"
            ref={containerRef}
            onMouseDown={isInitialScrollDone ? handleMouseDown : undefined}
            onMouseMove={isInitialScrollDone ? handleMouseMove : undefined}
            onMouseLeave={
              isInitialScrollDone ? handleMouseUpOrLeave : undefined
            }
            onMouseUp={isInitialScrollDone ? handleMouseUpOrLeave : undefined}
          >
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
          </div>
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
