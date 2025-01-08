<template>
  <div class="flex flex-col gap-5">
    <CalendarFilters
      v-model:selected-month-model="selectedMonth"
      v-model:selected-year-model="selectedYear"
    />
    <CalendarGrid
      :month-days="monthDays"
      :selected-month="selectedMonth"
      :selected-year="selectedYear"
    />
  </div>
</template>

<script setup lang="ts">
import CalendarFilters from "./components/CalendarFilters.vue";
import CalendarGrid from "./components/CalendarGrid.vue";

const selectedMonth = ref(new Date().getMonth() + 1);
const selectedYear = ref(new Date().getFullYear());

const monthDays = computed(() => {
  const days = new Date(
    selectedYear.value,
    selectedMonth.value - 1,
    0
  ).getDate();
  const firstDay = new Date(
    selectedYear.value,
    selectedMonth.value - 1,
    1
  ).getDay();
  const lastDay = new Date(
    selectedYear.value,
    selectedMonth.value - 1,
    0
  ).getDay();

  return {
    days,
    firstDay,
    lastDay,
  };
});
</script>
