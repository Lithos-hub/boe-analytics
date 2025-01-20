<template>
  <div class="Card">
    <div v-if="title">
      <strong class="text-primary">{{ title }}</strong>

      <hr class="border-primary/10 my-5 border" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { CardProps } from './Card.interfaces';

defineProps<CardProps>();
</script>

<style scoped lang="scss">
.Card {
  @apply border-primary/10 rounded-lg border-2 bg-gradient-to-tl from-transparent to-primary-500/10 p-5 shadow-xl backdrop-blur;
}
</style>
