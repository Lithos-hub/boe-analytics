<template>
  <div class="flex w-full gap-5">
    <!-- Chevron left to go to previous month -->
    <UButton
      icon="i-heroicons-chevron-left"
      color="primary"
      variant="soft"
      :disabled="isYearLessThan1960(selectedYear - 1) && selectedMonth === 1"
      @click="goToPreviousMonth" />

    <div class="grid w-full flex-1 grid-cols-7 gap-2">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-primary text-center font-bold">
        {{ day }}
      </div>

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
        ]">
        <div class="absolute left-2 top-2">
          {{ day }}
        </div>
        <div class="absolute bottom-2 right-2 flex gap-2">
          <!-- Go to /boe/:date page button -->
          <UButton
            v-if="!isFutureDate(selectedYear, selectedMonth, day)"
            color="primary"
            variant="soft"
            icon="i-heroicons-document-chart-bar"
            class="border border-primary-500/50"
            :to="`/boe/${formatDate(selectedYear, selectedMonth, day)}`" />
        </div>
      </div>

      <div
        v-for="day in monthDays.lastDay"
        :key="day"
        class="CalendarGrid__cell CalendarGrid__empty-cell" />
    </div>
    <!-- Chevron right to go to next month -->
    <UButton
      icon="i-heroicons-chevron-right"
      color="primary"
      variant="soft"
      :disabled="isFutureDate(selectedYear, selectedMonth + 1, 1)"
      @click="goToNextMonth" />
  </div>
</template>

<script setup lang="ts">
import { weekDays } from '@/components/Calendar/Calendar.const';

interface CalendarGridProps {
  monthDays: {
    days: number;
    firstDay: number;
    lastDay: number;
  };
  selectedMonth: number;
  selectedYear: number;
}

const { monthDays } = defineProps<CalendarGridProps>();
const emits = defineEmits(['set-previous-month', 'set-next-month']);

const goToPreviousMonth = () => {
  emits('set-previous-month');
};

const goToNextMonth = () => {
  emits('set-next-month');
};
</script>

<style scoped lang="scss">
.CalendarGrid {
  &__cell {
    @apply text-primary relative max-h-24 min-h-24 rounded p-2 text-center font-bold;
  }

  &__day-cell {
    @apply bg-primary-500/10;

    &--disabled {
      @apply bg-primary-800/10;
    }

    &--today {
      @apply border-2 border-primary-500/50;
    }
  }

  &__empty-cell {
    @apply bg-dark-500/10;
  }
}
</style>
