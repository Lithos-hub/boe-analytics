<template>
  <div class="BoeAnalytics">
    <div class="BoeAnalytics__content">
      <div
        v-if="error"
        class="BoeAnalytics__error rounded border border-red-500 bg-red-500/10 p-5 text-red-200">
        {{ error }}
      </div>

      <header class="grid grid-cols-12 gap-5 pb-5" v-if="dataAvailable">
        <div class="col-span-6 flex items-center gap-5 text-yellow-500">
          <div v-if="wordsCount > 100">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-6 w-6" />
            <small>
              El documento contiene aproximadamente {{ wordsCount }} palabras.
              El proceso de análisis puede demorar más de lo normal.
            </small>
          </div>
        </div>
        <div class="col-span-6 flex justify-end gap-2">
          <!-- Download PDF -->
          <UButton
            color="green"
            variant="soft"
            class="border border-green-500/50"
            icon="i-heroicons-arrow-down-tray"
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
          <!-- Show original document -->
          <UButton
            color="secondary"
            variant="soft"
            class="border border-secondary-500/50"
            icon="i-heroicons-arrow-top-right-on-square"
            :to="boeUrl"
            target="_blank">
            Ver BOE original
          </UButton>
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
      </header>

      <div v-if="!showJSON">
        <!-- Main Points Section -->
        <div class="grid grid-cols-12 gap-5">
          <div class="BoeAnalytics__section--main-points col-span-6">
            <h2>Principales puntos</h2>
            <ol
              v-if="!isLoadingMainPoints && mainPoints && mainPoints.length"
              class="BoeAnalytics__main-points-list">
              <li v-for="point in mainPoints" :key="point" class="list-decimal">
                {{ point }}
              </li>
            </ol>
            <div
              class="flex items-center justify-center p-5"
              v-else-if="isLoadingMainPoints">
              <Loader :status-messages="['Generando puntos principales...']" />
            </div>
            <p class="text-red-500" v-else>
              No se han generado puntos principales.
            </p>
          </div>

          <!-- Keywords Section -->
          <div class="BoeAnalytics__section--keywords col-span-6">
            <h2>Palabras clave</h2>
            <ul
              v-if="!isLoadingKeywords && keywords && keywords.length"
              class="BoeAnalytics__keywords-list">
              <li v-for="keyword in keywords" :key="keyword">
                <small>{{ keyword }}</small>
              </li>
            </ul>
            <div
              class="flex items-center justify-center p-5"
              v-else-if="isLoadingKeywords">
              <Loader :status-messages="['Generando palabras clave...']" />
            </div>
            <p class="text-red-500" v-else>
              No se han generado palabras clave.
            </p>
          </div>
        </div>

        <!-- Areas Section -->
        <div class="BoeAnalytics__section--areas">
          <h2>Áreas afectadas</h2>
          <ul
            v-if="!isLoadingAreas && areas && areas.length"
            class="BoeAnalytics__areas-list">
            <li v-for="{ name, description } in areas" :key="name">
              <article class="BoeAnalytics__area-item-card">
                <strong class="BoeAnalytics__area-item--title">
                  {{ name }}
                </strong>
                <p class="BoeAnalytics__area-item--description">
                  {{ description }}
                </p>
              </article>
            </li>
          </ul>
          <div
            class="flex items-center justify-center p-5"
            v-else-if="isLoadingAreas">
            <Loader :status-messages="['Generando áreas afectadas...']" />
          </div>
          <p class="text-red-500" v-else>No se han generado áreas afectadas.</p>
        </div>

        <!-- Analysis Points Section -->
        <div class="BoeAnalytics__section BoeAnalytics__section--points">
          <h2>Aspectos a destacar</h2>
          <ul
            v-if="
              !isLoadingAspects && positiveAspects && positiveAspects.length
            "
            class="BoeAnalytics__section--points--positive">
            <h2>Aspectos positivos</h2>
            <li
              v-for="{ aspect, description } in positiveAspects"
              :key="aspect">
              <div class="flex flex-col gap-2 py-5">
                <strong class="flex items-center gap-2">
                  <UIcon name="i-heroicons-check-circle" class="h-6 w-6" />
                  {{ aspect }}
                </strong>
                <p>{{ description }}</p>
              </div>
            </li>
          </ul>
          <div
            class="flex items-center justify-center p-5"
            v-else-if="isLoadingAspects">
            <Loader :status-messages="['Generando aspectos a destacar...']" />
          </div>
          <p class="text-red-500" v-else>
            No se han generado aspectos a destacar.
          </p>

          <ul
            v-if="
              !isLoadingAspects && negativeAspects && negativeAspects.length
            "
            class="BoeAnalytics__section--points--negative">
            <h2>Aspectos negativos</h2>
            <li
              v-for="{ aspect, description } in negativeAspects"
              :key="aspect">
              <div class="flex flex-col gap-2 py-5">
                <strong class="flex items-center gap-2">
                  <UIcon name="i-heroicons-x-circle" class="h-6 w-6" />
                  {{ aspect }}
                </strong>
                <p>{{ description }}</p>
              </div>
            </li>
          </ul>
          <ul
            v-if="!isLoadingAspects && neutralAspects && neutralAspects.length"
            class="BoeAnalytics__section--points--neutral">
            <h2>Aspectos neutros</h2>
            <li v-for="{ aspect, description } in neutralAspects" :key="aspect">
              <div class="flex flex-col gap-2 py-5">
                <strong class="flex items-center gap-2">
                  <UIcon name="i-heroicons-minus-circle" class="h-6 w-6" />
                  {{ aspect }}
                </strong>
                <p>{{ description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <pre
        v-else-if="showJSON"
        class="overflow-x-auto rounded-2xl bg-dark-950 p-5 text-green-500"
        >{{ boeAnalysisJSON }}</pre
      >

      <div
        v-else-if="!dataAvailable && !isLoading"
        class="flex flex-col items-center justify-center gap-5">
        <p class="text-red-500">
          El BOE de hoy no está disponible. Inténtalo más tarde o consulta el
          BOE de otra fecha usando el calendario.
        </p>

        <!-- Button to come back -->
        <UButton
          color="primary"
          variant="soft"
          class="border border-primary-500/50"
          icon="i-heroicons-arrow-left"
          @click="router.back()">
          Volver
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  Area,
  Aspect,
  BoeResponse,
  Keyword,
  MainPoint,
  Statistic,
} from '~/models/boe';
import type { ScrapResponse } from '@/server/api/scrap/scrap.interfaces';

const { date } = useRoute().params;

const router = useRouter();

const scrapData = ref<ScrapResponse | null>(null);
const boeUrl = ref<string | null>(null);

const mainPoints = ref<string[] | null>(null);
const keywords = ref<string[] | null>(null);
const areas = ref<Area[] | null>(null);
const aspects = ref<Aspect[] | null>(null);
const stats = ref<Statistic[] | null>(null);

const showJSON = ref(false);

const error = ref<string | null>(null);

const isLoadingMainPoints = ref(true);
const isLoadingKeywords = ref(true);
const isLoadingAreas = ref(true);
const isLoadingAspects = ref(true);

const isLoading = computed(
  () =>
    isLoadingMainPoints.value ||
    isLoadingKeywords.value ||
    isLoadingAreas.value ||
    isLoadingAspects.value,
);

const boeId = ref<number | null>(null);

const wordsCount = computed(
  () => scrapData.value?.text?.split(' ').length ?? 0,
);

const positiveAspects = computed(() =>
  aspects.value?.filter(({ type }) => type === 'positive'),
);
const negativeAspects = computed(() =>
  aspects.value?.filter(({ type }) => type === 'negative'),
);
const neutralAspects = computed(() =>
  aspects.value?.filter(({ type }) => type === 'neutral'),
);

const dataAvailable = computed(
  () => mainPoints.value && keywords.value && areas.value && aspects.value,
);

const boeAnalysisJSON = computed(() =>
  JSON.stringify(
    {
      'puntos principales': mainPoints.value,
      'palabras clave': keywords.value,
      'áreas afectadas': areas.value,
      'aspectos a destacar': aspects.value,
      'aspectos positivos': positiveAspects.value,
      'aspectos negativos': negativeAspects.value,
      'aspectos neutros': neutralAspects.value,
    },
    null,
    2,
  ),
);

const getBoeData = async () => {
  const client = useSupabaseClient();

  try {
    const { data: boeData } = await client
      .from('boes')
      .select(`*, areas (*), main_points (*), keywords (*), aspects (*)`)
      .eq('date', date)
      .single<BoeResponse>();

    // We scrap and post the BOE only if it is not in the database
    if (!boeData) {
      await scrapBoe();
      await postBoe();
    }

    boeId.value = boeData?.id as number;
    boeUrl.value = boeData?.url ?? null;

    // If Main Points are not in the database, we need to generate them
    if (!boeData?.main_points?.length) {
      await generateAndCreateMainPoints();
      isLoadingMainPoints.value = false;
    }
    // If Keywords are not in the database, we need to generate them
    if (!boeData?.keywords?.length) {
      await generateAndCreateKeywords();
      isLoadingKeywords.value = false;
    }
    // If Areas are not in the database, we need to generate them
    if (!boeData?.areas?.length) {
      await generateAndCreateAreas();
      isLoadingAreas.value = false;
    }
    // If Stats are not in the database, we need to generate them
    if (!boeData?.aspects?.length) {
      await generateAndCreateStats();
      isLoadingAspects.value = false;
    }

    if (boeData?.main_points) {
      mainPoints.value = boeData.main_points.map(({ point }) => point);
    }
    if (boeData?.keywords) {
      keywords.value = boeData.keywords.map(({ keyword }) => keyword);
    }
    if (boeData?.areas) {
      areas.value = boeData.areas.map(({ name, description }) => ({
        name,
        description,
      }));
    }
    if (boeData?.aspects?.length) {
      aspects.value = boeData.aspects.map(({ aspect, type, description }) => ({
        aspect,
        type,
        description,
      }));
    }
  } catch (e) {
    console.error(e);
    error.value = 'Error al obtener los datos del BOE';
  } finally {
    isLoadingMainPoints.value = false;
    isLoadingKeywords.value = false;
    isLoadingAreas.value = false;
    isLoadingAspects.value = false;
  }
};

const scrapBoe = async () => {
  const { data: boeScrapData, error } = await useFetch<ScrapResponse>(
    `/api/scrap/${date}`,
  );

  if (error.value) {
    console.error('Error scraping BOE data:', error.value);
    return;
  }

  scrapData.value = boeScrapData.value;
};

const postBoe = async () => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('boes')
    .insert({
      date,
      url: scrapData.value?.url ?? '',
    })
    .select();

  if (error) {
    console.error('Error creating BOE:', error);
    return;
  }

  boeId.value = data[0].id;
};

