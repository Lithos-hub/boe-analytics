<template>
  <div class="flex flex-col gap-5">
    <header class="flex flex-wrap items-center justify-between gap-5 pt-5">
      <div class="flex flex-wrap gap-5">
        <UButton
          color="secondary"
          variant="soft"
          class="border border-secondary-500/50"
          icon="i-heroicons-arrow-top-right-on-square"
          :to="boeUrl"
          target="_blank">
          Ver BOE original
        </UButton>
        <UButton
          color="green"
          variant="soft"
          class="border border-green-500/50"
          icon="i-heroicons-arrow-down-tray"
          disabled
          @click="downloadPDF">
          Descargar PDF
        </UButton>
        <!-- Analyze again -->
        <!-- <UButton
            color="primary"
            variant="soft"
            class="border border-primary-500/50"
            icon="i-heroicons-arrow-path"
            @click="fetchAnalytics">
            Analizar de nuevo
          </UButton> -->
        <!-- Show JSON || Show Analysis -->
        <UButton
          color="dark"
          variant="soft"
          class="border border-dark-500/50"
          :icon="
            showJSON
              ? 'i-heroicons-document-chart-bar'
              : 'i-heroicons-code-bracket'
          "
          @click="showJSON = !showJSON">
          {{ showJSON ? 'Ver análisis' : 'Ver JSON' }}
        </UButton>
      </div>
      <div
        v-if="wordsCount"
        class="h-auto rounded-lg border border-cyan-500/50 bg-blue-950 p-1 px-5 text-right text-cyan-200">
        <p>El documento contiene aproximadamente {{ wordsCount }} palabras.</p>
      </div>
    </header>
    <div class="Home__wrapper" v-if="!showJSON">
      <section class="Home__calendar">
        <article class="h-full">
          <Card class="Home__calendar--card" title="Calendario">
            <Calendar />
          </Card>
        </article>
      </section>
      <section class="Home__summary">
        <article class="h-full">
          <Card class="Home__summary--card" title="Resumen">
            <BoeSummary
              v-if="!isLoadingSummary"
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
      </section>
      <section class="Home__stats">
        <article class="h-full">
          <Card class="Home__stats--card" title="Estadísticas">
            <BoeStats v-if="!isLoadingAspects" :stats />
            <Loader
              v-else
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              :status-messages="[
                'Accediendo al documento...',
                'Extrayendo información...',
                'Generando estadísticas...',
                'Guardando en base de datos...',
              ]" />
          </Card>
        </article>
      </section>
      <section class="Home__mainPoints">
        <article class="h-full">
          <Card class="Home__mainPoints--card" title="Puntos clave del boletín">
            <BoeMainPoints
              :main-points
              :is-loading-main-points="isLoadingMainPoints" />
          </Card>
        </article>
      </section>
      <section class="Home__keywords">
        <article class="h-full">
          <Card class="Home__keywords--card" title="Palabras clave">
            <BoeKeywords :keywords :is-loading-keywords="isLoadingKeywords" />
          </Card>
        </article>
      </section>
      <section class="Home__areas">
        <article class="h-full">
          <Card class="Home__areas--card" title="Áreas">
            <BoeAreas :areas :is-loading-areas="isLoadingAreas" />
          </Card>
        </article>
      </section>
      <section class="Home__aspects Home__aspects--positive">
        <article class="h-full">
          <Card class="Home__aspects--card" title="Aspectos positivos">
            <BoeAspects
              type="positive"
              :aspects="positiveAspects"
              :is-loading-aspects="isLoadingAspects" />
          </Card>
        </article>
      </section>
      <section class="Home__aspects Home__aspects--negative">
        <article class="h-full">
          <Card class="Home__aspects--card" title="Aspectos negativos">
            <BoeAspects
              type="negative"
              :aspects="negativeAspects"
              :is-loading-aspects="isLoadingAspects" />
          </Card>
        </article>
      </section>
      <section class="Home__aspects Home__aspects--neutral">
        <article class="h-full">
          <Card class="Home__aspects--card" title="Aspectos neutros">
            <BoeAspects
              type="neutral"
              :aspects="neutralAspects"
              :is-loading-aspects="isLoadingAspects" />
          </Card>
        </article>
      </section>
    </div>
    <div v-else class="relative">
      <pre class="rounded-2xl bg-dark-950/40 p-5 text-green-500">{{
        boeAnalysisJSON
      }}</pre>
      <!-- Button to copy JSON to clipboard -->
      <div
        class="absolute right-10 top-5 flex w-[80px] flex-col items-center gap-2">
        <UButton
          color="green"
          variant="soft"
          icon="i-heroicons-clipboard-document-list"
          @click="copyToClipboard(boeAnalysisJSON)" />
        <div
          class="rounded-full bg-dark-950/50 px-2 py-1 text-center"
          v-if="showCopiedText">
          <small class="text-green-500">Copiado!</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScrapResponse } from '@/server/api/scrap/scrap.interfaces';
import type {
  Area,
  Aspect,
  BoeResponse,
  Keyword,
  MainPoint,
} from '~/models/boe';

