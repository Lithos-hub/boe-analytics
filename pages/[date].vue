<template>
  <div class="flex flex-col gap-5">
    <header class="grid grid-cols-12 items-center justify-center gap-5">
      <div
        class="col-span-12 flex flex-wrap items-center justify-center gap-1 xl:col-span-4 xl:justify-start">
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
      <div class="col-span-12 text-center xl:col-span-4">
        <h2 class="text-white">BOE del {{ formattedDate }}</h2>
      </div>
      <div class="relative col-span-12 mx-auto md:ml-auto xl:col-span-4">
        <FeedbackMessage
          v-if="wordsCountAmountMessage && !isLoadingScrap"
          :message="wordsCountAmountMessage"
          :type="wordsCountAmountLevel" />
        <Loader v-else-if="isLoadingScrap" />
      </div>
    </header>
    <div class="Home__wrapper" v-if="!showJSON">
      <section class="Home__calendar">
        <article>
          <Card class="Home__calendar--card" title="Calendario">
            <Calendar :boes-list="boesList" />
          </Card>
        </article>
      </section>
      <section class="Home__summary">
        <article>
          <Card class="Home__summary--card" title="Resumen">
            <BoeSummary
              v-if="!isLoadingSummary"
              :text="summary ?? ''"
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
      <section class="Home__mainPoints">
        <article>
          <Card class="Home__mainPoints--card" title="Puntos clave del boletín">
            <BoeMainPoints
              :main-points
              :is-loading-main-points="isLoadingMainPoints" />
          </Card>
        </article>
      </section>
      <section class="Home__keywords">
        <article>
          <Card class="Home__keywords--card" title="Palabras clave">
            <BoeKeywords :keywords :is-loading-keywords="isLoadingKeywords" />
          </Card>
        </article>
      </section>
      <section class="Home__areas">
        <article>
          <Card class="Home__areas--card" title="Áreas">
            <BoeAreas :areas :is-loading-areas="isLoadingAreas" />
          </Card>
        </article>
      </section>
      <section class="Home__stats">
        <article>
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
      <section class="Home__aspects Home__aspects--positive">
        <article>
          <Card class="Home__aspects--card" title="Aspectos positivos">
            <BoeAspects
              type="positive"
              :aspects="positiveAspects"
              :is-loading-aspects="isLoadingAspects" />
          </Card>
        </article>
      </section>
      <section class="Home__aspects Home__aspects--negative">
        <article>
          <Card class="Home__aspects--card" title="Aspectos negativos">
            <BoeAspects
              type="negative"
              :aspects="negativeAspects"
              :is-loading-aspects="isLoadingAspects" />
          </Card>
        </article>
      </section>
      <section class="Home__aspects Home__aspects--neutral">
        <article>
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
      <pre
        class="overflow-x-auto rounded-2xl bg-dark-950/40 p-5 text-green-500"
        >{{ boeAnalysisJSON }}</pre
      >
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
          <small class="text-green-500">¡Copiado!</small>
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
  Boe,
  BoeResponse,
  Keyword,
  MainPoint,
} from '~/models/boe';
import type { Database } from '~/types/supabase';

interface Stats {
  positive: number;
  negative: number;
  neutral: number;
}

// Consts
const client = useSupabaseClient<Database>();

const route = useRoute();

const formattedDate = formatDateToLocaleString(route.params.date as string);

// State
const scrapData = ref<ScrapResponse | null>(null);
const boeUrl = ref<string>('');
const boeId = ref<number | null>(null);

const showJSON = ref(false);

const isLoadingScrap = ref(true);
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

const boesList = ref<{ date: string }[]>([]);

// Computed
const wordsCount = computed(
  () => scrapData.value?.text?.split(' ').length ?? 0,
);

const wordsCountAmountLevel = computed(() => {
  if (wordsCount.value < 1000) return 'info';
  if (wordsCount.value >= 1000 && wordsCount.value < 15000) return 'warning';
  if (wordsCount.value >= 15000) return 'error';
  else return 'info';
});

const wordsCountAmountMessage = computed(() => {
  if (!wordsCount.value) return '';

  const count = wordsCount.value;
  if (wordsCountAmountLevel.value === 'info')
    return `El documento contiene aproximadamente ${count} palabras.`;
  if (wordsCountAmountLevel.value === 'warning')
    return `El documento contiene aproximadamente ${count} palabras. El análisis puede tardar algo más de lo normal.`;
  if (wordsCountAmountLevel.value === 'error')
    return `El documento contiene un gran número de palabras, aproximadamente ${count}. Puede que se demore el análisis varios minutos.`;
  return '';
});

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

// Methods

const downloadPDF = () => {
  console.log('downloadPDF');
};

const getAllBoes = async () => {
  const { data, error } = await client.from('boes').select('date');
  if (error) {
    console.error('Error getting all BOEs:', error);
    return;
  }
  boesList.value = data;
};

