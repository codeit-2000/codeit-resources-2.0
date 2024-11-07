import { todayDateAtom } from "@/store/todayDateAtom";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect } from "react";

// 자정에 오늘의 날짜를 갱신하는 커스텀 훅
const useAutoUpdateDate = () => {
  const [today, setToday] = useAtom(todayDateAtom);

  useEffect(() => {
    const updateDate = () => setToday(dayjs().locale("ko"));

    // 현재 시간과 자정까지 남은 시간을 계산
    const now = dayjs();
    const msUntilMidnight = dayjs().add(1, "day").startOf("day").diff(now);

    // 자정에 한 번 실행하고 매 24시간마다 반복
    const timeout = setTimeout(() => {
      updateDate();
      setInterval(updateDate, 24 * 60 * 60 * 1000); // 24시간마다 갱신
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, [setToday]);

  return today.format("YYYY-MM-DD");
};

export default useAutoUpdateDate;
