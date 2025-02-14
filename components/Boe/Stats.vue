<template>
  <div v-if="stats">
    <div class="h-[200px]">
      <Pie :data :options />
    </div>
  </div>
  <div v-else-if="isLoadingStats">
    <Loader :status-messages="loadingStatsMessages" />
  </div>
  <div v-else class="flex flex-col items-center justify-center gap-5">
    <p class="text-red-500">No se ha podido generar la información.</p>
    <UButton
      color="primary"
      variant="soft"
      icon="i-heroicons-arrow-path"
      @click="
        () =>
          generateAndPostMissingData({
            specificDataToGenerate: 'aspects',
          })
      ">
      Reintentar
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import type { StatsProps } from './Stats.interfaces';

const loadingStatsMessages = [
  'Accediendo al documento...',
  'Extrayendo información...',
  'Generando estadísticas...',
];

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<StatsProps>();

const { generateAndPostMissingData } = useBoeStore();

const data = computed<ChartData<'pie'>>(() => ({
  labels: ['Aspectos positivos', 'Aspectos negativos', 'Aspectos neutrales'],
  datasets: [
    {
      label: 'Cantidad',
      data: [
        props.stats?.positive ?? 0,
        props.stats?.negative ?? 0,
        props.stats?.neutral ?? 0,
      ],
      backgroundColor: ['#22c55e', '#f43f5e', '#71717a'],
      borderWidth: 5,
      borderColor: ['#1D1C2B', '#1D1C2B', '#1D1C2B'],
    },
  ],
}));

const options: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: 'white',
        font: {
          size: 10,
        },
      },
      position: 'left',
    },
  },
};
</script>
