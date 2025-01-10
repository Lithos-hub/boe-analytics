<template>
  <div class="BoeManager__wrapper">
    <section class="flex w-full flex-wrap items-stretch justify-center gap-5">
      <article class="flex-1">
        <Card class="relative flex h-full flex-col justify-between">
          <CurrentBoe
            :text="processedBoeText?.briefSummary ?? ''"
            :boeDate="boeDate" />
        </Card>
      </article>
      <article class="h-full grow-0">
        <Card>
          <strong class="text-primary">Estadísticas</strong>

          <hr class="border-primary/10 my-5 border" />

          <div class="h-auto">
            <Pie :data :options />
          </div>
        </Card>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import { Pie } from 'vue-chartjs';

interface ProcessedBoeText {
  briefSummary: string;
  stats: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

ChartJS.register(ArcElement, Tooltip, Legend);

// const boeDate = 'lunes 6 de enero de 2025';
const boeDate = new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const currentYear = String(new Date().getFullYear());
const currentMonth = String(new Date().getMonth() + 1);
const currentDay = String(new Date().getDate());

// The formattedDate format must be 'YYYY-MM-DD'
const formattedDate = `${currentYear}-${currentMonth.padStart(2, '0')}-${currentDay.padStart(2, '0')}`;

const { data: boeText } = await useFetch<string>(`/api/scrap/${formattedDate}`);
const { data: processedBoeText } = await useFetch<ProcessedBoeText>(
  `/api/deepseek`,
  {
    method: 'POST',
    body: {
      text: boeText,
    },
  },
);

const data = {
  labels: ['Positivo', 'Negativo', 'Neutral'],
  datasets: [
    {
      label: 'Cantidad',
      data: [
        processedBoeText.value?.stats.positive ?? 0,
        processedBoeText.value?.stats.negative ?? 0,
        processedBoeText.value?.stats.neutral ?? 0,
      ],
      backgroundColor: ['#22c55e', '#f43f5e', '#71717a'],
      borderWidth: 5,
      borderColor: ['#1D1C2B', '#1D1C2B', '#1D1C2B'],
      color: 'white',
    },
  ],
};

const options = {
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
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: 'green',
              fontSize: 18,
              stepSize: 1,
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontColor: 'purple',
              fontSize: 14,
              stepSize: 1,
              beginAtZero: true,
            },
          },
        ],
      },
    },
  },
};
</script>

<style scoped lang="scss">
@use '@/assets/scss/mixins.scss' as *;

.BoeManager {
  &__wrapper {
    @apply flex flex-col items-center justify-center gap-5;
  }
}
</style>