interface Stats {
  positive: number;
  negative: number;
  neutral: number;
}

const client = useSupabaseClient();

// State
const scrapData = ref<ScrapResponse | null>(null);
const boeUrl = ref<string>('');
const boeId = ref<number | null>(null);

const showJSON = ref(false);

const isLoadingSummary = ref(true);
const isLoadingMainPoints = ref(true);
const isLoadingKeywords = ref(true);
const isLoadingAreas = ref(true);
const isLoadingAspects = ref(true);

const showCopiedText = ref(false);

const summary = ref<string>('');
const mainPoints = ref<string[]>([]);
const keywords = ref<string[]>([]);
const areas = ref<Area[]>([]);
const aspects = ref<Aspect[]>([]);

// Computed
const wordsCount = computed(
  () => scrapData.value?.text?.split(' ').length ?? 0,
);

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

const positiveAspects = computed(() =>
  aspects.value?.filter(({ type }) => type === 'positive'),
);
const negativeAspects = computed(() =>
  aspects.value?.filter(({ type }) => type === 'negative'),
);
const neutralAspects = computed(() =>
  aspects.value?.filter(({ type }) => type === 'neutral'),
);

const boeAnalysisJSON = computed(() =>
  JSON.stringify(
    {
      'puntos principales': mainPoints.value,
      'palabras clave': keywords.value,
      'áreas afectadas': areas.value,
      'aspectos a destacar': aspects.value,
    },
    null,
    2,
  ),
);

