<template>
  <div class="Home__wrapper">
    <section class="flex flex-wrap justify-center gap-5">
      <article class="col-span-9">
        <Card>
          <div class="flex items-center justify-between">
            <strong class="text-primary">Lo más reciente</strong>
            <span>{{ boeDate }}</span>
          </div>

          <hr class="my-5 border border-primary/10" />

          <div class="flex flex-col gap-5">
            <strong>Puntos destacados:</strong>

            <ul>
              <li>
                Punto 1. Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Quis a doloribus corporis dolore eligendi.
              </li>
              <li>
                Punto 2. Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Quis a doloribus corporis dolore eligendi.
              </li>
              <li>
                Punto 3. Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Quis a doloribus corporis dolore eligendi.
              </li>
            </ul>

            <div class="flex gap-5">
              <UButton
                color="primary"
                variant="soft"
                class="border-primary-500/50 border"
                >Ver resumen y análisis</UButton
              >
              <UButton
                color="secondary"
                variant="soft"
                class="border-secondary-500/50 border"
                >Acceder al BOE original
              </UButton>
            </div>
          </div>
        </Card>
      </article>
      <article class="col-span-3">
        <Card>
          <strong class="text-primary">Estadísticas</strong>

          <hr class="my-5 border border-primary/10" />

          <div>
            <Pie :data :options />
          </div>
        </Card>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Pie } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

const boeDate = "lunes 6 de enero de 2025";

const data = ref({
  labels: ["Positivo", "Negativo", "Neutral"],
  datasets: [
    {
      label: "Cantidad",
      data: [40, 40, 20],
      backgroundColor: ["#22c55e", "#f43f5e", "#71717a"],
      borderWidth: 5,
      borderColor: ["#1D1C2B", "#1D1C2B", "#1D1C2B"],
      color: "white",
    },
  ],
});

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "white",
        font: {
          size: 10,
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: "green",
              fontSize: 18,
              stepSize: 1,
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontColor: "purple",
              fontSize: 14,
              stepSize: 1,
              beginAtZero: true,
            },
          },
        ],
      },
    },
  },
});
</script>

<style scoped lang="scss">
@use "@/assets/scss/main.scss" as *;

.Home {
  &__wrapper {
    @apply flex items-center justify-center h-screen max-w-[95vw] mx-auto;
  }
}
</style>
