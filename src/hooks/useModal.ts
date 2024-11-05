import modalAtom from "@/store/modalAtom";
import { useAtom } from "jotai";

const useModal = () => {
  const [modalState, setModalState] = useAtom(modalAtom);

  const openModal = (modalType: string, modalProps?: object) => {
    setModalState({
      modalType,
      modalProps: modalProps || {},
    });
  };

  const closeModal = () => {
    setModalState({
      modalType: null,
      modalProps: {},
    });
  };

  return {
    modalState,
    openModal,
    closeModal,
  };
};

export default useModal;
