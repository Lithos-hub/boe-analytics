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

const client = useSupabaseClient();

const emits = defineEmits(['set-selected-date']);

const route = useRoute();

const dateParam = route.params.date as string;
const month = dateParam.split('-')[1];
const year = dateParam.split('-')[0];

const selectedMonth = ref(Number(month));
const selectedYear = ref(Number(year));

const selectedDate = formatDateToLocaleString(dateParam);
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
