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
import type { AvailableBoe } from '~/components/Calendar/Calendar.interfaces';
import type {
  Area,
  Aspect,
  BoeResponse,
  Keyword,
  MainPoint,
} from '~/models/boe';
import { SupabaseServices } from '~/services/supabase';
import type { Database } from '~/types/supabase';

interface Stats {
  positive: number;
  negative: number;
  neutral: number;
}

interface GenerateTask {
  condition: boolean;
  generate: () => Promise<any>;
  post: (data: any) => Promise<void>;
  loadingState: () => void;
}

// Consts
const client = useSupabaseClient<Database>();

const route = useRoute();

const formattedDate = formatDateToLocaleString(route.params.date as string);

// Composables
const { scrapData, isLoadingScrap, scrapUrl } = useScraper();

// Instances
const supabaseServices = new SupabaseServices();

// State
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

const boesList = ref<AvailableBoe[]>([]);

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
  const { data, error } = await client.from('boes').select('date, url');
  if (error) {
    console.error('Error getting all BOEs:', error);
    return;
  }
  boesList.value = data;
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  showCopiedText.value = true;

  setTimeout(() => {
    showCopiedText.value = false;
  }, 2000);
};

const postBoe = async (_summary: string) => {
  try {
    const postedBoeId = await supabaseServices.saveAndReturnBoeId({
      date: route.params.date as string,
      url: scrapData.value?.url ?? '',
      summary: _summary,
    });

    boeId.value = postedBoeId ?? null;
    summary.value = _summary;
  } catch (error) {
    console.error('Error saving boe:', error);
    throw error;
  }
};

const postAspects = async (_aspects: Aspect[]) => {
  if (!boeId.value) return;
  try {
    await supabaseServices.saveAspects(_aspects, boeId.value);
    aspects.value = _aspects.map(({ aspect, type, description }) => ({
      aspect,
      type,
      description,
    }));
  } catch (error) {
    console.error('Error saving aspects:', error);
    throw error;
  }
};

const postKeywords = async (_keywords: Keyword[]) => {
  if (!boeId.value) return;
  try {
    await supabaseServices.saveKeywords(_keywords, boeId.value);
    keywords.value = _keywords.map(({ keyword }) => keyword);
  } catch (error) {
    console.error('Error saving keywords:', error);
    throw error;
  }
};

const postAreas = async (_areas: Area[]) => {
  if (!boeId.value) return;
  try {
    await supabaseServices.saveAreas(_areas, boeId.value);
    areas.value = _areas.map(({ name, description }) => ({
      name,
      description,
    }));
  } catch (error) {
    console.error('Error saving areas:', error);
    throw error;
  }
};

const postMainPoints = async (_mainPoints: MainPoint[]) => {
  if (!boeId.value) return;
  try {
    await supabaseServices.saveMainPoints(_mainPoints, boeId.value);
    mainPoints.value = _mainPoints.map(({ point }) => point);
  } catch (error) {
    console.error('Error saving main points:', error);
    throw error;
  }
};

const initializeLoadingStates = () => {
  isLoadingSummary.value = true;
  isLoadingMainPoints.value = true;
  isLoadingKeywords.value = true;
  isLoadingAreas.value = true;
  isLoadingAspects.value = true;
};

const resetLoadingStates = () => {
  isLoadingSummary.value = false;
  isLoadingMainPoints.value = false;
  isLoadingKeywords.value = false;
  isLoadingAreas.value = false;
  isLoadingAspects.value = false;
};

const setBoeData = (boeData: BoeResponse) => {
  const dataMappers = {
    basic: () => {
      if (boeData?.id && boeData?.url) {
        boeId.value = boeData.id;
        boeUrl.value = boeData.url;
      }
    },
    summary: () => {
      if (boeData?.summary) {
        summary.value = boeData.summary;
        isLoadingSummary.value = false;
      }
    },
    areas: () => {
      if (boeData?.areas?.length) {
        areas.value = boeData.areas.map(({ name, description }) => ({
          name,
          description,
        }));
        isLoadingAreas.value = false;
      }
    },
    mainPoints: () => {
      if (boeData?.main_points?.length) {
        mainPoints.value = boeData.main_points.map(({ point }) => point);
        isLoadingMainPoints.value = false;
      }
    },
    keywords: () => {
      if (boeData?.keywords?.length) {
        keywords.value = boeData.keywords.map(({ keyword }) => keyword);
        isLoadingKeywords.value = false;
      }
    },
    aspects: () => {
      if (boeData?.aspects?.length) {
        aspects.value = boeData.aspects.map(
          ({ aspect, type, description }) => ({
            aspect,
            type,
            description,
          }),
        );
        isLoadingAspects.value = false;
      }
    },
  };

  Object.values(dataMappers).forEach((mapper) => mapper());
};

const generateAndPostMissingData = async (boeData: BoeResponse | null) => {
  const text = scrapData.value?.text ?? '';

  const generateTasks: GenerateTask[] = [
    {
      condition: !boeData || !boeData?.summary,
      generate: () => generateSummary(text),
      post: postBoe,
      loadingState: () => (isLoadingSummary.value = false),
    },
    {
      condition: !mainPoints.value.length,
      generate: () => generateMainPoints(text),
      post: postMainPoints,
      loadingState: () => (isLoadingMainPoints.value = false),
    },
    {
      condition: !keywords.value.length,
      generate: () => generateKeywords(text),
      post: postKeywords,
      loadingState: () => (isLoadingKeywords.value = false),
    },
    {
      condition: !areas.value.length,
      generate: () => generateAreas(text),
      post: postAreas,
      loadingState: () => (isLoadingAreas.value = false),
    },
    {
      condition: !aspects.value.length,
      generate: () => generateAspects(text),
      post: postAspects,
      loadingState: () => (isLoadingAspects.value = false),
    },
  ];

  for (const task of generateTasks) {
    if (task.condition) {
      const data = await task.generate();
      if (data) {
        await task.post(data);
        task.loadingState();
      }
    }
  }

  await getAllBoes();
};

const getBoeData = async () => {
  try {
    initializeLoadingStates();
    await scrapUrl(route.params.date as string);

    const { data: boeData } = await client
      .from('boes')
      .select(`*, areas (*), main_points (*), keywords (*), aspects (*)`)
      .eq('date', route.params.date)
      .single<BoeResponse>();

    if (boeData) setBoeData(boeData);
    await generateAndPostMissingData(boeData);
  } catch (error) {
    console.error('Error in getBoeData:', error);

    if ((error as { statusCode: number }).statusCode === 404) {
      // Post BOE with empty URL and empty summary
      await postBoe('');
    }
  } finally {
    await getAllBoes();
    resetLoadingStates();
  }
};

onMounted(() => {
  Promise.all([getAllBoes(), getBoeData()]).catch((error) => {
    console.error('Initial loading error:', error);
  });
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
