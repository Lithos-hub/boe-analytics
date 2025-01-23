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

      <NuxtLink
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
        :to="`/${formatDate(selectedYear, selectedMonth, day)}`">
        <small class="absolute left-1 top-1 text-xs">
          {{ day }}
        </small>
        <div class="absolute bottom-0 right-1">
          <!-- If boe available by date, show green check icon -->
          <UIcon
            v-if="
              availableBoesByDate(formatDate(selectedYear, selectedMonth, day))
            "
            name="i-heroicons-document-check"
            class="h-4 w-4 text-green-500"
            :class="{
              'text-green-500': availableBoesByDateAndUrl(
                formatDate(selectedYear, selectedMonth, day),
              ),
              'text-red-500': availableBoesByDateAndNoUrl(
                formatDate(selectedYear, selectedMonth, day),
              ),
            }" />
        </div>
      </NuxtLink>

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
import type { CalendarGridProps } from './CalendarGrid.interfaces';

const { monthDays, selectedYear, selectedMonth, availableBoesList } =
  defineProps<CalendarGridProps>();

const emits = defineEmits(['set-previous-month', 'set-next-month']);

const route = useRoute();

const selectedDate = route.params.date as string;

const goToPreviousMonth = () => {
  emits('set-previous-month');
};

const goToNextMonth = () => {
  emits('set-next-month');
};

const availableBoesByDate = (_date: string) => {
  return availableBoesList.map(({ date }) => date).includes(_date);
};

const availableBoesByDateAndUrl = (_date: string) => {
  return availableBoesList.some(({ date, url }) => date === _date && url);
};

const availableBoesByDateAndNoUrl = (_date: string) => {
  return availableBoesList.some(({ date, url }) => date === _date && !url);
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
      @apply border-2 border-cyan-500/50 bg-cyan-500/20 text-cyan-200;
    }
  }

  &__empty-cell {
    @apply bg-dark-500/10;
  }
}
</style>
