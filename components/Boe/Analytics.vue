<template>
  <div class="BoeAnalytics">
    <div class="BoeAnalytics__content">
      <div
        v-if="error"
        class="BoeAnalytics__error rounded border border-red-500 bg-red-500/10 p-5 text-red-200">
        {{ error }}
      </div>

      <div
        v-if="warningMessage && !error && isLoading"
        class="BoeAnalytics__warning rounded border border-yellow-500 bg-yellow-500/10 p-5 text-yellow-200">
        {{ warningMessage }}
        <small class="flex gap-5">
          <UIcon name="i-heroicons-exclamation-triangle" />
          El documento contiene aproximadamente {{ wordsCount }} palabras.
        </small>
      </div>

      <template v-else-if="!error && !isLoading">
        <header class="flex items-center justify-end gap-5 pb-5">
          <!-- Analyze again -->
          <UButton
            color="green"
            variant="soft"
            class="border border-green-500/50"
            icon="i-heroicons-arrow-down-tray"
            @click="downloadPDF">
            Descargar PDF
          </UButton>
          <!-- Analyze again -->
          <UButton
            color="primary"
            variant="soft"
            class="border border-primary-500/50"
            icon="i-heroicons-arrow-path"
            @click="fetchAnalytics">
            Analizar de nuevo
          </UButton>
          <!-- Show original document -->
          <UButton
            color="secondary"
            variant="soft"
            class="border border-secondary-500/50"
            icon="i-heroicons-arrow-top-right-on-square"
            :to="boeData?.link"
            target="_blank">
            Ver BOE original
          </UButton>
          <!-- Show JSON || Show Analysis -->
          <UButton
            color="dark"
            variant="soft"
            disabled
            class="border border-dark-500/50"
            :icon="
              showJSON
                ? 'i-heroicons-document-chart-bar'
                : 'i-heroicons-code-bracket'
            "
            @click="showJSON = !showJSON">
            {{ showJSON ? 'Ver análisis' : 'Ver JSON' }}
          </UButton>
        </header>

        <div v-if="!showJSON">
          <!-- Main Points Section -->
          <div class="BoeAnalytics__section--summary">
            <h2>Principales puntos</h2>
            <div v-if="mainPoints" v-html="mainPoints" />
          </div>

          <!-- Keywords Section -->
          <div class="BoeAnalytics__section--keywords">
            <h2>Palabras clave</h2>
            <div v-if="keywords" v-html="keywords" />
          </div>

          <!-- Areas Section -->
          <div class="BoeAnalytics__section--areas">
            <h2>Áreas afectadas</h2>
            <div v-if="areas" v-html="areas" />
          </div>

          <!-- Analysis Points Section -->
          <div class="BoeAnalytics__section BoeAnalytics__section--points">
            <h2>Aspectos a destacar</h2>
            <div v-if="analysisPoints" v-html="analysisPoints" />
          </div>
        </div>

        <pre v-else>{{ boeAnalysisJSON }}</pre>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import type { BoeScrapingResponse } from './Boe.interfaces';