const generateAndCreateKeywords = async () => {
  const { error } = await useFetch<string[]>(`/api/openai/keywords`, {
    method: 'POST',
    body: {
      text: scrapData.value?.text ?? '',
    },
  });

  if (error.value) {
    console.error('Error getting keywords:', error.value);
    return;
  }

  await postKeywords();
};

const generateAndCreateAreas = async () => {
  const { error } = await useFetch<Area[]>(`/api/openai/areas`, {
    method: 'POST',
    body: {
      text: scrapData.value?.text ?? '',
    },
  });

  if (error.value) {
    console.error('Error getting areas:', error.value);
    return;
  }

  await postAreas();
};

const generateAndCreateStats = async () => {
  const { error } = await useFetch<Aspect[]>(`/api/openai/analysis-points`, {
    method: 'POST',
    body: {
      text: scrapData.value?.text ?? '',
    },
  });

  if (error.value) {
    console.error('Error getting stats:', error.value);
    return;
  }

  await postAspects();
  await postStats();
};

const generateAndCreateMainPoints = async () => {
  const { error } = await useFetch<MainPoint[]>(`/api/openai/main-points`, {
    method: 'POST',
    body: {
      text: scrapData.value?.text ?? '',
    },
  });

  if (error.value) {
    console.error('Error getting main points:', error.value);
    return;
  }

  await postMainPoints();
};

