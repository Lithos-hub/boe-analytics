<template>
  <div class="Home__wrapper">
    <section class="flex w-full flex-wrap items-stretch justify-center gap-5">
      <article class="flex-1">
        <Card class="flex h-full flex-col justify-between">
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
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
                  a doloribus corporis dolore eligendi.
                </li>
                <li>
                  <strong>Lorem ipsum:</strong>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                  quibusdam non hic nemo omnis laudantium modi aliquam, mollitia
                  pariatur dolore exercitationem sunt ut deserunt ea. Corporis
                  odit totam amet alias.
                </li>
                <li>
                  <strong>Lorem ipsum:</strong>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
                  doloribus optio perspiciatis sunt a eveniet.
                </li>
                <li>
                  <strong>Lorem ipsum:</strong>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
                  a doloribus corporis dolore eligendi.
                </li>
                <li>
                  <strong>Lorem ipsum:</strong>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                  quibusdam non hic nemo omnis laudantium modi aliquam, mollitia
                  pariatur dolore exercitationem sunt ut deserunt ea. Corporis
                  odit totam amet alias.
                </li>
                <li>
                  <strong>Lorem ipsum:</strong>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
                  doloribus optio perspiciatis sunt a eveniet.
                </li>
              </ul>
            </div>
          </div>
          <div class="flex justify-end gap-5">
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

const boeDate = 'lunes 6 de enero de 2025';

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
