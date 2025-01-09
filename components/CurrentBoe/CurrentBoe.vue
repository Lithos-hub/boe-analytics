<template>
  <div>
    <div class="flex items-center justify-between">
      <strong class="text-primary">Lo más reciente</strong>
      <span>
        BOE publicado el
        <strong>{{ boeDate }}</strong>
      </span>
    </div>

    <hr class="border-primary/10 my-5 border" />

    <div class="flex flex-col gap-5">
      <strong>Principales puntos:</strong>

      <ul class="flex flex-col gap-1">
        <li>
          <strong>Lorem ipsum:</strong>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis a
          doloribus corporis dolore eligendi.
        </li>
        <li>
          <strong>Lorem ipsum:</strong>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo quibusdam
          non hic nemo omnis laudantium modi aliquam, mollitia pariatur dolore
          exercitationem sunt ut deserunt ea. Corporis odit totam amet alias.
        </li>
        <li>
          <strong>Lorem ipsum:</strong>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
          doloribus optio perspiciatis sunt a eveniet.
        </li>
        <li>
          <strong>Lorem ipsum:</strong>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis a
          doloribus corporis dolore eligendi.
        </li>
        <li>
          <strong>Lorem ipsum:</strong>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo quibusdam
          non hic nemo omnis laudantium modi aliquam, mollitia pariatur dolore
          exercitationem sunt ut deserunt ea. Corporis odit totam amet alias.
        </li>
        <li>
          <strong>Lorem ipsum:</strong>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
          doloribus optio perspiciatis sunt a eveniet.
        </li>
      </ul>
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
const boeDate = 'lunes 6 de enero de 2025';

const currentYear = String(new Date().getFullYear());
const currentMonth = String(new Date().getMonth() + 1);
const currentDay = String(new Date().getDate());

// The formattedDate format must be 'YYYY-MM-DD'
const formattedDate = `${currentYear}-${currentMonth.padStart(2, '0')}-${currentDay.padStart(2, '0')}`;

const { data: boeText } = await useFetch(`/api/scrap/${formattedDate}`);
</script>
