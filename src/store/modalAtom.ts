import { atom } from "jotai";

interface ModalState {
  modalType: string | null;
  modalProps: object;
}

const modalAtom = atom<ModalState>({
  // 모달의 종류를 나타내는 프롭입니다.
  modalType: null,
  // 모달을 열 때 전달할 프롭이 있을 때 사용합니다.
  modalProps: {},
});

export default modalAtom;
