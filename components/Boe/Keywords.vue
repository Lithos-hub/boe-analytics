<template>
  <div class="BoeAnalytics__keywords">
    <ul
      v-if="!isLoadingKeywords && keywords && keywords.length"
      class="BoeAnalytics__keywords-list">
      <li v-for="keyword in keywords" :key="keyword">
        <small>{{ keyword }}</small>
      </li>
    </ul>
    <div
      class="flex items-center justify-center p-5"
      v-else-if="isLoadingKeywords">
      <Loader :status-messages="['Generando palabras clave...']" />
    </div>
    <p class="text-red-500" v-else>No se ha podido generar la información.</p>
  </div>
</template>

<script setup lang="ts">
import type { KeywordsProps } from './Keywords.interfaces';

defineProps<KeywordsProps>();
</script>

<style lang="scss" scoped>
.BoeAnalytics {
  &__keywords {
    ul {
      @apply flex flex-wrap gap-1;

      li {
        @apply bg-primary/10 rounded-full border border-primary-500 px-5 py-1 text-sm font-bold text-primary-200;
      }
    }
  }
}
</style>
