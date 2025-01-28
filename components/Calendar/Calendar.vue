<template>
  <div class="flex flex-col gap-2.5">
    <CalendarFilters
      v-model:selected-month-model="selectedMonth"
      v-model:selected-year-model="selectedYear" />
    <div class="flex items-center justify-center gap-5">
      <UButton
        icon="i-heroicons-chevron-left"
        color="primary"
        variant="soft"
        class="text-primary rounded-lg"
        size="xs"
        @click="setPreviousMonth" />
      <UButton
        icon="i-heroicons-chevron-right"
        color="primary"
        variant="soft"
        class="text-primary rounded-lg"
        size="xs"
        :disabled="isFutureDate(selectedYear, selectedMonth + 1, 1)"
        @click="setNextMonth" />
    </div>
    <CalendarGrid
      :month-days="monthDays"
      :selected-month="selectedMonth"
      :selected-year="selectedYear"
      :available-boes-list="availableBoeListByDates" />
  </div>
</template>

<script setup lang="ts">
import CalendarFilters from './components/CalendarFilters.vue';
import CalendarGrid from './components/CalendarGrid.vue';

const emits = defineEmits(['set-selected-date']);

const { boesList, selectedMonth, selectedYear } = storeToRefs(useBoeStore());

const availableBoeListByDates = computed(
  () => boesList.value.map(({ date, url }) => ({ date, url })) ?? [],
);

const monthDays = computed(() => {
  const days = new Date(
    selectedYear.value,
    selectedMonth.value - 1,
    0,
  ).getDate();
  const firstDay = new Date(
    selectedYear.value,
    selectedMonth.value - 1,
    1,
  ).getDay();
  const lastDay = new Date(
    selectedYear.value,
    selectedMonth.value - 1,
    0,
  ).getDay();

  return {
    days,
    firstDay,
    lastDay,
  };
});

const setPreviousMonth = () => {
  // Control if the month is the first month of the year
  if (selectedMonth.value === 1) {
    selectedMonth.value = 12;
    selectedYear.value--;
  } else {
    selectedMonth.value--;
  }
};

const setNextMonth = () => {
  if (selectedMonth.value === 12) {
    selectedMonth.value = 1;
    selectedYear.value++;
  } else {
    selectedMonth.value++;
  }
};
</script>
