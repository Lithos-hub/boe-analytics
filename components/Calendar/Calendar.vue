<template>
  <div class="flex min-h-[410px] flex-col gap-5">
    <CalendarFilters
      v-model:selected-month-model="selectedMonth"
      v-model:selected-year-model="selectedYear" />
    <CalendarGrid
      :month-days="monthDays"
      :selected-month="selectedMonth"
      :selected-year="selectedYear"
      :selected-date="selectedDate"
      :boes-available-by-dates="availableBoeListByDates"
      @set-previous-month="setPreviousMonth"
      @set-next-month="setNextMonth"
      @set-selected-date="setSelectedDate" />
  </div>
</template>

<script setup lang="ts">
import CalendarFilters from './components/CalendarFilters.vue';
import CalendarGrid from './components/CalendarGrid.vue';

const client = useSupabaseClient();

const selectedMonth = ref(new Date().getMonth() + 1);
const selectedYear = ref(new Date().getFullYear());
const selectedDate = ref('');

const boesList = ref<{ date: string }[]>([]);

const availableBoeListByDates = computed(
  () => boesList.value?.map((boe) => boe.date) ?? [],
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

const setSelectedDate = (date: string) => {
  selectedDate.value = date;
};

const getAllBoes = async () => {
  const { data, error } = await client.from('boes').select('date');
  if (error) {
    console.error('Error getting all BOEs:', error);
    return;
  }
  boesList.value = data;
};

onMounted(async () => {
  await getAllBoes();
});
</script>
