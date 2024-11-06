import { convertTimeToMinutes } from "@/lib/utils/timeUtils";
import { useEffect, useState } from "react";

// HH:MM 형식
export default function useIsOngoing(startTime: string, endTime: string) {
  const [isOngoing, setIsOngoing] = useState(false);

  useEffect(() => {
    const checkOngoingStatus = () => {
      const now =
        convertTimeToMinutes(
          new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        ) || 0;
      const start = convertTimeToMinutes(startTime) || 0;
      const end = convertTimeToMinutes(endTime) || 0;

      // 현재 시간이 start와 end 사이에 있는지 확인
      if (now >= start && now <= end) {
        setIsOngoing(true);
      } else {
        setIsOngoing(false);
      }
    };

    checkOngoingStatus();
  }, [startTime, endTime]);

  return isOngoing;
}
