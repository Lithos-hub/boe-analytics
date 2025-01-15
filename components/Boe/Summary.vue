<template>
  <div>
    <div class="flex items-center justify-between">
      <strong class="text-primary">Lo más reciente</strong>
      <strong class="text-secondary">{{ boeDate }}</strong>
    </div>

    <hr class="border-primary/10 my-5 border" />

    <div class="flex flex-col gap-5">
      <div v-if="text">
        <div v-html="text" class="text-justify" />
      </div>
      <div v-else>
        <p class="text-red-500">
          El BOE de hoy no está disponible. Inténtalo más tarde o consulta el
          BOE de otra fecha usando el calendario.
        </p>
      </div>
    </div>
  </div>
  <div class="flex justify-end gap-5 pt-5">
    <UButton
      color="primary"
      variant="soft"
      icon="i-heroicons-document-chart-bar"
      class="border border-primary-500/50"
      :disabled="!text"
      :to="`/boe/${boeDateRaw}`">
      Consultar análisis
    </UButton>
    <UButton
      color="secondary"
      variant="soft"
      class="border border-secondary-500/50"
      icon="i-heroicons-arrow-top-right-on-square"
      :disabled="!boeLink"
      :to="boeLink"
      target="_blank">
      Ver BOE original
    </UButton>
  </div>
</template>

<script setup lang="ts">
interface CurrentBoeProps {
  text: string;
  boeDateRaw: string;
  boeDate: string;
  boeLink: string;
}

defineProps<CurrentBoeProps>();
</script>
