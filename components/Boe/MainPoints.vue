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
    <p class="text-red-500" v-else>No se ha podido generar la información.</p>
  </div>
</template>

<script setup lang="ts">
import type { MainPointsProps } from './MainPoints.interfaces';

defineProps<MainPointsProps>();

const loadingMainPointsMessages = [
  'Accediendo al documento...',
  'Extrayendo información...',
  'Generando puntos clave...',
  'Guardando en base de datos...',
];
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
