/* eslint-disable @typescript-eslint/no-unused-vars */
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY!,
  },
});

export const sendEmail = async (
  to: string[],
  subject: string,
  location: string,
  date: string,
  time: string,
) => {
  const body = `
  <div style="text-align: center; background-color: #9933FF; padding: 20px 0;">
    <h1 style="font-size: 24px; color: white; font-weight: bold; margin: 0;">Codeit Resources</h1>
  </div>
  <h2 style="font-size: 18px; font-weight: bold; text-align: center; margin-top: 20px;">예약된 회의실 일정을 확인해주세요!</h2>
  <div style="margin: 20px; padding: 20px; border: 1px solid #ccc; border-radius: 10px; font-family: Arial, sans-serif;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="font-weight: bold; padding: 8px; vertical-align: top;">[장소]</td>
        <td style="padding: 8px;">${location}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; padding: 8px; vertical-align: top;">[일정]</td>
        <td style="padding: 8px;">${date} ${time}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; padding: 8px; vertical-align: top;">[참석자]</td>
        <td style="padding: 8px;">${to.join(", ")}</td>
      </tr>
    </table>
  </div>
`;

  const params = {
    Source: "spfe0654@codeit.kr",
    Destination: {
      ToAddresses: to,
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: body },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
  } catch (error) {
    throw new Error("회의실 예약 일정 메일 전송을 실패하였습니다.");
  }
};
