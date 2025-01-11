<template>
  <div>
    <div class="BoeAnalytics BoeAnalytics__content">
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
      <div v-if="!showJSON" v-html="boeAnalysisHTML" />
    </div>
    <pre
      v-if="showJSON"
      class="rounded border-dark-500/50 bg-dark-900 p-5 text-sm text-green-500"
      >{{ boeAnalysisJSON }}</pre
    >
  </div>
</template>

<script setup lang="ts">
import type {
  BoeAnalyticsResponse,
  BoeScrapingResponse,
} from './Boe.interfaces';

interface BoeAnalyticsProps {
  date: string;
}

const props = defineProps<BoeAnalyticsProps>();

const { data: boeData } = await useFetch<BoeScrapingResponse>(
  `/api/scrap/${props.date}`,
);

const getTextChunks = (text: string) => {
  const splittedTextByWords = text.split(/\s+/g);
  const chunks = [];
  for (let i = 0; i < splittedTextByWords.length; i += 65536) {
    chunks.push(splittedTextByWords.slice(i, i + 65536).join(' '));
  }
  return chunks;
};

const textChunks = getTextChunks(boeData.value?.text ?? '');

const boeAnalysisHTML = ref<string>('');
const boeAnalysisJSON = ref<string>('');
const showJSON = ref<boolean>(false);

const getBoeAnalysis = async () => {
  try {
    for (const chunk of textChunks) {
      const { data: boeAnalysisChunk } = await useFetch<BoeAnalyticsResponse>(
        `/api/boe-analytics`,
        {
          method: 'POST',
          body: {
            text: chunk,
          },
        },
      );
      boeAnalysisHTML.value += boeAnalysisChunk.value?.analysisHTML ?? '';
      boeAnalysisJSON.value = boeAnalysisChunk.value?.analysisJSON ?? '';
    }
  } catch (error) {
    console.error('Error getting BOE analysis:', error);
  }
};

await getBoeAnalysis();
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
