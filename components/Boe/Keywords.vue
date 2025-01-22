<template>
  <div class="BoeAnalytics__keywords">
    <ul
      v-if="!isLoadingKeywords && keywords && keywords.length"
      class="BoeAnalytics__keywords-list">
      <li v-for="keyword in keywords" :key="keyword">
        <UBadge color="blue" variant="soft">{{ keyword }}</UBadge>
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
      @apply flex flex-wrap gap-2;
    }
  }
}
</style>
