import { client } from "@/lib/api/amplify/helper";
import { createEvent } from "@/lib/api/googleCalendar";
import { NextApiRequest, NextApiResponse } from "next";

const createReservation = async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  // 액세스 토큰이 없을 경우 처리
  if (!accessToken) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  const calendarID = ""; // user email을 여기에 추가하세요.

  const event = req.body;

  try {
    const createdEvent = await createEvent(calendarID, event, accessToken);

    if (createdEvent) {
      const amplifyData = await client.models.Reservation.create(event);

      if (amplifyData) {
        return res.status(201).json(amplifyData);
      }
    }
    return res.status(500).json({ error: "Failed to create event" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default createReservation;
