<template>
  <div class="Home__wrapper">
    <section class="flex flex-wrap justify-center gap-5 w-full">
      <article class="flex-1 w-full h-full">
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
      <article class="grow-0">
        <Card>
          <strong class="text-primary">Estadísticas</strong>

          <hr class="my-5 border border-primary/10" />

          <div>
            <Pie :data :options />
          </div>
        </Card>
      </article>
    </section>
    <section class="flex flex-wrap justify-center gap-5 w-full">
      <article class="grow">
        <Card>
          <div class="flex gap-5">
            <div class="flex flex-col gap-1 flex-1 w-full">
              <label class="text-primary font-bold">Buscar</label>
              <UInput
                v-model="search"
                color="primary"
                label="Buscar"
                placeholder="Introducte un término de búsqueda"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-primary font-bold">Mes</label>

              <USelectMenu
                v-model="month"
                color="primary"
                :options="months"
                option-attribute="name"
                class="min-w-20"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-primary font-bold">Año</label>
              <USelectMenu
                v-model="year"
                color="primary"
                :options="years"
                option-attribute="name"
                class="min-w-20"
              />
            </div>
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

const search = ref("");
const month = ref("Enero");
const year = ref(new Date().getFullYear());

const boeDate = "lunes 6 de enero de 2025";

const data = {
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
};

const options = {
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
};

const months = [
  {
    name: "Enero",
    value: 1,
  },
  {
    name: "Febrero",
    value: 2,
  },
  {
    name: "Marzo",
    value: 3,
  },
  {
    name: "Abril",
    value: 4,
  },
  {
    name: "Mayo",
    value: 5,
  },
  {
    name: "Junio",
    value: 6,
  },
  {
    name: "Julio",
    value: 7,
  },
  {
    name: "Agosto",
    value: 8,
  },
  {
    name: "Septiembre",
    value: 9,
  },
  {
    name: "Octubre",
    value: 10,
  },
  {
    name: "Noviembre",
    value: 11,
  },
  {
    name: "Diciembre",
    value: 12,
  },
];

// The first released BOE year is 1960
const years = Array.from(
  { length: new Date().getFullYear() - 1960 + 1 },
  (_, i) => ({
    name: `${1960 + i}`,
    value: 1960 + i,
  })
);
</script>

<style scoped lang="scss">
@use "@/assets/scss/main.scss" as *;

.Home {
  &__wrapper {
    @apply flex items-center justify-center flex-col gap-5;
  }
}
</style>
