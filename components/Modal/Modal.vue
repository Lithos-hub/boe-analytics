<template>
  <UModal v-model="isShowingModal">
    <div class="p-5">
      <component :is="modalContent[modalType]" />
    </div>
  </UModal>
</template>

<script setup lang="ts">
import type { ModalComponentTypes } from './Modal.interfaces';

const { isShowingModal, modalType } = storeToRefs(useModalStore());

const modalContent: ModalComponentTypes = {
  StopFetch: defineAsyncComponent(() => import('./components/StopFetch.vue')),
};
</script>