export default defineComponent({
  props: {
    date: {
      type: String,
      required: true,
    },
  },

  async setup(props) {
    const error = ref<string | null>(null);
    const mainPoints = ref<string | null>(null);
    const keywords = ref<string | null>(null);
    const areas = ref<string | null>(null);
    const analysisPoints = ref<string | null>(null);
    const showJSON = ref<boolean>(false);
    const boeAnalysisJSON = ref<string>('');
    const boeData = ref<BoeScrapingResponse | null>(null);

    const warningMessage = ref<string | null>(null);
    const wordsCount = ref<number>(0);
    const isLoading = ref<boolean>(false);

    const downloadPDF = () => {
      const data: PDFData[] = [
        { heading: 'Puntos principales', text: mainPoints.value || '' },
        { heading: 'Palabras clave', text: keywords.value || '' },
        { heading: 'Áreas afectadas', text: areas.value || '' },
        { heading: 'Aspectos a destacar', text: analysisPoints.value || '' },
      ];

      generatePDF(data, 'boe-analysis');
    };

    const getTextChunks = (text: string): string[] => {
      wordsCount.value = text.split(' ').length;

      const maxTokens = 65536;
      const tokenPerChar = 0.3;
      const maxCharsPerChunk = Math.floor(maxTokens / tokenPerChar);

      const chunks: string[] = [];
      let currentIndex = 0;

      while (currentIndex < text.length) {
        let endIndex = currentIndex + maxCharsPerChunk;

        if (endIndex < text.length) {
          const lastPeriod = text.lastIndexOf('.', endIndex);
          const lastNewline = text.lastIndexOf('\n', endIndex);
          endIndex = Math.max(
            lastPeriod !== -1 ? lastPeriod + 1 : 0,
            lastNewline !== -1 ? lastNewline + 1 : 0,
          );

          if (endIndex <= currentIndex) {
            endIndex = currentIndex + maxCharsPerChunk;
          }
        }

        chunks.push(text.slice(currentIndex, endIndex));
        currentIndex = endIndex;
      }

      if (chunks.length > 1) {
        warningMessage.value =
          'El documento a analizar es muy grande, puede que esta operación tarde unos minutos.';
      }

      return chunks;
    };

    const fetchAnalytics = async () => {
      error.value = null;
      isLoading.value = true;
      const text = boeData.value?.text || '';
      const chunks = getTextChunks(text);

      try {
        let mainPointsHtml = '';
        let keywordsHtml = '';
        let areasHtml = '';
        let analysisPointsHtml = '';

        for (const chunk of chunks) {
          const [
            chunkMainPoints,
            chunkKeywords,
            chunkAreas,
            chunkAnalysisPoints,
          ] = await Promise.all([
            $fetch('/api/boe/main-points', {
              method: 'POST',
              body: { text: chunk },
            }),
            $fetch('/api/boe/keywords', {
              method: 'POST',
              body: { text: chunk },
            }),
            $fetch('/api/boe/areas', {
              method: 'POST',
              body: { text: chunk },
            }),
            $fetch('/api/boe/analysis-points', {
              method: 'POST',
              body: { text: chunk },
            }),
          ]);

          mainPointsHtml += chunkMainPoints.mainPointsHTML || '';
          keywordsHtml += chunkKeywords.keywordsHTML || '';
          areasHtml += chunkAreas.areasHTML || '';
          analysisPointsHtml += chunkAnalysisPoints.analysisPointsHTML || '';
        }

        mainPoints.value = mainPointsHtml;
        keywords.value = keywordsHtml;
        areas.value = areasHtml;
        analysisPoints.value = analysisPointsHtml;
      } catch (e) {
        error.value =
          'Error al cargar el análisis. Por favor, inténtelo de nuevo.';
        console.error('Error fetching analytics:', e);
      } finally {
        isLoading.value = false;
      }
    };

    // Fetch initial data
    const { data, error: fetchError } = await useFetch<BoeScrapingResponse>(
      `/api/scrap/${props.date}`,
    );

    // Aquí está el problema - no estamos manejando el error
    boeData.value = data.value;

    // Solución: Manejar el error explícitamente
    if (fetchError.value) {
      error.value =
        fetchError.value.statusCode === 404
          ? 'El BOE de esta fecha no existe o no se encuentra disponible'
          : 'Error al cargar el BOE. Por favor, inténtelo de nuevo.';
      return {
        error,
        downloadPDF,
        warningMessage,
        wordsCount,
        isLoading,
        mainPoints: ref(null),
        keywords: ref(null),
        areas: ref(null),
        analysisPoints: ref(null),
        showJSON: ref(false),
        boeAnalysisJSON: ref(''),
        boeData: ref(null),
        fetchAnalytics: () => {}, // función vacía ya que hay error
      };
    }

    // Solo ejecutar fetchAnalytics si no hay error
    await fetchAnalytics();

    return {
      error,
      mainPoints,
      keywords,
      areas,
      analysisPoints,
      showJSON,
      boeAnalysisJSON,
      boeData,
      fetchAnalytics,
    };
  },
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

  ul {
    @apply px-5;
  }

  // Main sections
  &__section {
    &--summary,
    &--areas,
    &--keywords,
    &--points {
      h2 {
        @apply my-5 rounded bg-blue-400/20 p-2 px-5 font-bold text-blue-400;
      }
    }

    &--summary :deep() {
      ul {
        @apply flex flex-col gap-2;
      }
    }

    &--areas :deep() {
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
        @apply p-5 text-justify text-sm;
      }
    }

    &--keywords :deep() {
      ul {
        @apply flex flex-wrap gap-2;

        li {
          @apply bg-primary/20 rounded px-5 py-1 text-sm font-bold;
        }
      }
    }

    // Puntos de análisis
    &--points {
      :deep() {
        .BoeAnalytics__section--points--positive {
          @apply my-5 rounded border border-green-500 bg-green-500/10 p-5 text-green-200;

          h2 {
            @apply pt-0 font-bold text-green-500;
          }

          li strong {
            @apply min-w-[400px];
          }
        }

        .BoeAnalytics__section--points--negative {
          @apply my-5 rounded border border-red-500 bg-red-500/10 p-5 text-red-200;

          h2 {
            @apply pt-0 font-bold text-red-500;
          }

          li strong {
            @apply min-w-[400px];
          }
        }

        .BoeAnalytics__section--points--neutral {
          @apply my-5 rounded border border-slate-400 bg-slate-400/10 p-5 text-slate-200;

          h2 {
            @apply pt-0 font-bold text-slate-500;
          }

          li strong {
            @apply min-w-[400px];
          }
        }
      }
    }
  }
}
</style>
