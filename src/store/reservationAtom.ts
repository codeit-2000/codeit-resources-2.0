import { Reservation, Resource } from "@/lib/api/amplify/helper";
import { atom } from "jotai";

// 예약이 돼있는 타임라인 클릭시 초기값을 저장하는 Atom
export const selectedReservationAtom = atom<Reservation | null>(null);

// 회의실 이름 목록 등을 저장하는 Atom
export const roomListAtom = atom<Resource[]>([]);

// 현재 내가 어디의 회의실을 예약중인지 판단하는 Atom -> ex) 회의실A
export const activeRoomAtom = atom<string | null>(null);

// 선택된 시간을 저장하는 Atom
export const selectedTimeAtom = atom<string>("");
