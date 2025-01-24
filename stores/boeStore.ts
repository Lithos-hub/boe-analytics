import type { Area, Aspect, Keyword, MainPoint } from '~/models/boe';

export const useBoeStore = defineStore('boe', () => {
  const boeUrl = ref(null);
  const boeJSON = ref(null);

  const isShowingJSON = ref(false);

  const summary = ref<string | null>(null);
  const mainPoints = ref<string[] | null>(null);
  const areas = ref<Area[] | null>(null);
  const keywords = ref<string[] | null>(null);
  const aspects = ref<Aspect[] | null>(null);

  const positiveAspects = computed(
    () => aspects.value?.filter(({ type }) => type === 'positive') ?? [],
  );
  const negativeAspects = computed(
    () => aspects.value?.filter(({ type }) => type === 'negative') ?? [],
  );
  const neutralAspects = computed(
    () => aspects.value?.filter(({ type }) => type === 'neutral') ?? [],
  );

  return {
    boeUrl,
    boeJSON,
    isShowingJSON,
    summary,
    mainPoints,
    areas,
    keywords,
    aspects,
    positiveAspects,
    negativeAspects,
    neutralAspects,
  };
});
