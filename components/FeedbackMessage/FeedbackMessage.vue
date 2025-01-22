<template>
  <div :class="['FeedbackMessage', `FeedbackMessage--${type}`]">
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import type { FeedbackMessageProps } from './FeedbackMessage.interfaces';

withDefaults(defineProps<FeedbackMessageProps>(), {
  type: 'info',
});
</script>

<style lang="scss" scoped>
.FeedbackMessage {
  @apply w-fit rounded-lg bg-dark-950/40 p-2.5 text-sm;

  &--success {
    @apply border border-green-500/50 bg-green-950/40 text-green-200;
  }

  &--error {
    @apply border border-red-500/50 bg-red-950/40 text-red-200;
  }

  &--info {
    @apply border border-cyan-500/50 bg-blue-950/40 text-cyan-200;
  }

  &--warning {
    @apply border border-amber-500/50 bg-amber-950/40 text-amber-200;
  }
}
</style>
