<template>
  <div class="flex flex-col gap-5">
    <strong class="text-primary-500">BOE publicado el {{ boeDate }}</strong>

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
