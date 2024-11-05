import { atom } from "jotai";

type ToastType = "success" | "error";

export type ToastProps = {
  id?: string;
  type: ToastType;
  message: string;
};

export const toastAtom = atom<ToastProps | null>(null);

export const updateToastAtom = atom(null, (_, set, { type, message }) => {
  const newToast = {
    id: Date.now().toString(),
    type,
    message,
  };

  set(toastAtom, newToast);
});

export const deleteToastAtom = atom(null, (_, set) => {
  set(toastAtom, null);
});
