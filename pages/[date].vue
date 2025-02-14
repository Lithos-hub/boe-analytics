<template>
  <div class="flex flex-col gap-2.5">
    <BoeSelector />
    <div
      class="max-h-[calc(100vh-210px)] overflow-y-scroll rounded-2xl bg-dark-950/50 p-5 backdrop-blur-sm">
      <section class="flex flex-col gap-5" v-if="selectedDocumentToAnalyze">
        <header class="Home__header">
          <h2 class="Home__title">
            BOE del {{ formattedDate }} - ({{ selectedDocumentToAnalyze.id }})
          </h2>
          <div class="relative">
            <FeedbackMessage
              v-if="wordsCountAmountMessage && !isLoadingScrap"
              :message="wordsCountAmountMessage"
              :type="wordsCountAmountLevel" />
            <Loader v-else-if="isLoadingScrap" />
          </div>
          <div
            v-if="!isLoadingScrap && missingData.length && isLoadingAnalysis"
            class="flex items-center gap-2.5">
            <strong class="text-xs text-primary-500">
              Espere, por favor. Los siguientes apartados están siendo
              procesados:
            </strong>
            <ul class="flex flex-wrap gap-2.5">
              <li v-for="{ section } in missingData" :key="section">
                <UBadge class="animate-pulse" color="primary" variant="soft">
                  {{ section }}
                </UBadge>
              </li>
            </ul>
          </div>
        </header>
        <div class="Home__wrapper" v-if="!isShowingJSON">
          <section class="Home__summary">
            <article>
              <Card class="Home__summary--card" title="Resumen">
                <BoeSummary
                  :text="summary"
                  :is-loading-summary="isLoadingSummary" />
              </Card>
            </article>
          </section>
          <section class="Home__mainPoints">
            <article>
              <Card
                class="Home__mainPoints--card"
                title="Puntos principales del boletín">
                <BoeMainPoints
                  :main-points
                  :is-loading-main-points="isLoadingMainPoints" />
              </Card>
            </article>
          </section>
          <section class="Home__keywords">
            <article>
              <Card class="Home__keywords--card" title="Palabras clave">
                <BoeKeywords
                  :keywords
                  :is-loading-keywords="isLoadingKeywords" />
              </Card>
            </article>
          </section>
          <section class="Home__stats">
            <article>
              <Card class="Home__stats--card" title="Estadísticas">
                <BoeStats :stats :is-loading-stats="isLoadingAspects" />
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
        <div v-else class="relative max-w-[calc(100vw-400px)]">
          <pre
            class="overflow-x-auto rounded-2xl bg-dark-950/40 p-5 text-green-500"
            >{{ boeJSON }}</pre
          >
          <!-- Button to copy JSON to clipboard -->
          <div
            class="absolute right-10 top-5 flex w-[80px] flex-col items-center gap-2">
            <UButton
              color="green"
              variant="soft"
              icon="i-heroicons-clipboard-document-list"
              @click="copyToClipboard(boeJSON)" />
            <div
              class="rounded-full bg-dark-950/50 px-2 py-1 text-center"
              v-if="showCopiedText">
              <small class="text-green-500">¡Copiado!</small>
            </div>
          </div>
        </div>
      </section>
      <section
        v-else
        class="flex min-h-[calc(100vh-260px)] flex-col items-center justify-center gap-5">
        <h4 class="text-primary-500">
          Selecciona un documento para comenzar su análisis
        </h4>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Stats {
  positive: number;
  negative: number;
  neutral: number;
}

// Pinia
const boeStore = useBoeStore();

const {
  summary,
  mainPoints,
  areas,
  keywords,
  aspects,
  positiveAspects,
  negativeAspects,
  neutralAspects,
  isShowingJSON,
  boeJSON,
  isLoadingScrap,
  missingData,
  wordsCountAmountMessage,
  wordsCountAmountLevel,
  selectedMonth,
  selectedYear,
  isLoadingAreas,
  isLoadingAspects,
  isLoadingKeywords,
  isLoadingMainPoints,
  isLoadingSummary,
  isLoadingAnalysis,
  selectedDocumentToAnalyze,
} = storeToRefs(boeStore);

const { fetchBoesList, $resetBoeData, scrapUrl, scrapMonthDocuments } =
  boeStore;

// Consts
const route = useRoute();
const formattedDate = formatDateToLocaleString(route.params.date as string);

// Meta
definePageMeta({
  layout: 'boe',
});

// Head
useHead({
  title: `BOE del ${formattedDate} - BOE Analytics`,
  meta: [
    {
      name: 'description',
      content: `Análisis del BOE publicado a fecha de ${formattedDate}. Consulta un resumen breve del documento además de palabras clave; puntos principales; aspectos positivos, negativos y neutros y las distintas áreas en relación con el documento.`,
    },
    {
      property: 'og:title',
      content: `BOE del ${formattedDate} - BOE Analytics`,
    },
    {
      property: 'og:description',
      content: `Análisis del BOE publicado a fecha de ${formattedDate}. Consulta un resumen breve del documento además de palabras clave; puntos principales; aspectos positivos, negativos y neutros y las distintas áreas en relación con el documento.`,
    },
    {
      property: 'keywords',
      content:
        'BOE, análisis del BOE, BOE de España, Boletín Oficial del Estado, Inteligencia Artificial, DeepSeek, OpenAI, BOE resumido, Análisis del BOE',
    },
    {
      // TODO: Change this to the actual URL
      property: 'og:url',
      content: `https://www.example/${route.params.date}`,
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: `BOE del ${formattedDate} - BOE Analytics`,
    },
    {
      name: 'twitter:description',
      content: `Análisis del BOE publicado a fecha de ${formattedDate}. Consulta un resumen breve del documento además de palabras clave; puntos principales; aspectos positivos, negativos y neutros y las distintas áreas en relación con el documento.`,
    },
    // TODO: Change this to the actual image
    {
      name: 'twitter:image',
      content: 'https://www.example.com/path/to/image.jpg',
    },
  ],
});

// State
const showCopiedText = ref(false);

// Computed
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

// Methods
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  showCopiedText.value = true;

  setTimeout(() => {
    showCopiedText.value = false;
  }, 2000);
};

onMounted(async () => {
  $resetBoeData();

  selectedMonth.value = Number((route.params.date as string).split('-')[1]);
  selectedYear.value = Number((route.params.date as string).split('-')[0]);

  await fetchBoesList();
  await scrapMonthDocuments(selectedYear.value, selectedMonth.value);
  await scrapUrl(route.params.date as string);
});

watch(route, () => {
  $resetBoeData();
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/text.scss' as *;

.Home {
  &__header {
    @apply flex flex-col items-center justify-center gap-5;
  }
  &__title {
    @apply text-lg font-bold text-primary-500 xl:text-3xl;
  }
  &__wrapper {
    @apply grid grid-cols-12 gap-5;
  }

  &__calendar {
    @apply col-span-12 md:col-span-6 2xl:col-span-4;
  }

  &__summary {
    @apply col-span-12 xl:col-span-6;
  }

  &__mainPoints {
    @apply col-span-12 xl:col-span-6;
  }

  &__keywords {
    @apply col-span-12 xl:col-span-6;
  }

  &__areas {
    @apply col-span-12;
  }

  &__stats {
    @apply col-span-12 xl:col-span-6;
  }

  &__aspects {
    &--positive {
      @apply col-span-12 xl:col-span-4;
    }

    &--negative {
      @apply col-span-12 xl:col-span-4;
    }

    &--neutral {
      @apply col-span-12 xl:col-span-4;
    }
  }
}
</style>
