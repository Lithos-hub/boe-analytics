import type { ModalContentType } from '~/components/Modal/Modal.interfaces';

export const useModalStore = defineStore('modal', () => {
  // State
  const isShowingModal = ref(false);
  const modalType = ref<ModalContentType>('' as ModalContentType);

  // Actions
  const showModal = (type: ModalContentType) => {
    modalType.value = type;
    isShowingModal.value = true;
  };

  const hideModal = () => {
    isShowingModal.value = false;
  };

  return {
    isShowingModal,
    modalType,
    showModal,
    hideModal,
  };
});
