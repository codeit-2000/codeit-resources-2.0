import { Reservation, ResourceType, User, client } from "../helper";
import {
  ReservationCheckData,
  checkParticipant,
  checkReservationConflict,
} from "./utils";

type CreateReservation = Omit<Reservation, "resource">;

export const createReservation = async (
  reservationData: Omit<
    CreateReservation,
    "status" | "resourceType" | "resourceName"
  >,
) => {
  const { data: resource, errors } = await client.models.Resource.get({
    id: reservationData.resourceId,
  });

  if (errors || !resource?.id) {
    throw new Error(errors ? errors[0].message : "리소스를 찾을 수 없습니다.");
  }

  if (!checkReservationConflict(reservationData)) {
    throw new Error("해당 시간에 이미 예약이 있습니다.");
  }

  const data = {
    ...reservationData,
    // 리소스 타입은 get함수로 가져와서 등록 (충돌 방지)
    resourceType: resource?.resourceType,
    resourceSubtype: resource?.resourceSubtype,
    resourceName: resource?.name,
    status: "CONFIRMED",
  };

  return client.models.Reservation.create(data as CreateReservation);
};

export const updateReservation = async (
  reservationData: Partial<CreateReservation> &
    ReservationCheckData & {
      id: string;
    },
  userData: Pick<User, "role" | "id">,
) => {
  if (
    userData.role === "MEMBER" &&
    !checkParticipant({
      reservationId: reservationData?.id || "",
      userId: userData.id,
    })
  ) {
    throw new Error("해당 예약의 참여자만 수정이 가능합니다.");
  }

  if (!checkReservationConflict(reservationData)) {
    throw new Error("해당 시간에 이미 예약이 있습니다.");
  }

  return client.models.Reservation.update(reservationData);
};

export const cancelReservation = async (
  targetReservationData: CreateReservation,
  userData: Pick<User, "role" | "id">,
) =>
  updateReservation(
    {
      ...targetReservationData,
      status: "CANCELED",
    },
    userData,
  );

export const getReservationById = async (id: string) =>
  client.models.Reservation.get({ id });

export const getReservationList = async (filter?: { [key: string]: unknown }) =>
  client.models.Reservation.list(filter);

/**
 * 리소스 ID를 기준으로 예약 list를 가져옵니다.
 * date를 기준으로 필터링 또는 정렬이 가능합니다.
 * @param resourceId
 * @param filter - { status: { eq: "CONFIRMED" }, data: { eq: "2024-10-24"}}
 * @returns
 */
export const getReservationListByResourceId = async (
  resourceId: string,
  filter: { [key: string]: unknown },
) => {
  const options: { [key: string]: unknown } = {
    filter,
    sortDirection: "ASC",
  };

  return client.models.Reservation.listByResourceIdAndSortByDate(
    {
      resourceId,
    },
    options,
  );
};

/**
 * 리소스 Type를 기준으로 예약 list를 가져옵니다.
 * 리소스의 이름을 기준으로 필터링 또는 정렬이 가능합니다.
 * @param resourceType
 * @param filter - { status: { eq: "CONFIRMED" }, data: { eq: "2024-10-24"}}
 * @returns
 */
export const getReservationListByResourceType = async (
  resourceType: ResourceType,
  filter: { [key: string]: unknown },
) => {
  const options: { [key: string]: unknown } = {
    filter,
    sortDirection: "ASC",
  };

  if (!resourceType) throw new Error("리소스 타입이 필요합니다.");

  return client.models.Reservation.listByResourceTypeAndSortByResourceName(
    {
      resourceType,
    },
    options,
  );
};

/**
 * 리소스 Type를 기준으로 예약 list를 가져옵니다.
 * 리소스의 서브타입을 기준으로 필터링 또는 정렬이 가능합니다.
 * @param resourceType
 * @param filter - { status: { eq: "CONFIRMED" }, data: { eq: "2024-10-24"}}
 * @returns
 */
export const getReservationListByResourceSubtype = async (
  resourceType: ResourceType,
  filter: { [key: string]: unknown },
) => {
  const options: { [key: string]: unknown } = {
    filter,
    sortDirection: "ASC",
  };

  if (!resourceType) throw new Error("리소스 타입이 필요합니다.");

  return client.models.Reservation.listByResourceTypeAndSortByResourceSubtype(
    {
      resourceType,
    },
    options,
  );
};
