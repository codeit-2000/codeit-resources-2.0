import type { NextApiRequest, NextApiResponse } from "next";

import createReservation from "./create";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const accessToken = req.headers.authorization?.split(" ")[1];

  // 액세스 토큰이 없을 경우 처리
  if (!accessToken) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    switch (req.method) {
      case "POST":
        return await createReservation(req, res);

      case "GET":
        // GET 요청 처리 로직 (필요한 로직 추가)
        return res.status(200).send({ message: "GET request processed" });

      case "PATCH":
        // PATCH 요청 처리 로직 (필요한 로직 추가)
        return res.status(200).send({ message: "PATCH request processed" });

      case "DELETE":
        // DELETE 요청 처리 로직 (필요한 로직 추가)
        return res.status(200).send({ message: "DELETE request processed" });

      default:
        res.setHeader("Allow", ["POST", "GET", "PATCH", "DELETE"]);
        return res
          .status(405)
          .send({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error(error); // 오류 로깅
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
