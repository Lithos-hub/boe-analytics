import type { AvailableBoe } from '~/components/Calendar/Calendar.interfaces';
import type { Area, Aspect, Keyword, MainPoint } from '~/models/boe';
import type { ScrapResponse } from '~/server/api/scrap/scrap.interfaces';
import { SupabaseServices } from '~/services/supabase';
import type { Database } from '~/types/supabase';

export const useBoeStore = defineStore('boe', () => {
  // Consts
  const supabaseServices = new SupabaseServices();
  const client = useSupabaseClient<Database>();
  const route = useRoute();

  // State
  const scrapData = ref<ScrapResponse | null>(null);
  const isLoadingScrap = ref(true);

  const boeId = ref<number | null>(null);
  const boeUrl = ref<string>('');

  const isShowingJSON = ref(false);

  const boesList = ref<AvailableBoe[]>([]);

  const summary = ref<string>('');
  const mainPoints = ref<string[]>([]);
  const areas = ref<Area[]>([]);
  const keywords = ref<string[]>([]);
  const aspects = ref<Aspect[]>([]);

  const selectedMonth = ref<number>(new Date().getMonth() + 1);
  const selectedYear = ref<number>(new Date().getFullYear());

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
      return `El documento es pequeño y contiene aproximadamente ${count} palabras.`;
    if (wordsCountAmountLevel.value === 'warning')
      return `El documento es de tamaño considerable y contiene aproximadamente ${count} palabras.`;
    if (wordsCountAmountLevel.value === 'error')
      return `El documento contiene un gran número de palabras, aproximadamente ${count}.`;
    return '';
  });

  const positiveAspects = computed(
    () => aspects.value?.filter(({ type }) => type === 'positive') ?? [],
  );
  const negativeAspects = computed(
    () => aspects.value?.filter(({ type }) => type === 'negative') ?? [],
  );
  const neutralAspects = computed(
    () => aspects.value?.filter(({ type }) => type === 'neutral') ?? [],
  );

  const missingData = computed(() => {
    return boeUrl.value
      ? [
          {
            section: 'Resumen',
            data: summary.value,
          },
          {
            section: 'Puntos principales',
            data: mainPoints.value,
          },
          {
            section: 'Palabras clave',
            data: keywords.value,
          },
          {
            section: 'Áreas afectadas',
            data: areas.value,
          },
          {
            section: 'Aspectos a destacar y estadísticas',
            data: aspects.value,
          },
        ].filter(({ data }) => !data.length)
      : [];
  });

  const boeJSON = computed(() =>
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

  const scrapUrl = async (endpoint: string) => {
    try {
      const data = (await $fetch(`api/scrap/${endpoint}`)) as ScrapResponse;
      scrapData.value = data;
      boeUrl.value = data.url;
    } catch (error) {
      console.error(`Error scraping url: api/scrap/${endpoint}`, error);
      throw error;
    } finally {
      isLoadingScrap.value = false;
    }
  };

  const getAllBoes = async () => {
    const { data, error } = await client.from('boes').select('date, url');
    if (error) {
      console.error('Error getting all BOEs:', error);
      return;
    }
    boesList.value = data;
  };

  const postBoe = async (_summary: string) => {
    try {
      const boeAlreadyExists = await supabaseServices.checkBoeAlreadyExists(
        route.params.date as string,
      );

      const boeData = {
        date: route.params.date as string,
        url: scrapData.value?.url ?? '',
        summary: _summary,
      };

      if (boeAlreadyExists) {
        boeId.value = await supabaseServices.updateAndReturnBoeId(boeData);
      } else {
        boeId.value = await supabaseServices.saveAndReturnBoeId(boeData);
      }

      summary.value = _summary;
      boeUrl.value = boeData.url;
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

  const $resetBoeData = () => {
    scrapData.value = null;
    boeId.value = null;
    boeUrl.value = '';
    summary.value = '';
    mainPoints.value = [];
    areas.value = [];
    keywords.value = [];
    aspects.value = [];
  };

  return {
    boesList,
    getAllBoes,
    boeId,
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
    postBoe,
    postAspects,
    postKeywords,
    postAreas,
    postMainPoints,
    wordsCount,
    wordsCountAmountLevel,
    wordsCountAmountMessage,
    missingData,
    scrapData,
    isLoadingScrap,
    scrapUrl,
    selectedMonth,
    selectedYear,
    $resetBoeData,
  };
});
