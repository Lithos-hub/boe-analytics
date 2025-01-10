<template>
  <div>
    <div class="flex items-center justify-between">
      <strong class="text-primary">Lo más reciente</strong>
      <span>
        BOE publicado el
        <strong class="text-primary">{{ boeDate }}</strong>
      </span>
    </div>

    <hr class="border-primary/10 my-5 border" />

    <div class="flex flex-col gap-5">
      <div v-if="text">
        <div v-html="text" class="text-justify" />
      </div>
    </div>
  </div>
  <div class="flex justify-end gap-5 pt-5">
    <UButton
      color="primary"
      variant="soft"
      icon="i-heroicons-document-chart-bar"
      class="border border-primary-500/50">
      Consultar análisis
    </UButton>
    <UButton
      color="secondary"
      variant="soft"
      class="border border-secondary-500/50"
      icon="i-heroicons-arrow-top-right-on-square">
      Ver BOE original
    </UButton>
  </div>
</template>

<script setup lang="ts">
interface CurrentBoeProps {
  text: string;
  boeDate: string;
}

defineProps<CurrentBoeProps>();
</script>