const postKeywords = async () => {
  const client = useSupabaseClient();

  if (!keywords.value) {
    return;
  }

  const { error } = await client
    .from('keywords')
    .insert(
      keywords.value.map((keyword) => ({
        boe_id: boeId.value,
        keyword,
      })),
    )
    .select();

  if (error) {
    console.error('Error saving keywords:', error);
    return;
  }

  keywords.value = data.value?.map(({ keyword }) => keyword) ?? null;
};

const postAreas = async () => {
  const client = useSupabaseClient();

  if (!areas.value) {
    return;
  }

  const { data, error } = await client
    .from('areas')
    .insert(
      areas.value.map(({ name, description }) => ({
        boe_id: boeId.value,
        name,
        description,
      })),
    )
    .select();

  if (error) {
    console.error('Error saving areas:', error);
    return;
  }

  areas.value =
    data.value?.map(({ name, description }) => ({
      name,
      description,
    })) ?? null;
};

const postAspects = async () => {
  const client = useSupabaseClient();

  if (!aspects.value) {
    return;
  }

  const { data, error } = await client
    .from('aspects')
    .insert(
      aspects.value.map(({ aspect, type }) => ({
        boe_id: boeId.value,
        aspect,
        type,
      })),
    )
    .select();

  if (error) {
    console.error('Error saving aspects:', error);
    return;
  }

  aspects.value =
    data.value?.map(({ aspect, type }) => ({
      aspect,
      type,
    })) ?? null;
};

