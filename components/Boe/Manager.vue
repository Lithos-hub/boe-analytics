<template>
  <div class="BoeManager__wrapper">
    <section class="flex w-full flex-wrap items-stretch justify-center gap-5">
      <article class="flex-1">
        <Card class="relative flex h-full flex-col justify-between">
          <BoeSummary
            :text="summaryAndStatsData?.briefSummary ?? ''"
            :boe-date-raw="boeDateRaw"
            :boe-date="boeDate"
            :boe-link="scrappedBoeData?.link ?? ''" />
        </Card>
      </article>
      <article class="grow-0 flex-col">
        <Card class="h-full">
          <BoeStats
            v-if="summaryAndStatsData"
            :stats="summaryAndStatsData?.stats" />
        </Card>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { BoeScrapingResponse, BoeSummaryResponse } from './Boe.interfaces';

export default defineComponent({
  async setup() {
    const scrappedBoeData = ref<BoeScrapingResponse | null>(null);
    const summaryAndStatsData = ref<BoeSummaryResponse | null>(null);

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

    const getBoeData = async () => {
      try {
        const { data: boeScrapData, error } =
          await useFetch<BoeScrapingResponse>(`/api/scrap/${formattedDate}`, {
            onResponseError({ response }) {
              console.error('Response error:', response._data);
            },
            onRequestError({ error }) {
              console.error('Request error:', error);
            },
          });

        if (error.value) {
          console.error('Error scraping BOE data:', error.value);
          return;
        }

        scrappedBoeData.value = boeScrapData.value;

        const { data } = await useFetch<BoeSummaryResponse>(
          `/api/html/summary`,
          {
            method: 'POST',
            body: {
              text: boeScrapData.value?.text ?? '',
            },
          },
        );

        summaryAndStatsData.value = data.value;
      } catch (e) {
        console.error('Error in getBoeData:', e);
      }
    };

    await getBoeData();

    return {
      scrappedBoeData,
      summaryAndStatsData,
      boeDate,
      boeDateRaw,
    };
  },
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/mixins.scss' as *;

.BoeManager {
  &__wrapper {
    @apply flex flex-col items-center justify-center gap-5;
  }
}
</style>
