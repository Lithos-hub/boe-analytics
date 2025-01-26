<template>
  <div class="Card">
    <header v-if="title" class="Card__header">
      <strong class="Card__header--title">{{ title }}</strong>
    </header>
    <div class="Card__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardProps } from './Card.interfaces';

defineProps<CardProps>();
</script>

<style scoped lang="scss">
.Card {
  @apply border-primary/10 rounded-lg border-2 bg-gradient-to-tl from-transparent to-primary-500/10 shadow-xl backdrop-blur;

  &__header {
    @apply flex flex-col items-center justify-center gap-2.5 border-b border-b-primary-500/10 bg-[#161420];

    &--title {
      @apply text-primary p-2.5 text-center font-bold;
    }
  }

  &__content {
    @apply h-[350px] max-h-[450px] overflow-y-auto p-5;
  }
}
</style>
