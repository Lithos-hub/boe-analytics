import type { AvailableBoe } from '~/components/Calendar/Calendar.interfaces';
import type {
  Area,
  Aspect,
  BoeResponse,
  Keyword,
  MainPoint,
} from '~/models/boe';
import type { ScrapResponse } from '~/server/api/documentsByDay/scrap.interfaces';
import { SupabaseServices } from '~/services/supabase';
import type { Database } from '~/types/supabase';
import type { GenerateTask, SectionToReGenerate } from './boeStore.interfaces';

interface AvailableScrapedBoe {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  text: string;
  date: string | null;
  has_all_data: boolean;
}

export const useBoeStore = defineStore('boe', () => {
  let abortFetchControllers: AbortController[] = [];
  let abortScrapControllers: AbortController[] = [];

  // Consts
  const supabaseServices = new SupabaseServices();
  const client = useSupabaseClient<Database>();
  const route = useRoute();

  // State
  const scrapData = ref<ScrapResponse | null>(null);

  const isLoadingScrap = ref(true);
  const scrapError = ref<string>();

  const isLoadingSummary = ref(false);
  const isLoadingMainPoints = ref(false);
  const isLoadingKeywords = ref(false);
  const isLoadingAreas = ref(false);
  const isLoadingAspects = ref(false);

  const boeId = ref<number | null>(null);

  const isShowingJSON = ref(false);

  const boesList = ref<AvailableBoe[]>([]);

  const summary = ref<string>('');
  const mainPoints = ref<string[]>([]);
  const areas = ref<Area[]>([]);
  const keywords = ref<string[]>([]);
  const aspects = ref<Aspect[]>([]);

  const selectedMonth = ref<number>(
    Number((route.params.date as string).split('-')[1]),
  );
  const selectedYear = ref<number>(
    Number((route.params.date as string).split('-')[0]),
  );

  const selectedDocumentToAnalyze = ref<AvailableScrapedBoe>();

  // Computed
  const isLoadingAnalysis = computed(() => {
    return (
      isLoadingSummary.value ||
      isLoadingMainPoints.value ||
      isLoadingKeywords.value ||
      isLoadingAreas.value ||
      isLoadingAspects.value
    );
  });

  const availableScrapedBoeDocuments = computed<AvailableScrapedBoe[]>(() => {
    if (!scrapData.value) return [];

    return Object.entries(scrapData.value).map(([key, boeData]) => {
      const boeInfo = boesList.value.find((boe) => boe.doc_id === key);

      return {
        id: key,
        ...boeData,
        date: boeInfo?.date || null,
        has_all_data: boeInfo?.has_all_data || false,
      };
    });
  });

  const wordsCount = computed(
    () => selectedDocumentToAnalyze.value?.text?.split(' ').length ?? 0,
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
    return selectedDocumentToAnalyze.value && isLoadingAnalysis.value
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
        resumen: summary.value,
        'puntos principales': mainPoints.value,
        'palabras clave': keywords.value,
        'áreas afectadas': areas.value,
        'aspectos a destacar': aspects.value,
      },
      null,
      2,
    ),
  );

  const createAndAddAbortController = (controllers: AbortController[]) => {
    const controller = new AbortController();
    controllers.push(controller);
    return controller;
  };

  const scrapUrl = async (endpoint: string) => {
    isLoadingScrap.value = true;
    console.error('Scraping...');
    try {
      const controller = createAndAddAbortController(abortScrapControllers);
      const data = (await $fetch(`api/documentsByDay/${endpoint}`, {
        signal: controller.signal,
      })) as ScrapResponse;
      scrapData.value = data;
    } catch (error: any) {
      console.error(
        `Error scraping url: api/documentsByDay/${endpoint}`,
        error,
      );
      scrapError.value =
        'Error al obtener los documentos. Inténtelo de nuevo más tarde.';
      throw error;
    } finally {
      isLoadingScrap.value = false;
    }
  };

  const fetchBoesList = async () => {
    const { data, error } = await client
      .from('boes')
      .select(`*, areas (*), main_points (*), keywords (*), aspects (*)`);

    if (error) {
      console.error('Error getting all BOEs:', error);
      return;
    }

    const boesWithDataStatus = data.map(({ date, doc_id, url, ...boe }) => ({
      date,
      doc_id,
      has_all_data: Boolean(
        boe.summary &&
          boe.summary.length &&
          boe.main_points &&
          boe.main_points.length &&
          boe.areas &&
          boe.areas.length &&
          boe.keywords &&
          boe.keywords.length &&
          boe.aspects &&
          boe.aspects.length,
      ),
    }));

    boesList.value = boesWithDataStatus;
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
        if (boeData?.id && boeData?.doc_id) {
          boeId.value = boeData.id;
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

  const getAndPostSummary = async (text: string) => {
    try {
      isLoadingSummary.value = true;
      const controller = createAndAddAbortController(abortFetchControllers);
      const summary = await generateSummary(text, controller.signal);
      await postBoe(summary as string);
    } catch (error) {
      console.error('Error getting and posting summary:', error);
    } finally {
      isLoadingSummary.value = false;
      await fetchBoesList();
    }
  };

  const getAndPostMainPoints = async (text: string) => {
    try {
      isLoadingMainPoints.value = true;
      const controller = createAndAddAbortController(abortFetchControllers);
      const mainPoints = await generateMainPoints(text, controller.signal);
      await postMainPoints(mainPoints as MainPoint[]);
    } catch (error) {
      console.error('Error getting and posting main points:', error);
    } finally {
      isLoadingMainPoints.value = false;
      await fetchBoesList();
    }
  };

  const getAndPostKeywords = async (text: string) => {
    try {
      isLoadingKeywords.value = true;
      const controller = createAndAddAbortController(abortFetchControllers);
      const keywords = await generateKeywords(text, controller.signal);
      await postKeywords(keywords as Keyword[]);
    } catch (error) {
      console.error('Error getting and posting keywords:', error);
    } finally {
      isLoadingKeywords.value = false;
      await fetchBoesList();
    }
  };

  const getAndPostAreas = async (text: string) => {
    try {
      isLoadingAreas.value = true;
      const controller = createAndAddAbortController(abortFetchControllers);
      const areas = await generateAreas(text, controller.signal);
      await postAreas(areas as Area[]);
    } catch (error) {
      console.error('Error getting and posting areas:', error);
    } finally {
      isLoadingAreas.value = false;
      await fetchBoesList();
    }
  };

  const getAndPostAspects = async (text: string) => {
    try {
      isLoadingAspects.value = true;
      const controller = createAndAddAbortController(abortFetchControllers);
      const aspects = await generateAspects(text, controller.signal);
      await postAspects(aspects as Aspect[]);
    } catch (error) {
      console.error('Error getting and posting aspects:', error);
    } finally {
      isLoadingAspects.value = false;
      await fetchBoesList();
    }
  };

  const generateAndPostMissingData = async ({
    boeData,
    specificDataToGenerate,
  }: {
    boeData?: BoeResponse | null;
    specificDataToGenerate?: RegenerateSection;
  }) => {
    const text = selectedDocumentToAnalyze.value?.text ?? '';

    if (specificDataToGenerate) {
      const options: SectionToReGenerate = {
        summary: () => getAndPostSummary(text),
        main_points: () => getAndPostMainPoints(text),
        keywords: () => getAndPostKeywords(text),
        areas: () => getAndPostAreas(text),
        aspects: () => getAndPostAspects(text),
      };

      await options[specificDataToGenerate]();
      return;
    }

    // If the BOE doesn't exist, we generate the summary and POST the BOE in the database
    if (!boeData || !boeData?.summary) {
      const summary = await generateSummary(text);
      await postBoe(summary as string);
      isLoadingSummary.value = false;
    }

    const generateTasks: GenerateTask[] = [
      {
        condition: !mainPoints.value?.length,
        generate: () => getAndPostMainPoints(text),
      },
      {
        condition: !keywords.value?.length,
        generate: () => getAndPostKeywords(text),
      },
      {
        condition: !areas.value?.length,
        generate: () => getAndPostAreas(text),
      },
      {
        condition: !aspects.value?.length,
        generate: () => getAndPostAspects(text),
      },
    ];

    // ! Parallel POST requests approach
    const postPromises = generateTasks
      .filter((task) => task.condition)
      .map(async (task) => await task.generate());

    await Promise.all(postPromises);

    // ! Sequential POST requests approach
    // for (const task of generateTasks) {
    //   if (task.condition) {
    //     await task.generate();
    //   }
    // }
  };

  const postBoe = async (_summary?: string) => {
    try {
      const boeAlreadyExists = await supabaseServices.checkBoeAlreadyExists(
        selectedDocumentToAnalyze.value?.id ?? '',
      );

      const boeData = {
        date: route.params.date as string,
        summary: _summary ?? '',
        doc_id: selectedDocumentToAnalyze.value?.id ?? '',
      };

      if (boeAlreadyExists) {
        boeId.value = await supabaseServices.updateAndReturnBoeId(boeData);
      } else {
        boeId.value = await supabaseServices.saveAndReturnBoeId(boeData);
      }

      summary.value = _summary ?? '';
    } catch (error) {
      console.error('Error saving boe:', error);
      throw error;
    } finally {
      await fetchBoesList();
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

  const getBoeData = async ({ id }: AvailableScrapedBoe) => {
    try {
      $resetSelectedDocumentData();
      initializeLoadingStates();

      const { data: boeData } = await client
        .from('boes')
        .select(`*, areas (*), main_points (*), keywords (*), aspects (*)`)
        .eq('doc_id', id)
        .single<BoeResponse>();

      setBoeData(boeData);
      await generateAndPostMissingData({ boeData });
    } catch (error) {
      console.error('Error in getBoeData:', error);
      resetLoadingStates();
    }
  };

  const abortAnalysis = () => {
    console.error('Aborting all analyses...');

    // Abortar todas las llamadas fetch
    abortFetchControllers.forEach((controller) => {
      try {
        controller.abort('Analysis stopped by user');
      } catch (error) {
        console.error('Error aborting fetch controller:', error);
      }
    });

    // Abortar todas las llamadas scrap
    abortScrapControllers.forEach((controller) => {
      try {
        controller.abort('Scraping stopped by user');
      } catch (error) {
        console.error('Error aborting scrap controller:', error);
      }
    });

    // Limpiar los arrays de controladores
    abortFetchControllers = [];
    abortScrapControllers = [];

    resetLoadingStates();
  };

  const $resetSelectedDocumentData = () => {
    boeId.value = null;
    summary.value = '';
    mainPoints.value = [];
    areas.value = [];
    keywords.value = [];
    aspects.value = [];
  };

  const $resetBoeData = () => {
    scrapData.value = null;
    selectedDocumentToAnalyze.value = undefined;
    isLoadingScrap.value = true;

    $resetSelectedDocumentData();
  };

  return {
    boesList,
    fetchBoesList,
    boeId,
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
    availableScrapedBoeDocuments,
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
    abortAnalysis,
    $resetBoeData,
    isLoadingAreas,
    isLoadingAspects,
    isLoadingKeywords,
    isLoadingMainPoints,
    isLoadingSummary,
    scrapError,
    selectedDocumentToAnalyze,
    generateAndPostMissingData,
    getBoeData,
  };
});