const currentBoeDate = getFormattedStringDate('es', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const { dateRaw } = getCurrentDate();

// Methods
const downloadPDF = () => {
  console.log('downloadPDF');
};

const scrapBoe = async () => {
  try {
    const response = await $fetch<ScrapResponse>(`/api/scrap/${dateRaw}`);
    scrapData.value = response;
    boeUrl.value = response?.url ?? '';
  } catch (error) {
    console.error('Error scraping BOE data:', error);
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  showCopiedText.value = true;

  setTimeout(() => {
    showCopiedText.value = false;
  }, 2000);
};

const generateSummary = async () => {
  if (!scrapData.value) {
    return;
  }

  try {
    return await $fetch<string>(`/api/openai/summary`, {
      method: 'POST',
      body: {
        text: scrapData.value?.text ?? '',
      },
    });
  } catch (error) {
    console.error('Error generating summary:', error);
  }
};

const generateMainPoints = async (): Promise<MainPoint[] | undefined> => {
  if (mainPoints.value.length || !scrapData.value) {
    return undefined;
  }

  try {
    return await $fetch<MainPoint[]>(`/api/openai/main-points`, {
      method: 'POST',
      body: {
        text: scrapData.value?.text ?? '',
      },
    });
  } catch (error) {
    console.error('Error getting main points:', error);
  }
};

const generateKeywords = async (): Promise<Keyword[] | undefined> => {
  if (keywords.value.length || !scrapData.value) {
    return undefined;
  }

  try {
    return await $fetch<Keyword[]>(`/api/openai/keywords`, {
      method: 'POST',
      body: {
        text: scrapData.value?.text ?? '',
      },
    });
  } catch (error) {
    console.error('Error getting keywords:', error);
  }
};

const generateAreas = async (): Promise<Area[] | undefined> => {
  if (areas.value.length || !scrapData.value) {
    return undefined;
  }

  try {
    return await $fetch<Area[]>(`/api/openai/areas`, {
      method: 'POST',
      body: {
        text: scrapData.value?.text ?? '',
      },
    });
  } catch (error) {
    console.error('Error getting areas:', error);
  }
};

const generateAspects = async (): Promise<Aspect[] | undefined> => {
  if (aspects.value.length || !scrapData.value) {
    return undefined;
  }

  try {
    return await $fetch<Aspect[]>(`/api/openai/analysis-points`, {
      method: 'POST',
      body: {
        text: scrapData.value?.text ?? '',
      },
    });
  } catch (error) {
    console.error('Error getting aspects:', error);
  }
};

const postBoe = async (_summary: string) => {
  const { data, error } = await client
    .from('boes')
    .insert({
      date: dateRaw,
      url: scrapData.value?.url ?? '',
      summary: _summary,
    })
    .select();

  if (error) {
    console.error('Error creating BOE:', error);
    return;
  }

  boeId.value = data.value[0].id;
  boeUrl.value = scrapData.value?.url ?? '';
  summary.value = _summary;
};

const postAspects = async (_aspects: Aspect[]) => {
  const { error } = await client.from('aspects').insert(
    _aspects.map(({ aspect, type, description }) => ({
      boe_id: boeId.value,
      aspect,
      type,
      description,
    })),
  );

  if (error) {
    console.error('Error saving aspects:', error);
    return;
  }

  aspects.value = _aspects.map(({ aspect, type, description }) => ({
    aspect,
    type,
    description,
  }));
};

const postKeywords = async (_keywords: Keyword[]) => {
  const { error } = await client
    .from('keywords')
    .insert(
      _keywords.map(({ keyword }) => ({
        boe_id: boeId.value,
        keyword,
      })),
    )
    .select();

  if (error) {
    console.error('Error saving keywords:', error);
    return;
  }

  keywords.value = _keywords.map(({ keyword }) => keyword);
};

const postAreas = async (_areas: Area[]) => {
  const { error } = await client.from('areas').insert(
    _areas.map(({ name, description }) => ({
      boe_id: boeId.value,
      name,
      description,
    })),
  );

  if (error) {
    console.error('Error saving areas:', error);
    return;
  }

  areas.value = _areas.map(({ name, description }) => ({
    name,
    description,
  }));
};

const postMainPoints = async (_mainPoints: MainPoint[]) => {
  const { error } = await client.from('main_points').insert(
    _mainPoints.map(({ point }) => ({
      boe_id: boeId.value,
      point,
    })),
  );

  if (error) {
    console.error('Error saving main points:', error);
    return;
  }

  mainPoints.value = _mainPoints.map(({ point }) => point);
};

const getBoeData = async () => {
  const client = useSupabaseClient();
  isLoadingSummary.value = true;
  isLoadingMainPoints.value = true;
  isLoadingKeywords.value = true;
  isLoadingAreas.value = true;
  isLoadingAspects.value = true;

  debugger;

  try {
    // We scrap the BOE
    await scrapBoe();

    // We get the BOE from the database
    const { data: boeData } = await client
      .from('boes')
      .select(`*, areas (*), main_points (*), keywords (*), aspects (*)`)
      .eq('date', dateRaw)
      .single<BoeResponse>();

    // If the BOE doesn't exist, we generate and create the summary and post the BOE
    if (!boeData) {
      const summary = await generateSummary();
      isLoadingSummary.value = false;
      await postBoe(summary as string);
    } else {
      // Else, we set the data from the database
      boeId.value = boeData?.id ?? null;
      summary.value = boeData?.summary ?? '';
      aspects.value =
        boeData?.aspects.map(({ aspect, type, description }) => ({
          aspect,
          type,
          description,
        })) ?? [];
      mainPoints.value = boeData?.main_points.map(({ point }) => point) ?? [];
      keywords.value = boeData?.keywords.map(({ keyword }) => keyword) ?? [];
      areas.value =
        boeData?.areas.map(({ name, description }) => ({
          name,
          description,
        })) ?? [];

      isLoadingSummary.value = false;
      isLoadingMainPoints.value = false;
      isLoadingKeywords.value = false;
      isLoadingAreas.value = false;
      isLoadingAspects.value = false;
    }

    if (!aspects.value.length) {
      const aspects = await generateAspects();
      if (!aspects) return;

      await postAspects(aspects);
      isLoadingAspects.value = false;
    }

    if (!mainPoints.value.length) {
      const mainPoints = await generateMainPoints();
      if (!mainPoints) return;

      await postMainPoints(mainPoints);
      isLoadingMainPoints.value = false;
    }

    if (!keywords.value.length) {
      const keywords = await generateKeywords();
      if (!keywords) return;

      await postKeywords(keywords);
      isLoadingKeywords.value = false;
    }

    if (!areas.value.length) {
      const areas = await generateAreas();
      if (!areas) return;

      await postAreas(areas);
      isLoadingAreas.value = false;
    }
  } catch (e) {
    console.error('Error in getBoeData:', e);
  } finally {
    isLoadingSummary.value = false;
    isLoadingMainPoints.value = false;
    isLoadingKeywords.value = false;
    isLoadingAreas.value = false;
    isLoadingAspects.value = false;
  }
};

onMounted(async () => {
  await getBoeData();
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/text.scss' as *;

.Home {
  &__wrapper {
    @apply grid grid-cols-12 gap-5;
  }

  &__calendar {
    @apply col-span-12 xl:col-span-6 2xl:col-span-4;

    &--card {
      @apply min-h-[400px];
    }
  }

  &__summary {
    @apply col-span-12 md:col-span-6 2xl:col-span-5;

    &--card {
      @apply h-full min-h-[400px];
    }
  }

  &__stats {
    @apply col-span-12 md:col-span-6 2xl:col-span-3;

    &--card {
      @apply h-full min-h-[400px];
    }
  }

  &__mainPoints {
    @apply col-span-12 md:col-span-6 2xl:col-span-4;

    &--card {
      @apply h-full min-h-[400px];
    }
  }

  &__keywords {
    @apply col-span-12 md:col-span-6 2xl:col-span-4;

    &--card {
      @apply h-full min-h-[400px];
    }
  }

  &__areas {
    @apply col-span-12 md:col-span-6 2xl:col-span-4;

    &--card {
      @apply h-full min-h-[400px];
    }
  }

  &__aspects {
    &--card {
      @apply h-full min-h-[400px];
    }

    &--positive {
      @apply col-span-12 2xl:col-span-4;
    }

    &--negative {
      @apply col-span-12 2xl:col-span-4;
    }

    &--neutral {
      @apply col-span-12 2xl:col-span-4;
    }
  }
}
</style>
