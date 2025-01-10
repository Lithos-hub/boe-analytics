<template>
  <div class="grid grid-cols-7 gap-2">
    <div
      v-for="day in weekDays"
      :key="day"
      class="text-primary text-center font-bold">
      {{ day }}
    </div>

    <div
      v-for="day in monthDays.firstDay - 1"
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
</script>

<style scoped lang="scss">
.CalendarGrid {
  &__cell {
    @apply text-primary relative min-h-24 rounded p-2 text-center font-bold;
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
