import { formatDayToISO, getTodayAndTomorrow } from "@/lib/utils/timeUtils";
import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import pickedDateAtom from "../context/pickedDate";

export default function useDefaultDate() {
  const setPickedDate = useSetAtom(pickedDateAtom);
  const router = useRouter();
  const { query } = router;

  const dateArray = getTodayAndTomorrow();
  const [today, tomorrow] = dateArray;

  const searchParamsDate = query.date as string;

  const [defaultDate, setDefaultDate] = useState(
    searchParamsDate && dateArray.includes(searchParamsDate)
      ? searchParamsDate
      : today,
  );

  useEffect(() => {
    if (searchParamsDate === tomorrow) {
      setDefaultDate(tomorrow);
      setPickedDate(formatDayToISO(tomorrow));
    } else if (!searchParamsDate) {
      setDefaultDate(today);
      setPickedDate(formatDayToISO(today));
    } else if (searchParamsDate && !dateArray.includes(searchParamsDate)) {
      setDefaultDate(today);
      setPickedDate(formatDayToISO(today));

      router.push({
        pathname: router.pathname,
        query: { ...query, date: today },
      });
    } else {
      setDefaultDate(searchParamsDate);
      setPickedDate(formatDayToISO(searchParamsDate));
    }
  }, [searchParamsDate, dateArray, today, tomorrow, query, router]);

  return defaultDate;
}
