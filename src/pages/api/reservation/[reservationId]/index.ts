import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      // POST 요청 처리 로직
      res.status(200).send({ message: "POST request processed" });
      break;

    case "GET":
      // GET 요청 처리 로직
      res.status(200).send({ message: "GET request processed" });
      break;

    case "PATCH":
      // PATCH 요청 처리 로직
      res.status(200).send({ message: "PATCH request processed" });
      break;

    case "DELETE":
      // DELETE 요청 처리 로직
      res.status(200).send({ message: "DELETE request processed" });
      break;

    default:
      res.setHeader("Allow", ["POST", "GET", "PATCH", "DELETE"]);
      res.status(405).send({ message: `Method ${req.method} Not Allowed` });
  }
}
