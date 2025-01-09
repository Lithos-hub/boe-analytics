<template>
  <div class="Home__wrapper">
    <section class="flex w-full flex-wrap items-stretch justify-center gap-5">
      <article class="flex-1">
        <Card class="relative flex h-full flex-col justify-between">
          <Suspense>
            <CurrentBoe />

            <template #fallback>
              <div
                class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Loader />
              </div>
            </template>
          </Suspense>
        </Card>
      </article>
      <article class="grow-0">
        <Card>
          <strong class="text-primary">Estadísticas</strong>

          <hr class="border-primary/10 my-5 border" />

          <div class="h-auto">
            <Pie :data :options />
          </div>
        </Card>
      </article>
    </section>
    <section class="flex w-full flex-wrap justify-center gap-5">
      <article class="grow">
        <Card>
          <Calendar />
        </Card>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import { Pie } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Positivo', 'Negativo', 'Neutral'],
  datasets: [
    {
      label: 'Cantidad',
      data: [40, 40, 20],
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
@use '@/assets/scss/main.scss' as *;

.Home {
  &__wrapper {
    @apply flex flex-col items-center justify-center gap-5;
  }
}
</style>
