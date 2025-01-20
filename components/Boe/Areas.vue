<template>
  <div class="BoeAnalytics__areas">
    <ul
      v-if="!isLoadingAreas && areas && areas.length"
      class="BoeAnalytics__areas-list">
      <li v-for="{ name, description } in areas" :key="name">
        <article class="BoeAnalytics__area-item-card">
          <strong class="BoeAnalytics__area-item--title">
            {{ name }}
          </strong>
          <p class="BoeAnalytics__area-item--description">
            {{ description }}
          </p>
        </article>
      </li>
    </ul>
    <div
      class="flex items-center justify-center p-5"
      v-else-if="isLoadingAreas">
      <Loader :status-messages="['Generando áreas afectadas...']" />
    </div>
    <p class="text-red-500" v-else>No se ha podido generar la información.</p>
  </div>
</template>

<script setup lang="ts">
import type { AreasProps } from './Areas.interfaces';

defineProps<AreasProps>();
</script>

<style lang="scss" scoped>
.BoeAnalytics {
  &__areas {
    ul {
      @apply grid grid-cols-2 gap-5;
    }

    .BoeAnalytics__area-item-card {
      @apply flex h-full flex-col gap-5 rounded-2xl border border-dark-500/50 bg-dark-950/40;
    }

    .BoeAnalytics__area-item--title {
      @apply min-h-[76px] p-2.5 text-center text-xl font-bold text-primary-500;
    }

    .BoeAnalytics__area-item--description {
      @apply px-5 pb-5 text-justify text-sm;
    }
  }
}
</style>
