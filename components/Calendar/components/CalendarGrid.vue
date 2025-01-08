<template>
  <div class="grid grid-cols-7 gap-2">
    <div
      v-for="day in weekDays"
      :key="day"
      class="text-center text-primary font-bold"
    >
      {{ day }}
    </div>

    <div
      class="CalendarGrid__cell CalendarGrid__empty-cell"
      v-for="day in monthDays.firstDay - 1"
      :key="day"
    ></div>

    <div
      class="CalendarGrid__cell CalendarGrid__day-cell"
      :class="{
        'CalendarGrid__day-cell--today':
          day === new Date().getDate() &&
          selectedMonth === new Date().getMonth() + 1 &&
          selectedYear === new Date().getFullYear(),
      }"
      v-for="day in monthDays.days"
      :key="day"
    >
      <div class="absolute top-2 left-2">
        {{ day }}
      </div>
    </div>

    <div
      class="CalendarGrid__cell CalendarGrid__empty-cell"
      v-for="day in monthDays.lastDay"
      :key="day"
    />
  </div>
</template>

<script setup lang="ts">
import { weekDays } from "@/components/Calendar/Calendar.const";

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
    @apply text-center text-primary font-bold rounded relative p-2 min-h-24;
  }

  &__day-cell {
    @apply bg-primary-500/10;

    &--today {
      @apply border-2 border-primary-500/50;
    }
  }

  &__empty-cell {
    @apply bg-dark-500/10;
  }
}
</style>
