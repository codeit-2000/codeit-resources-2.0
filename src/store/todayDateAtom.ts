import dayjs from "dayjs";
import { atom } from "jotai";

export const todayDateAtom = atom(dayjs().locale("ko"));
