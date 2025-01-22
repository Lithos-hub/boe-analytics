<template>
  <div class="flex flex-col">
    <CalendarFilters
      v-model:selected-month-model="selectedMonth"
      v-model:selected-year-model="selectedYear" />
    <CalendarGrid
      :month-days="monthDays"
      :selected-month="selectedMonth"
      :selected-year="selectedYear"
      :boes-available-by-dates="availableBoeListByDates"
      @set-previous-month="setPreviousMonth"
      @set-next-month="setNextMonth" />
  </div>
</template>

<script setup lang="ts">
import CalendarFilters from './components/CalendarFilters.vue';
import CalendarGrid from './components/CalendarGrid.vue';
import type { CalendarProps } from './Calendar.interfaces';

const emits = defineEmits(['set-selected-date']);

const { boesList } = defineProps<CalendarProps>();

const route = useRoute();

const dateParam = route.params.date as string;
const month = dateParam.split('-')[1];
const year = dateParam.split('-')[0];

const selectedMonth = ref(Number(month));
const selectedYear = ref(Number(year));

const availableBoeListByDates = computed(
  () => boesList?.map(({ date }) => date) ?? [],
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
