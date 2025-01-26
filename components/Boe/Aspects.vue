<template>
  <div>
    <ul
      v-if="!isLoadingAspects && aspects && aspects.length"
      :class="['BoeAspects__list', `BoeAspects__list--${type}`]">
      <li v-for="{ aspect, description } in aspects" :key="aspect">
        <div class="flex flex-col gap-5">
          <div class="flex items-center gap-2.5 self-stretch">
            <UIcon
              :name="`i-heroicons-${type === 'negative' ? 'x-circle' : type === 'positive' ? 'check-circle' : 'minus-circle'}`"
              class="h-6 min-h-6 w-6 min-w-6" />
            <strong class="flex items-center gap-2">
              {{ aspect }}
            </strong>
          </div>
          <p>{{ description }}</p>
        </div>
      </li>
    </ul>
    <div
      class="flex items-center justify-center p-5"
      v-else-if="isLoadingAspects">
      <Loader :status-messages="statusMessages[type]" />
    </div>
    <FeedbackMessage v-else :message="noAspectsMessage[type]" type="info" />
  </div>
</template>

<script setup lang="ts">
import type { AspectsProps } from './Aspects.interfaces';

defineProps<AspectsProps>();

const statusMessages = {
  positive: ['Generando aspectos positivos...'],
  negative: ['Generando aspectos negativos...'],
  neutral: ['Generando aspectos neutros...'],
};

const noAspectsMessage = {
  positive: 'No se han encontrado aspectos positivos.',
  negative: 'No se han encontrado aspectos negativos.',
  neutral: 'No se han encontrado aspectos neutros.',
};
</script>

<style lang="scss" scoped>
@mixin AspectItem {
  @apply my-5 rounded border p-2.5;
}

.BoeAspects__list {
  @apply flex flex-col gap-5;

  &--positive {
    @include AspectItem;
    @apply border-green-500/50 bg-green-500/10 text-green-200;
  }

  &--negative {
    @include AspectItem;
    @apply border-red-500/50 bg-red-500/10 text-red-200;
  }

  &--neutral {
    @include AspectItem;
    @apply border-gray-500/50 bg-gray-500/10 text-slate-200;
  }
}
</style>
