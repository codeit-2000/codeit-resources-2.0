import { client } from "../helper";

export const getSeatReservationListByDate = async (date: string) =>
  client.models.Reservation.listByResourceTypeAndSortByResourceName(
    {
      resourceType: "SEAT",
    },
    {
      filter: {
        date: { eq: date },
        status: { eq: "CONFIRMED" },
      },
      sortDirection: "ASC",
      selectionSet: [
        "id",
        "status",
        "participants",
        "resourceSubtype",
        "resourceName",
      ],
    },
  );

export const getSeatValidReservationList = async () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  return client.models.Reservation.listByResourceTypeAndSortByResourceName(
    {
      resourceType: "SEAT",
    },
    {
      filter: {
        or: [
          {
            date: { eq: formatDate(today) },
          },
          {
            date: { eq: formatDate(tomorrow) },
          },
        ],
        status: { eq: "CONFIRMED" },
      },
      sortDirection: "ASC",
      selectionSet: ["status", "resourceSubtype", "resourceName"],
    },
  );
};

interface CreateSeatReservationParams {
  resourceId: string;
  resourceName: string;
  resourceSubtype: string;
  date: string;
  participant: string;
}

export const createSeatReservation = async ({
  resourceId,
  resourceName,
  resourceSubtype,
  date,
  participant,
}: CreateSeatReservationParams) => {
  // 해당 좌석이 예약되어 있는지 확인
  const { data: seatDataArray } = await client.models.Reservation.list({
    filter: {
      date: { eq: date },
      resourceName: { eq: resourceName },
    },

    selectionSet: ["participants"],
  });

  if (seatDataArray.length > 0) throw new Error("이미 좌석이 예약되어있습니다");

  return client.models.Reservation.create({
    resourceId,
    resourceSubtype,
    resourceName,
    date,
    resourceType: "SEAT",
    status: "CONFIRMED",
    startTime: "00:00:00.000",
    endTime: "23:59:59.000",
    participants: [participant],
  });
};

interface MoveSeatReservationParams {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceSubtype: string;
}

export const moveSeatReservation = async ({
  id,
  resourceId,
  resourceName,
  resourceSubtype,
}: MoveSeatReservationParams) =>
  client.models.Reservation.update({
    id,
    resourceId,
    resourceName,
    resourceSubtype,
  });

export const deleteSeatReservation = async (id: string) =>
  client.models.Reservation.delete({ id });