const postStats = async () => {
  const client = useSupabaseClient();

  if (!stats.value) {
    return;
  }

  const { data, error } = await client
    .from('statistics')
    .insert(
      Object.entries(stats.value).map(([key, value]) => ({
        boe_id: boeId.value,
        type: key,
        count: value,
      })),
    )
    .select();

  if (error) {
    console.error('Error saving stats:', error);
    return;
  }

  stats.value = data.value ?? null;
};

const postMainPoints = async () => {
  const client = useSupabaseClient();

  if (!mainPoints.value) {
    return;
  }

  const { error } = await client
    .from('main_points')
    .insert(
      mainPoints.value.map((point) => ({
        boe_id: boeId.value,
        point,
      })),
    )
    .select();

  if (error) {
    console.error('Error saving main points:', error);
    return;
  }

  mainPoints.value = data.value?.map(({ point }) => point) ?? null;
};

const downloadPDF = () => {
  console.log('downloadPDF');
};

onMounted(async () => {
  await getBoeData();
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/text.scss' as *;

.BoeAnalytics {
  h2 {
    @apply py-5 text-xl font-bold;
  }

  p {
    @apply text-justify;
  }

  ul,
  ol {
    @apply px-5;
  }

  // Main sections
  &__section {
    &--main-points,
    &--areas,
    &--keywords,
    &--points {
      h2 {
        @apply my-5 rounded bg-blue-400/20 p-2 px-5 font-bold text-blue-400;
      }
    }

    &--main-points {
      ol {
        @apply flex flex-col gap-2 text-justify;
      }
    }

    &--areas {
      ul {
        @apply grid grid-cols-3 gap-5;
      }

      .BoeAnalytics__area-item-card {
        @apply flex h-full flex-col gap-5 rounded-2xl border border-dark-500/50 bg-dark-950/40;
      }

      .BoeAnalytics__area-item--title {
        @apply min-h-[76px] p-2.5 text-center text-xl font-bold text-primary-500;
      }

      .BoeAnalytics__area-item--description {
        @apply px-5 pb-5 text-justify text-sm;
      }
    }

    &--keywords {
      ul {
        @apply flex flex-wrap gap-2;

        li {
          @apply bg-primary/10 rounded-full border border-primary-500 px-5 py-1 text-sm font-bold text-primary-200;
        }
      }
    }

    // Puntos de análisis
    &--points {
      .BoeAnalytics__section--points--positive {
        @apply my-5 rounded border border-green-500 bg-green-500/10 p-5 text-green-200;

        h2 {
          @apply my-0 bg-transparent pt-0 font-bold text-green-500;
        }

        li strong {
          @apply min-w-[400px];
        }
      }

      .BoeAnalytics__section--points--negative {
        @apply my-5 rounded border border-red-500 bg-red-500/10 p-5 text-red-200;

        h2 {
          @apply my-0 bg-transparent pt-0 font-bold text-red-500;
        }

        li strong {
          @apply min-w-[400px];
        }
      }

      .BoeAnalytics__section--points--neutral {
        @apply my-5 rounded border border-slate-400 bg-slate-400/10 p-5 text-slate-200;

        h2 {
          @apply my-0 bg-transparent pt-0 font-bold text-slate-500;
        }

        li strong {
          @apply min-w-[400px];
        }
      }
    }
  }
}
</style>
