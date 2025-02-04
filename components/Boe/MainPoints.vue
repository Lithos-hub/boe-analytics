<template>
  <div class="BoeAnalytics__main-points">
    <ol
      v-if="!isLoadingMainPoints && mainPoints && mainPoints.length"
      class="BoeAnalytics__main-points-list">
      <li v-for="point in mainPoints" :key="point" class="list-decimal">
        {{ point }}
      </li>
    </ol>
    <div
      class="flex items-center justify-center p-5"
      v-else-if="isLoadingMainPoints">
      <Loader :status-messages="loadingMainPointsMessages" />
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
              specificDataToGenerate: 'main_points',
            })
        ">
        Reintentar
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MainPointsProps } from './MainPoints.interfaces';

defineProps<MainPointsProps>();

const loadingMainPointsMessages = [
  'Accediendo al documento...',
  'Extrayendo información...',
  'Generando puntos principales...',
  'Guardando en base de datos...',
];

const { generateAndPostMissingData } = useBoeStore();
</script>

<style lang="scss" scoped>
.BoeAnalytics {
  &__main-points {
    ol {
      @apply flex flex-col gap-2 pl-5 text-justify;
    }
  }
}
</style>
