<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-5">
      <div v-if="text">
        <div v-html="text" class="text-justify" />
      </div>
      <div
        class="flex items-center justify-center p-5"
        v-else-if="isLoadingSummary">
        <Loader :status-messages="loadingSummaryMessages" />
      </div>
      <div v-else class="flex flex-col items-center justify-center gap-5">
        <p class="text-red-500">No se ha podido generar la información.</p>
        <UButton
          color="primary"
          variant="soft"
          icon="i-heroicons-arrow-path"
          @click="
            () =>
              generateAndPostMissingData({
                specificDataToGenerate: 'summary',
              })
          ">
          Reintentar
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SummaryProps } from './Summary.interfaces';
defineProps<SummaryProps>();

const loadingSummaryMessages = [
  'Accediendo al documento...',
  'Extrayendo información...',
  'Generando resumen...',
  'Guardando en base de datos...',
];

const { generateAndPostMissingData } = useBoeStore();
</script>
