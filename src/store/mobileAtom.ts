import { atom } from "jotai";

/* 모바일 화면인지 아닌지 전역 상태로 관리 */
const isMobileAtom = atom<boolean>(false);

export default isMobileAtom;
