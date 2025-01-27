<template>
  <div class="flex flex-col gap-5 text-center">
    <div class="flex items-center justify-center gap-2.5">
      <UIcon
        name="i-heroicons-exclamation-triangle"
        size="lg"
        class="h-6 w-6 text-red-500" />
      <h2 class="text-xl text-red-500">Atención</h2>
    </div>
    <strong class="text-primary-500">
      Hay un análisis en marcha. Los siguientes elementos aún se están
      procesando:
    </strong>
    <ul class="flex flex-wrap items-center justify-center gap-2.5">
      <li v-for="{ section } in missingData" :key="section">
        <UBadge class="animate-pulse" color="primary" variant="soft">
          {{ section }}
        </UBadge>
      </li>
    </ul>

    <strong class="text-red-500">¿Deseas interrumpir el análisis?</strong>

    <div class="flex justify-center gap-2.5">
      <UButton
        @click="hideModal"
        variant="soft"
        color="white"
        class="bg-white/10">
        Cancelar
      </UButton>
      <UButton
        @click="handleStopAnalysis"
        variant="solid"
        color="red"
        class="text-white">
        Sí, detener
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { hideModal } = useModalStore();

const { missingData } = storeToRefs(useBoeStore());
const { stopAnalysis } = useBoeStore();

const handleStopAnalysis = () => {
  stopAnalysis();
  hideModal();
};
</script>
