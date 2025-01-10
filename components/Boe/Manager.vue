<template>
  <div class="BoeManager__wrapper">
    <section class="flex w-full flex-wrap items-stretch justify-center gap-5">
      <article class="flex-1">
        <Card class="relative flex h-full flex-col justify-between">
          <BoeSummary
            :text="processedBoeData?.briefSummary ?? ''"
            :boe-date-raw="boeDateRaw"
            :boe-date="boeDate"
            :boe-link="boeData?.link ?? ''" />
        </Card>
      </article>
      <article class="h-full grow-0">
        <Card>
          <BoeStats
            :stats="
              processedBoeData?.stats ?? {
                positive: 0,
                negative: 0,
                neutral: 0,
              }
            " />
        </Card>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { BoeData, ProcessedBoeText } from './Boe.interfaces';

// boeDate is the date in the format 'lunes 6 de enero de 2025'
const boeDate = new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// boeDateRaw is the date in the format 'YYYY-MM-DD'
const boeDateRaw = new Date().toISOString().split('T')[0];

const currentYear = String(new Date().getFullYear());
const currentMonth = String(new Date().getMonth() + 1);
const currentDay = String(new Date().getDate());

// The formattedDate format must be 'YYYY-MM-DD'
const formattedDate = `${currentYear}-${currentMonth.padStart(2, '0')}-${currentDay.padStart(2, '0')}`;

const { data: boeData } = await useFetch<BoeData>(
  `/api/scrap/${formattedDate}`,
);

// TODO: Split the boeData.text into chunks of 65536 tokens

const { data: processedBoeData } = await useFetch<ProcessedBoeText>(
  `/api/boe-summary`,
  {
    method: 'POST',
    body: {
      text: boeData.value?.text ?? '',
    },
  },
);
</script>

<style scoped lang="scss">
@use '@/assets/scss/mixins.scss' as *;

.BoeManager {
  &__wrapper {
    @apply flex flex-col items-center justify-center gap-5;
  }
}
</style>
