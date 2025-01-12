<template>
  <div class="BoeAnalytics">
    <div class="BoeAnalytics__content">
      <header class="flex items-center justify-end gap-5 pb-5">
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
        <div id="summary">
          <h2>Principales puntos</h2>
          <div
            v-if="mainPoints"
            class="BoeAnalytics__section"
            v-html="mainPoints" />
        </div>

        <!-- Keywords Section -->
        <div id="keywords">
          <h2>Palabras clave</h2>
          <div
            v-if="keywords"
            class="BoeAnalytics__section"
            v-html="keywords" />
        </div>

        <!-- Areas Section -->
        <div id="areas">
          <h2>Áreas afectadas</h2>
          <div v-if="areas" class="BoeAnalytics__section" v-html="areas" />
        </div>

        <!-- Analysis Points Section -->
        <div id="analysis-points">
          <div
            v-if="analysisPoints"
            class="BoeAnalytics__section"
            v-html="analysisPoints" />
        </div>

        <div v-if="error" class="BoeAnalytics__error">
          {{ error }}
        </div>
      </div>
      <pre
        v-else
        class="rounded border-dark-500/50 bg-dark-900 p-5 text-sm text-green-500"
        >{{ boeAnalysisJSON }}</pre
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BoeScrapingResponse } from './Boe.interfaces';

const props = defineProps<{
  date: string;
}>();

const error = ref<string | null>(null);
const mainPoints = ref<string | null>(null);
const keywords = ref<string | null>(null);
const areas = ref<string | null>(null);
const analysisPoints = ref<string | null>(null);
const showJSON = ref<boolean>(false);
const boeAnalysisJSON = ref<string>('');

const { data: boeData } = useFetch<BoeScrapingResponse>(
  `/api/scrap/${props.date}`,
);

const getTextChunks = (text: string): string[] => {
  const maxTokens = 65536;
  const tokenPerChar = 0.3;
  const maxCharsPerChunk = Math.floor(maxTokens / tokenPerChar);

  const chunks: string[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    // Calcular el final del chunk
    let endIndex = currentIndex + maxCharsPerChunk;

    // Si no hemos llegado al final del texto
    if (endIndex < text.length) {
      // Buscar el último punto o salto de línea antes del límite
      const lastPeriod = text.lastIndexOf('.', endIndex);
      const lastNewline = text.lastIndexOf('\n', endIndex);
      endIndex = Math.max(
        lastPeriod !== -1 ? lastPeriod + 1 : 0,
        lastNewline !== -1 ? lastNewline + 1 : 0,
      );

      // Si no encontramos un punto o salto de línea, cortar en el límite
      if (endIndex <= currentIndex) {
        endIndex = currentIndex + maxCharsPerChunk;
      }
    }

    chunks.push(text.slice(currentIndex, endIndex));
    currentIndex = endIndex;
  }

  return chunks;
};

const fetchAnalytics = async () => {
  error.value = null;
  const text = boeData.value?.text || '';
  const chunks = getTextChunks(text);

  try {
    let mainPointsHtml = '';
    let keywordsHtml = '';
    let areasHtml = '';
    let analysisPointsHtml = '';

    // Procesar cada chunk secuencialmente
    for (const chunk of chunks) {
      const [chunkMainPoints, chunkKeywords, chunkAreas, chunkAnalysisPoints] =
        await Promise.all([
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

      // Acumular los resultados HTML
      mainPointsHtml += chunkMainPoints.mainPointsHTML || '';
      keywordsHtml += chunkKeywords.keywordsHTML || '';
      areasHtml += chunkAreas.areasHTML || '';
      analysisPointsHtml += chunkAnalysisPoints.analysisPointsHTML || '';
    }

    // Actualizar los refs con los resultados completos
    mainPoints.value = mainPointsHtml;
    keywords.value = keywordsHtml;
    areas.value = areasHtml;
    analysisPoints.value = analysisPointsHtml;
  } catch (e) {
    error.value = 'Error al cargar el análisis. Por favor, inténtelo de nuevo.';
    console.error('Error fetching analytics:', e);
  }
};

await fetchAnalytics();
</script>
<style scoped lang="scss">
@use '@/assets/scss/text.scss' as *;

.BoeAnalytics :deep() {
  h2 {
    @apply py-5 text-xl font-bold;
  }

  p {
    @apply text-justify;
  }

  ul {
    @apply px-5;
  }

  #summary {
    h2 {
      @apply my-5 rounded bg-blue-400/20 p-2 px-5 font-bold text-blue-400;
    }

    ul {
      @apply flex flex-col gap-2;
    }
  }

  #areas {
    h2 {
      @apply my-5 rounded bg-blue-400/20 p-2 px-5 font-bold text-blue-400;
    }

    ul {
      @apply flex flex-col gap-2;
    }
  }

  #keywords {
    h2 {
      @apply my-5 rounded bg-blue-400/20 p-2 px-5 font-bold text-blue-400;
    }

    ul {
      @apply flex flex-wrap gap-2;

      li {
        @apply bg-primary/20 rounded px-5 py-1 text-sm font-bold;
      }
    }
  }

  #positive-points {
    @apply my-5 rounded border border-green-500 bg-green-500/10 p-5 text-green-200;
    h2 {
      @apply pt-0 font-bold text-green-500;
    }

    li {
      strong {
        @apply min-w-[400px];
      }
    }
  }

  #negative-points {
    @apply my-5 rounded border border-red-500 bg-red-500/10 p-5 text-red-200;
    h2 {
      @apply pt-0 font-bold text-red-500;
    }

    li {
      strong {
        @apply min-w-[400px];
      }
    }
  }

  #neutral-points {
    @apply my-5 rounded border border-slate-400 bg-slate-400/10 p-5 text-slate-200;
    h2 {
      @apply pt-0 font-bold text-slate-500;
    }

    li {
      strong {
        @apply min-w-[400px];
      }
    }
  }

  #evaluation {
    h2 {
      @apply my-5 rounded bg-primary-400/20 p-2 px-5 text-xl font-bold text-primary-400;
    }
  }

  .BoeAnalytics__content--list {
    @apply list-none;

    &-item {
      &--positive {
        @apply text-green-200;
      }

      &--negative {
        @apply text-red-200;
      }

      &--neutral {
        @apply text-slate-200;
      }
    }
  }
}
</style>