const scrapBoe = async () => {
  try {
    const response = await $fetch<ScrapResponse>(
      `/api/scrap/${route.params.date}`,
    );
    scrapData.value = response;
    boeUrl.value = response?.url ?? '';
    isLoadingScrap.value = false;
  } catch (error) {
    console.error('Error scraping BOE data:', error);
    throw error;
  } finally {
    isLoadingScrap.value = false;
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
  try {
    return await $fetch<string>(`/api/openai/summary`, {
      method: 'POST',
      body: {
        text: scrapData.value?.text ?? '',
      },
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
  }
};

const postBoe = async (_summary: string) => {
  const { data, error } = await client
    .from('boes')
    .insert({
      date: route.params.date as string,
      url: scrapData.value?.url ?? '',
      summary: _summary,
    })
    .select()
    .single<Boe>();

  if (error) {
    console.error('Error creating BOE:', error);
    throw error;
  }

  boeId.value = data?.id ?? null;
  boeUrl.value = scrapData.value?.url ?? '';
  summary.value = _summary;
};

const postAspects = async (_aspects: Aspect[]) => {
  if (!boeId.value) {
    throw new Error('BOE ID is mandatory');
  }

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
    throw error;
  }

  aspects.value = _aspects.map(({ aspect, type, description }) => ({
    aspect,
    type,
    description,
  }));
};

const postKeywords = async (_keywords: Keyword[]) => {
  if (!boeId.value) {
    throw new Error('BOE ID is mandatory');
  }

  const { error } = await client.from('keywords').insert(
    _keywords.map(({ keyword }) => ({
      boe_id: boeId.value,
      keyword,
    })),
  );

  if (error) {
    console.error('Error saving keywords:', error);
    throw error;
  }

  keywords.value = _keywords.map(({ keyword }) => keyword);
};

const postAreas = async (_areas: Area[]) => {
  if (!boeId.value) {
    throw new Error('BOE ID is mandatory');
  }

  const { error } = await client.from('areas').insert(
    _areas.map(({ name, description }) => ({
      boe_id: boeId.value,
      name,
      description,
    })),
  );

  if (error) {
    console.error('Error saving areas:', error);
    throw error;
  }

  areas.value = _areas.map(({ name, description }) => ({
    name,
    description,
  }));
};

const postMainPoints = async (_mainPoints: MainPoint[]) => {
  if (!boeId.value) {
    throw new Error('BOE ID is mandatory');
  }
  const { error } = await client.from('main_points').insert(
    _mainPoints.map(({ point }) => ({
      boe_id: boeId.value,
      point,
    })),
  );

  if (error) {
    console.error('Error saving main points:', error);
    throw error;
  }

  mainPoints.value = _mainPoints.map(({ point }) => point);
};

const getBoeData = async () => {
  isLoadingSummary.value = true;
  isLoadingMainPoints.value = true;
  isLoadingKeywords.value = true;
  isLoadingAreas.value = true;
  isLoadingAspects.value = true;

  try {
    // We scrap the BOE (always, and only once)
    await scrapBoe();

    // We get the BOE from the database
    const { data: boeData } = await client
      .from('boes')
      .select(`*, areas (*), main_points (*), keywords (*), aspects (*)`)
      .eq('date', route.params.date)
      .single<BoeResponse>();

    // If the BOE exists, we set the id and url
    if (boeData?.id && boeData?.url) {
      boeId.value = boeData.id;
      boeUrl.value = boeData.url;
    }

    // If the areas exist, we set them
    if (boeData?.areas.length) {
      areas.value =
        boeData?.areas.map(({ name, description }) => ({
          name,
          description,
        })) ?? [];
      isLoadingAreas.value = false;
    }

    if (boeData?.main_points.length) {
      mainPoints.value = boeData?.main_points.map(({ point }) => point) ?? [];
      isLoadingMainPoints.value = false;
    }

    // If the keywords exist, we set them
    if (boeData?.keywords.length) {
      keywords.value = boeData?.keywords.map(({ keyword }) => keyword) ?? [];
      isLoadingKeywords.value = false;
    }

    // If the aspects exist, we set them
    if (boeData?.aspects.length) {
      aspects.value =
        boeData?.aspects.map(({ aspect, type, description }) => ({
          aspect,
          type,
          description,
        })) ?? [];
      isLoadingAspects.value = false;
    }

    // If the summary exists, we set it
    if (boeData?.summary) {
      summary.value = boeData?.summary ?? '';
      isLoadingSummary.value = false;
    }

    // If the BOE doesn't exist, we generate and create the summary and post the BOE
    if (!boeData || !boeData?.summary) {
      const summary = await generateSummary();
      await postBoe(summary as string);
      isLoadingSummary.value = false;
      await getAllBoes();
    }

    // If the aspects don't exist, we generate and post them
    if (!aspects.value.length) {
      const aspects = await generateAspects();
      if (!aspects) return;

      await postAspects(aspects);
      isLoadingAspects.value = false;
    }

    // If the main points don't exist, we generate and post them
    if (!mainPoints.value.length) {
      const mainPoints = await generateMainPoints();
      if (!mainPoints) return;

      await postMainPoints(mainPoints);
      isLoadingMainPoints.value = false;
    }

    // If the keywords don't exist, we generate and post them
    if (!keywords.value.length) {
      const keywords = await generateKeywords();
      if (!keywords) return;

      await postKeywords(keywords);
      isLoadingKeywords.value = false;
    }

    // If the areas don't exist, we generate and post them
    if (!areas.value.length) {
      const areas = await generateAreas();
      if (!areas) return;

      await postAreas(areas);
      isLoadingAreas.value = false;
    }
  } catch (error) {
    console.error('Error in getBoeData:', error);
  } finally {
    isLoadingSummary.value = false;
    isLoadingMainPoints.value = false;
    isLoadingKeywords.value = false;
    isLoadingAreas.value = false;
    isLoadingAspects.value = false;
  }
};

onMounted(async () => {
  await getAllBoes();
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
    @apply col-span-12 md:col-span-6 2xl:col-span-4;

    &--card {
      @apply min-h-[400px];
    }
  }

  &__summary {
    @apply col-span-12 md:col-span-6 2xl:col-span-4;

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

  &__stats {
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
