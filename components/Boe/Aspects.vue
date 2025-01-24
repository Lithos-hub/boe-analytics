<template>
  <div>
    <ul
      v-if="!isLoadingAspects && aspects && aspects.length"
      :class="`BoeAspects--${type}`">
      <li v-for="{ aspect, description } in aspects" :key="aspect">
        <div class="flex flex-col gap-2 py-5">
          <strong class="flex items-center gap-2">
            <UIcon
              :name="`i-heroicons-${type === 'negative' ? 'x-circle' : type === 'positive' ? 'check-circle' : 'minus-circle'}`"
              class="h-6 w-6" />
            {{ aspect }}
          </strong>
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
li strong {
  @apply min-w-[400px];
}

@mixin BoeAspectHeading {
  @apply my-0 bg-transparent pt-0 font-bold;
}

.BoeAspects--positive {
  @apply my-5 rounded border border-green-500 bg-green-500/10 p-5 text-green-200;

  h2 {
    @include BoeAspectHeading;
    @apply text-green-500;
  }
}

.BoeAspects--negative {
  @apply my-5 rounded border border-red-500 bg-red-500/10 p-5 text-red-200;

  h2 {
    @include BoeAspectHeading;
    @apply text-red-500;
  }
}

.BoeAspects--neutral {
  @apply my-5 rounded border border-slate-400 bg-slate-400/10 p-5 text-slate-200;

  h2 {
    @include BoeAspectHeading;
    @apply text-slate-500;
  }
}
</style>
