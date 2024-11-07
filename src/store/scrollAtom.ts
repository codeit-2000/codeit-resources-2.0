import { atom } from "jotai";
import { RefObject } from "react";

export const containerRefAtom = atom<RefObject<HTMLDivElement> | null>(null);
export const mobileContainerRefAtom = atom<RefObject<HTMLDivElement> | null>(
  null,
);
export const targetRefAtom = atom<RefObject<HTMLDivElement> | null>(null);
