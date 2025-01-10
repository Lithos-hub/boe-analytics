<template>
  <strong class="text-primary">Estadísticas</strong>

  <hr class="border-primary/10 my-5 border" />

  <div class="h-auto">
    <Pie :data :options />
  </div>
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ProcessedBoeStats } from './Boe.interfaces';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BoeStatsProps {
  stats: ProcessedBoeStats;
}

const props = defineProps<BoeStatsProps>();

const data = {
  labels: ['Positivo', 'Negativo', 'Neutral'],
  datasets: [
    {
      label: 'Cantidad',
      data: [
        props.stats.positive ?? 0,
        props.stats.negative ?? 0,
        props.stats.neutral ?? 0,
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
