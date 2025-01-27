import type { AvailableBoe } from '~/components/Calendar/Calendar.interfaces';
import type {
  Area,
  Aspect,
  BoeResponse,
  Keyword,
  MainPoint,
} from '~/models/boe';
import type { ScrapResponse } from '~/server/api/scrap/scrap.interfaces';
import { SupabaseServices } from '~/services/supabase';
import type { Database } from '~/types/supabase';
import type { GenerateTask } from './boeStore.interfaces';

export const useBoeStore = defineStore('boe', () => {
  const abortController = new AbortController();
  const abortSignal = abortController.signal;

  // Consts
  const supabaseServices = new SupabaseServices();
  const client = useSupabaseClient<Database>();
  const route = useRoute();

  // State
  const scrapData = ref<ScrapResponse | null>(null);

  const isLoadingScrap = ref(true);
  const isLoadingAnalysis = ref(false);
  const isLoadingSummary = ref(true);
  const isLoadingMainPoints = ref(true);
  const isLoadingKeywords = ref(true);
  const isLoadingAreas = ref(true);
  const isLoadingAspects = ref(true);

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

  const setBoeData = (boeData: BoeResponse | null) => {
    if (!boeData) return;

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

  const generateAndPostMissingData = async (boeData: any) => {
    const text = scrapData.value?.text ?? '';

    // If the BOE doesn't exist, we generate the summary and POST the BOE in the database
    if (!boeData || !boeData?.summary) {
      const summary = await generateSummary(text);
      await postBoe(summary as string);
      isLoadingSummary.value = false;
    }

    const generateTasks: GenerateTask[] = [
      {
        condition: !mainPoints.value?.length,
        generate: () => generateMainPoints(text, abortSignal),
        post: postMainPoints,
        loadingState: () => (isLoadingMainPoints.value = false),
      },
      {
        condition: !keywords.value?.length,
        generate: () => generateKeywords(text, abortSignal),
        post: postKeywords,
        loadingState: () => (isLoadingKeywords.value = false),
      },
      {
        condition: !areas.value?.length,
        generate: () => generateAreas(text, abortSignal),
        post: postAreas,
        loadingState: () => (isLoadingAreas.value = false),
      },
      {
        condition: !aspects.value?.length,
        generate: () => generateAspects(text, abortSignal),
        post: postAspects,
        loadingState: () => (isLoadingAspects.value = false),
      },
    ];

    const postPromises = generateTasks
      .filter((task) => task.condition)
      .map(async (task) => {
        const data = await task.generate();
        if (data) {
          await task.post(data);
          task.loadingState();
        }
      });

    await Promise.all(postPromises);
  };

  const getBoeData = async () => {
    isLoadingAnalysis.value = true;
    const dateFromParams = route.params.date as string;
    try {
      initializeLoadingStates();

      await scrapUrl(dateFromParams);

      const { data: boeData } = await client
        .from('boes')
        .select(`*, areas (*), main_points (*), keywords (*), aspects (*)`)
        .eq('date', dateFromParams)
        .single<BoeResponse>();

      setBoeData(boeData);
      await generateAndPostMissingData(boeData);
      isLoadingAnalysis.value = false;
    } catch (error) {
      console.error('Error in getBoeData:', error);

      if ((error as { statusCode: number }).statusCode === 404) {
        await postBoe('');
      }
    } finally {
      await getAllBoes();
      resetLoadingStates();
      isLoadingAnalysis.value = false;
    }
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

  const stopAnalysis = () => {
    abortController.abort('Analysis stopped by user');
    isLoadingAnalysis.value = false;
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
    isLoadingAnalysis,
    stopAnalysis,
    abortController,
    $resetBoeData,
    isLoadingAreas,
    isLoadingAspects,
    isLoadingKeywords,
    isLoadingMainPoints,
    isLoadingSummary,
    getBoeData,
  };
});
