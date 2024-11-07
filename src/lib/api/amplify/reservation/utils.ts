import { compareTimes } from "@/lib/utils/timeUtils";

import { Reservation, client } from "../helper";

/**
 * @description 해당 예약의 참여자인지 확인
 *
 * @param reservationId 확인할 예약 id
 * @param userId 확인할 유저 정보
 */
export const checkParticipant = async (data: {
  reservationId: string;
  userId: string;
}): Promise<boolean> => {
  const { reservationId, userId } = data;

  // 1. reservationId로 확인할 예약 정보 가져오기
  const { data: reservationToCheck, errors } =
    await client.models.Reservation.get({ id: reservationId });

  if (errors) throw new Error(errors[0].message);
  if (!reservationToCheck) return false;

  // 2. participants 배열에서 userId가 존재하는지 확인
  const isParticipant = reservationToCheck.participants?.includes(userId);

  if (!isParticipant) return false;
  return true;
};

export type ReservationCheckData = Pick<
  Reservation,
  "resourceId" | "date" | "startTime" | "endTime"
>;

/**
 * @description 생성/수정하려는 예약이 기존 예약과 충돌하는지 확인
 *
 * @param reservationData 확인할 예약 데이터
 */
export const checkReservationConflict = async (
  reservationData: ReservationCheckData & { id?: string },
): Promise<boolean> => {
  const { resourceId, date, startTime, endTime } = reservationData;

  // 1. 동일한 리소스 및 날짜에 대한 기존 예약 가져오기
  const { data: existingReservations, errors } =
    await client.models.Reservation.list({
      filter: {
        resourceId: { eq: resourceId },
        date: { eq: date },
        status: { eq: "CONFIRMED" },
      },
    });
  if (errors) throw new Error(errors[0].message);

  // 2. 확인할 예약의 시간이 유효한지 확인
  if (!compareTimes(startTime, endTime)) {
    throw new Error("종료 시간은 시작 시간보다 늦어야 합니다.");
  }

  // 3. 기존 예약 데이터를 돌면서 충돌 여부 확인
  const isConflict = (existingReservations || []).some(
    (reservation: Reservation) => {
      if (!reservation || reservationData?.id === reservation.id) return false;

      return (
        compareTimes(startTime, reservation.endTime) &&
        compareTimes(reservation.startTime, endTime)
      );
    },
  );

  if (isConflict) return false;
  return true;
};
