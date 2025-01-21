<template>
  <div class="grid h-full min-h-[400px] w-full grid-cols-12 items-center gap-1">
    <!-- Chevron left to go to previous month -->
    <div
      class="relative col-span-1 flex h-full w-full flex-col items-center justify-center">
      <UButton
        icon="i-heroicons-chevron-left"
        color="dark"
        variant="soft"
        class="border border-dark-500/50"
        :disabled="isYearLessThan1960(selectedYear - 1) && selectedMonth === 1"
        @click="goToPreviousMonth" />
    </div>

    <div class="col-span-10 grid grid-cols-7 gap-1">
      <small
        v-for="day in weekDaysShort"
        :key="day"
        class="text-primary text-center font-bold">
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
        @click="handleDayClick(day)">
        <small class="absolute left-1 top-1 text-xs">
          {{ day }}
        </small>
        <div class="absolute bottom-0 right-1">
          <!-- If boe available by date, show green check icon -->
          <UIcon
            v-if="
              boesAvailableByDates.includes(
                formatDate(selectedYear, selectedMonth, day),
              )
            "
            name="i-heroicons-check"
            class="h-3 w-3 text-green-500" />
        </div>
      </div>

      <div
        v-for="day in monthDays.lastDay"
        :key="day"
        class="CalendarGrid__cell CalendarGrid__empty-cell" />
    </div>
    <!-- Chevron right to go to next month -->
    <div
      class="relative col-span-1 flex h-full w-full flex-col items-center justify-center">
      <UButton
        icon="i-heroicons-chevron-right"
        color="dark"
        variant="soft"
        class="border border-dark-500/50"
        :disabled="isFutureDate(selectedYear, selectedMonth + 1, 1)"
        @click="goToNextMonth" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { weekDaysShort } from '@/components/Calendar/Calendar.const';

interface CalendarGridProps {
  monthDays: {
    days: number;
    firstDay: number;
    lastDay: number;
  };
  selectedMonth: number;
  selectedYear: number;
  selectedDate: string;
  boesAvailableByDates: string[];
}

const {
  monthDays,
  boesAvailableByDates,
  selectedDate,
  selectedYear,
  selectedMonth,
} = defineProps<CalendarGridProps>();
const emits = defineEmits([
  'set-previous-month',
  'set-next-month',
  'set-selected-date',
]);

const goToPreviousMonth = () => {
  emits('set-previous-month');
};

const goToNextMonth = () => {
  emits('set-next-month');
};

const handleDayClick = (day: number) => {
  emits('set-selected-date', formatDate(selectedYear, selectedMonth, day));
};
</script>

<style scoped lang="scss">
.CalendarGrid {
  $self: &;

  &__cell {
    @apply text-primary relative h-12 rounded p-2 text-center font-bold;
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
      @apply border-2 border-primary-500/50;
    }

    &--selected {
      @apply border-2 border-secondary-500/50 bg-secondary-500/20 text-secondary-200;
    }
  }

  &__empty-cell {
    @apply bg-dark-500/10;
  }
}
</style>
