import { Reservation } from "@/lib/api/amplify/helper";
import { atom } from "jotai";

export const tempSelectedTimeAtom = atom<Pick<
  Reservation,
  "startTime" | "endTime" | "resourceId"
> | null>(null);
