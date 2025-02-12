<template>
  <div class="h-[280px] w-full">
    <div class="grid grid-cols-7 gap-1">
      <small
        v-for="day in weekDaysShort"
        :key="day"
        class="text-primary text-center text-xs">
        {{ day }}
      </small>

      <div
        v-for="day in monthDays.firstDay !== 0 ? monthDays.firstDay - 1 : 0"
        :key="day"
        class="CalendarGrid__cell CalendarGrid__empty-cell" />

      <div
        v-for="day in monthDays.days"
        :key="day"
        :class="[
          'CalendarGrid__cell',
          'CalendarGrid__day-cell',
          {
            'CalendarGrid__day-cell--selected':
              formatDate(selectedYear, selectedMonth, day) === selectedDate,
            'CalendarGrid__day-cell--disabled': isFutureDate(
              selectedYear,
              selectedMonth,
              day,
            ),
            'CalendarGrid__day-cell--today': isToday(
              selectedYear,
              selectedMonth,
              day,
            ),
          },
        ]"
        @click="handleDayCellClick(day)">
        <small class="absolute left-1 top-1 text-xs">
          {{ day }}
        </small>
        <div class="absolute bottom-1 right-1">
          <!-- If boe available by date, show green check icon -->
          <div
            v-if="
              availableBoesByDate(formatDate(selectedYear, selectedMonth, day))
            "
            class="h-2 w-2 rounded-full"
            :class="{
              'bg-green-500': availableBoesByDateAndUrl(
                formatDate(selectedYear, selectedMonth, day),
              ),
              'bg-red-500': availableBoesByDateAndNoUrl(
                formatDate(selectedYear, selectedMonth, day),
              ),
            }" />
        </div>
      </div>

      <div
        v-for="day in monthDays.lastDay"
        :key="day"
        class="CalendarGrid__cell CalendarGrid__empty-cell" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { weekDaysShort } from '@/components/Calendar/Calendar.const';
import type { CalendarGridProps } from './CalendarGrid.interfaces';

const { monthDays, selectedYear, selectedMonth, availableBoesList } =
  defineProps<CalendarGridProps>();

const route = useRoute();
const router = useRouter();

const { showModal } = useModalStore();
const { isLoadingAnalysis } = storeToRefs(useBoeStore());

const selectedDate = computed(() => route.params.date as string);

const availableBoesByDate = (_date: string) => {
  return availableBoesList.map(({ date }) => date).includes(_date);
};

const availableBoesByDateAndUrl = (_date: string) => {
  return availableBoesList.some(({ date, url }) => date === _date && url);
};

const availableBoesByDateAndNoUrl = (_date: string) => {
  return availableBoesList.some(({ date, url }) => date === _date && !url);
};

const handleDayCellClick = (day: number) => {
  if (isFutureDate(selectedYear, selectedMonth, day)) return;

  if (isLoadingAnalysis.value) {
    showModal('StopFetch');
    return;
  }

  router.push({ path: formatDate(selectedYear, selectedMonth, day) });
};
</script>

<style scoped lang="scss">
.CalendarGrid {
  $self: &;

  &__cell {
    @apply text-primary relative h-10 rounded p-2 text-center font-bold;
  }

  &__day-cell {
    @apply border border-primary-500/20 bg-primary-500/10;

    &:hover:not(#{$self}__day-cell--disabled):not(
        #{$self}__day-cell--selected
      ) {
      @apply cursor-pointer bg-primary-500/20;
    }

    &--disabled {
      @apply cursor-not-allowed bg-primary-800/10;
    }

    &--today {
      @apply border border-primary-500/50;
    }

    &--selected {
      @apply border border-cyan-500/50 bg-cyan-500/20 text-cyan-200;
    }
  }

  &__empty-cell {
    @apply bg-dark-500/10;
  }
}
</style>
