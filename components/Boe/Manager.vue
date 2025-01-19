<template>
  <div class="BoeManager__wrapper">
    <section class="grid w-full grid-cols-12 gap-5">
      <article class="col-span-12 md:col-span-8">
        <Card
          class="relative flex h-full min-h-[400px] flex-col justify-between">
          <BoeSummary
            v-if="!loadingSummary"
            :text="summary ?? ''"
            :boe-date-raw="dateRaw"
            :boe-date="currentBoeDate"
            :boe-link="boeUrl ?? ''" />
          <Loader
            v-else
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            :status-messages="[
              'Accediendo al documento...',
              'Extrayendo información...',
              'Generando resumen...',
              'Guardando en base de datos...',
            ]" />
        </Card>
      </article>
      <article class="col-span-12 md:col-span-4">
        <Card class="h-full min-h-[400px]">
          <BoeStats v-if="!loadingStats" :stats />
          <Loader
            v-else
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            :status-messages="[
              'Generando estadísticas...',
              'Generando recuento de aspectos...',
              'Guardando en base de datos...',
            ]" />
        </Card>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ScrapResponse } from '@/server/api/scrap/scrap.interfaces';
import type { Aspect, BoeResponse } from '~/models/boe';

interface Stats {
  positive: number;
  negative: number;
  neutral: number;
}

const scrapData = ref<ScrapResponse | null>(null);

const boeId = ref<number | null>(null);
const boeUrl = ref<string | null>(null);
const summary = ref<string | null>(null);
const aspects = ref<Aspect[] | null>(null);

const loadingSummary = ref(true);
const loadingStats = ref(true);

const stats = computed(() => {
  return aspects.value?.length
    ? aspects.value?.reduce(
        (acc, curr) => {
          acc[curr.type as keyof Stats] =
            (acc[curr.type as keyof Stats] || 0) + 1;
          return acc;
        },
        { positive: 0, negative: 0, neutral: 0 } as Stats,
      )
    : null;
});

// boeDate is the date in the format 'lunes 6 de enero de 2025'
const currentBoeDate = getFormattedStringDate('es', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// dateRaw is the date in the format 'YYYY-MM-DD'
const { dateRaw } = getCurrentDate();

const scrapBoe = async () => {
  const { data: boeScrapData, error } = await useFetch<ScrapResponse>(
    `/api/scrap/${dateRaw}`,
  );

  if (error.value) {
    console.error('Error scraping BOE data:', error.value);
    return;
  }

  scrapData.value = boeScrapData.value;
};

const postBoe = async () => {
  const client = useSupabaseClient();

  // If no scrap data, we don't need to post the BOE
  if (!scrapData.value) {
    return;
  }

  const { data, error } = await client
    .from('boes')
    .insert({
      date: dateRaw,
      url: scrapData.value?.url ?? '',
    })
    .select();

  if (error) {
    console.error('Error creating BOE:', error);
    return;
  }

  boeId.value = data[0].id;
};

const generateAndCreateSummary = async () => {
  if (summary.value || !scrapData.value) {
    return;
  }

  const { data, error } = await useFetch<string>(`/api/openai/summary`, {
    method: 'POST',
    body: {
      text: scrapData.value?.text ?? '',
    },
  });

  if (error.value) {
    console.error('Error getting summary:', error.value);
    return;
  }

  summary.value = data.value ?? null;

  await postSummary();
};

const generateAndCreateStats = async () => {
  if (stats.value || !scrapData.value) {
    return;
  }

  const { data, error } = await useFetch<Aspect[]>(
    `/api/openai/analysis-points`,
    {
      method: 'POST',
      body: {
        text: scrapData.value?.text ?? '',
      },
    },
  );

  if (error.value) {
    console.error('Error getting stats:', error.value);
    return;
  }

  // data returns an array of objects with the following properties:
  // - type: string (positive, negative or neutral)
  // - aspect: string (description of the aspect)

  aspects.value = data.value ?? null;

  await postAspects();
  await postStats();
};

const postSummary = async () => {
  const client = useSupabaseClient();

  const { error } = await client.from('summaries').insert({
    summary: summary.value,
    boe_id: boeId.value,
  });

  if (error) {
    console.error('Error saving summary:', error);
    return;
  }
};

const postAspects = async () => {
  const client = useSupabaseClient();

  if (!aspects.value) {
    return;
  }

  aspects.value.forEach(async ({ aspect, type }) => {
    await client.from('aspects').insert({
      boe_id: boeId.value,
      aspect,
      type,
    });
  });
};

const postStats = async () => {
  const client = useSupabaseClient();

  if (!stats.value) {
    return;
  }

  Object.entries(stats.value).forEach(async ([key, value]) => {
    await client.from('statistics').insert({
      boe_id: boeId.value,
      type: key,
      count: value,
    });
  });
};

const getBoeData = async () => {
  const client = useSupabaseClient();
  loadingSummary.value = true;
  loadingStats.value = true;

  /**
   * Steps:
   *
   * 1. We get the BOE from the database using the current date
   * 2. If the BOE exists, we get the BOE, its summary and stats
   * 3. If the BOE does not exist, we scrape the BOE and save it
   * 4. We generate the summary and save it
   * 5. We get the stats and save them
   */
  try {
    // 1. we get the BOE from the database
    const { data: boeData, error: boeError } = await client
      .from('boes')
      .select(
        `*, areas (*), statistics (*), main_points (*), keywords (*), aspects (*), summaries (*)`,
      )
      .eq('date', dateRaw)
      .single<BoeResponse>();

    // 3. If the BOE doesn't exist, we scrape the BOE and save it
    // 4. We generate the summary and save it
    if (boeError?.code === 'PGRST116' || !boeData) {
      console.error('No BOE found for today');

      await scrapBoe();
      await postBoe();
      await generateAndCreateSummary();
      loadingSummary.value = false;
      await generateAndCreateStats();
      loadingStats.value = false;
      return;
    }

    boeId.value = boeData.id;
    boeUrl.value = boeData.url;
    summary.value = boeData.summaries?.[0]?.summary ?? null;
    aspects.value = boeData.aspects;
  } catch (e) {
    console.error('Error in getBoeData:', e);
  } finally {
    loadingSummary.value = false;
    loadingStats.value = false;
  }
};

onMounted(async () => {
  await getBoeData();
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/mixins.scss' as *;

.BoeManager {
  &__wrapper {
    @apply flex w-full flex-col items-center justify-center gap-5;
  }
}
</style>
