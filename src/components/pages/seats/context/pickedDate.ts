import { atom } from "jotai";

const formatDayToISO = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  return `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
};

const pickedDateAtom = atom<string>(formatDayToISO());

export default pickedDateAtom;
